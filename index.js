const fs = require('fs');
const { clusterApiUrl, Keypair } = require('@solana/web3.js');
const AllBridgePrices = require('./src/allbridge.price');
const KatanaPrices = require('./src/katana.prices');
const { getPrice, getPrices } = require('./src/utils');

(async () => {
    const fileEncoding = { encoding: 'utf8' };
    const formatJsonOutput = process.env.FORMAT_JSON || false;

    try {
        console.time("getCoveredCallPrice");
        const fileName = "katana-cover-all";
        const rpcUrl = process.env.RPC_URL || clusterApiUrl('mainnet-beta');

        const katana = new KatanaPrices(rpcUrl, Keypair.generate().publicKey)

        const list = await katana.getCoveredCallPriceList();

        //Save result with native token prices (e.g. kcSOL prices in SOL)
        const nativePrices = formatJsonOutput ? JSON.stringify(list, null, 4) : JSON.stringify(list);
        fs.writeFileSync(`./${fileName}.json`, nativePrices, fileEncoding);

        //Get prices from coingecko
        const coingeckoIds = Object.assign({}, ...list.map((x) => ({ [x.coingecko]: x.mint })));
        const coingeckoPrices = await getPrices(coingeckoIds);

        //Get prices as USDC
        const pricesUsdc = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            try {
                let mintPrice = coingeckoPrices[item.mint];
                if (mintPrice === undefined) {
                    console.log(`Getting USDC price for ${item.symbol}: ${item.address}`);
                    const mintPriceInfo = await getPrice(item.mint);
                    if (mintPriceInfo?.price) {
                        mintPrice = mintPriceInfo.price;
                    }
                }

                if (mintPrice) {
                    item.price = Number((item.price * mintPrice).toFixed(6));
                    delete item.mint;
                    delete item.coingecko;
                    pricesUsdc.push(item);
                }
                else {
                    console.error(`NO USDC price for ${item.symbol}`);
                }
            } catch (error) {
                console.error(`Failed getting USDC price for ${item.mint}`);
            }
        }

        //Save result with USDC prices (e.g. kcSOL prices in USDC)
        const usdcPrices = formatJsonOutput ? JSON.stringify(pricesUsdc, null, 4) : JSON.stringify(pricesUsdc);
        fs.writeFileSync(`./${fileName}-usdc.json`, usdcPrices, fileEncoding);

        console.timeEnd("getCoveredCallPrice");
    } catch (error) {
        console.error('Katana:ERROR:', error);
    }

    try {
        console.time("all-bridge");
        //All Bridge LP
        console.log("Getting All Bridge tokens");
        const allBridgeChainCode = "SOL";

        const allBridge = new AllBridgePrices();
        const result = await allBridge.getPriceList(allBridgeChainCode);

        //Save result with USDC prices (e.g. xABR prices in USDC)
        const xABRPrice = formatJsonOutput ? JSON.stringify(result, null, 4) : JSON.stringify(result);
        fs.writeFileSync(`./allbridge-usdc.json`, xABRPrice, fileEncoding);

        console.timeEnd("all-bridge");
    } catch (error) {
        console.error('AllBridge:ERROR:', error);
    }

})();
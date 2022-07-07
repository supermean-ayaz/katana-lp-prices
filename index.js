const fs = require('fs');
const { clusterApiUrl, Keypair } = require('@solana/web3.js');
const KatanaPrices = require('./src/katana.prices');
const { getPrice, sleep } = require('./src/utils');

(async () => {
    try {
        console.time("getCoveredCallPrice");
        const rpcUrl = clusterApiUrl('mainnet-beta');

        const katana = new KatanaPrices(rpcUrl, Keypair.generate().publicKey)

        const list = await katana.getCoveredCallPriceList();

        //Get prices as USDC
        const pricesUsdc = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            try {
                console.log(`Getting USDC price for ${item.symbol}: ${item.address}`);
                const mintPriceInfo = await getPrice(item.mint);
                if (mintPriceInfo && mintPriceInfo.price) {
                    item.price = Number((item.price * mintPriceInfo.price).toFixed(6));
                    delete item.mint;
                    pricesUsdc.push(item);
                }
                else {
                    console.error(`NO USDC price for ${item.symbol}`);
                }
            } catch (error) {
                console.error(`Failed getting USDC price for ${item.mint}`);
            }
        }

        console.timeEnd("getCoveredCallPrice");

        //Save result with native token prices (e.g. kcSOL prices in SOL)
        fs.writeFileSync('./katana-cover-all.json', JSON.stringify(list, null, 4), { encoding: 'utf8' });

        //Save result with USDC prices (e.g. kcSOL prices in USDC)
        fs.writeFileSync('./katana-cover-all-usdc.json', JSON.stringify(pricesUsdc, null, 4), { encoding: 'utf8' });
    } catch (error) {
        console.error(error);
    }
})();
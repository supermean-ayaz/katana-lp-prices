const { clusterApiUrl, Keypair } = require('@solana/web3.js');
const KatanaPrices = require('./src/katana.prices');

(async () => {
    try {
        const rpcUrl = clusterApiUrl("mainnet-beta");

        const katana = new KatanaPrices(rpcUrl, Keypair.generate().publicKey)

        const list = await katana.getAllCallPriceList();

        console.log(list);

    } catch (error) {
        console.error(error);
    }
})();
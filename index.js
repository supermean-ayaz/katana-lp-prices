const { BN, Provider, Program } = require('@project-serum/anchor');
const { clusterApiUrl, Keypair, Connection } = require('@solana/web3.js');
const { BasicIdentityContext, structuredIdl } = require('@katana-hq/sdk');
const { findPricePerShareAddress } = require('@katana-hq/sdk/dist/pda');
const { ROUNDS_PER_PAGE, TOKENS, STRUCTURED_ID } = require('@katana-hq/sdk/dist/utils/constants');

function createReadonlyWallet(pubKey) {
    return {
        publicKey: pubKey,
        signAllTransactions: (txs) => txs,
        signTransaction: (tx) => tx,
        payer: Keypair.generate(), // dummy unused payer
    };
}

function createAnchorProvider(rpcUrl, wallet, opts) {
    opts = opts ?? Provider.defaultOptions();
    const connection = new Connection(rpcUrl, opts.preflightCommitment);
    const provider = new Provider(connection, wallet, opts);
    return provider;
}

function createProgram(rpcUrl, wallet, programId, idl, confirmOptions) {
    const provider = createAnchorProvider(rpcUrl, wallet, confirmOptions);
    const program = new Program(idl, programId, provider);
    return program;
}

(async () => {
    try {
        const rpcUrl = clusterApiUrl("mainnet-beta");
        const identityContext = new BasicIdentityContext(TOKENS.SOL);

        //find the address
        const [pricePerShareAddress] = await findPricePerShareAddress(
            identityContext,
            new BN(ROUNDS_PER_PAGE).toNumber(),
            STRUCTURED_ID
        );

        console.log('pricePerShareAddress:', pricePerShareAddress.toString());

        const READONLY_PUBKEY = Keypair.generate().publicKey;
        const wallet = createReadonlyWallet(READONLY_PUBKEY);
        const katanaProgram = createProgram(rpcUrl, wallet, STRUCTURED_ID, structuredIdl);

        //get prices
        const pricePerShares = await katanaProgram.account.pricePerSharePage.fetch(pricePerShareAddress);
        console.log('prices:', pricePerShares.prices);

    } catch (error) {
        console.error(error);
    }
})();
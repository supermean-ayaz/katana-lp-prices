const { BN, Program, AnchorProvider } = require('@project-serum/anchor');
const { clusterApiUrl, Keypair, Connection } = require('@solana/web3.js');
const { BasicIdentityContext, structuredIdl } = require('@katana-hq/sdk');
const { findPricePerShareAddress, findStateAddress } = require('@katana-hq/sdk/dist/pda');
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
    opts = opts ?? AnchorProvider.defaultOptions();
    const connection = new Connection(rpcUrl, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, wallet, opts);
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
        const wallet = createReadonlyWallet(Keypair.generate().publicKey);

        const identityContext = new BasicIdentityContext(TOKENS.SOL);
        const program = createProgram(rpcUrl, wallet, STRUCTURED_ID, structuredIdl);

        //get state
        const [_, round] = await findStateAddress(identityContext, STRUCTURED_ID);
        console.log('round:', round);// round: 254

        //page index
        const pageIndex = round / new BN(ROUNDS_PER_PAGE).toNumber();
        console.log('pageIndex:', pageIndex); // pageIndex: 1.984375

        //find the address
        const [pricePerShareAddress] = await findPricePerShareAddress(
            identityContext,
            pageIndex,
            program.programId
        );

        console.log('pricePerShareAddress:', pricePerShareAddress.toString());

        //get prices
        const pricePerShares = await program.account.pricePerSharePage.fetch(pricePerShareAddress);
        console.log('prices:', pricePerShares.prices);

    } catch (error) {
        console.error(error);
    }
})();
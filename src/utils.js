const { Keypair, Connection } = require('@solana/web3.js');
const { Program, AnchorProvider } = require('@project-serum/anchor');

const createReadonlyWallet = (pubKey) => {
    return {
        publicKey: pubKey,
        signAllTransactions: (txs) => txs,
        signTransaction: (tx) => tx,
        payer: Keypair.generate(), // dummy unused payer
    };
}
exports.createReadonlyWallet = createReadonlyWallet;

const createAnchorProvider = (rpcUrl, wallet, opts) => {
    opts = opts ?? AnchorProvider.defaultOptions();
    const connection = new Connection(rpcUrl, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, wallet, opts);
    return provider;
}
exports.createAnchorProvider = createAnchorProvider;

const createProgram = (rpcUrl, wallet, programId, idl, confirmOptions) => {
    const provider = createAnchorProvider(rpcUrl, wallet, confirmOptions);
    const program = new Program(idl, programId, provider);
    return program;
};
exports.createProgram = createProgram;

const sleep = (seconds, log = true) => {
    if (log) { console.log(`Sleeping for ${seconds} seconds`); }
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
exports.sleep = sleep;

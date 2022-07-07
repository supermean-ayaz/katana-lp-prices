const { fetch } = require('cross-fetch');
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

const createAnchorProvider = (rpcUrl, wallet, opts) => {
    opts = opts ?? AnchorProvider.defaultOptions();
    const connection = new Connection(rpcUrl, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, wallet, opts);
    return provider;
}

const createProgram = (rpcUrl, wallet, programId, idl, confirmOptions) => {
    const provider = createAnchorProvider(rpcUrl, wallet, confirmOptions);
    const program = new Program(idl, programId, provider);
    return program;
};

const sleep = (seconds, log = true) => {
    if (log) { console.log(`Sleeping for ${seconds} seconds`); }
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const getPriceFromJup = async (tokenAddress) => {
    const res = await fetch(`https://price.jup.ag/v1/price?id=${tokenAddress}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "User-Agent": "KatanaPricingAgent/1.0.0"
        }
    });
    const result = await res.json();

    return result.data;
};

exports.createReadonlyWallet = createReadonlyWallet;
exports.createProgram = createProgram;
exports.getPrice = getPriceFromJup;
exports.sleep = sleep;
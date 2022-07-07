const { BN } = require('@project-serum/anchor');
const { TokenListProvider } = require('@solana/spl-token-registry')
const { clusterApiUrl, Keypair, PublicKey } = require('@solana/web3.js');
const { BasicIdentityContext, structuredIdl } = require('@katana-hq/sdk');
const { findPricePerShareAddress, findStateAddress } = require('@katana-hq/sdk/dist/pda');
const { ROUNDS_PER_PAGE, TOKENS, STRUCTURED_ID } = require('@katana-hq/sdk/dist/utils/constants');

const { createProgram, createReadonlyWallet, sleep } = require('./utils');

class KatanaPrices {
    constructor(rpcUrl, walletAddress) {
        this.rpcUrl = rpcUrl || clusterApiUrl("mainnet-beta");
        this.wallet = createReadonlyWallet(walletAddress || Keypair.generate().publicKey);
        this.program = createProgram(this.rpcUrl, this.wallet, STRUCTURED_ID, structuredIdl);
    }

    async getPriceByUnderlingMint(underlyingMintAddress) {
        try {
            const identityContext = new BasicIdentityContext(new PublicKey(underlyingMintAddress));

            //get state
            const [stateAddress] = await findStateAddress(identityContext, STRUCTURED_ID);
            //console.log('stateAddress:', stateAddress.toString());

            //get round
            const state = await this.program.account.state.fetch(stateAddress);
            const { round, decimals, underlyingTokenMint, derivativeTokenMint, quoteTokenMint } = state;

            //page index
            const pageIndex = new BN(round).div(new BN(ROUNDS_PER_PAGE)).toNumber();
            //console.log('pageIndex:', pageIndex); // pageIndex: 0

            //find the address
            const [pricePerShareAddress] = await findPricePerShareAddress(identityContext, pageIndex, this.program.programId);

            //console.log('pricePerShareAddress:', pricePerShareAddress.toString());

            //get prices
            const pricePerShares = await this.program.account.pricePerSharePage.fetch(pricePerShareAddress);
            const currentPrice = pricePerShares.prices[round - 1].toNumber() / Math.pow(10, decimals)

            return {
                price: currentPrice,
                round: round.toNumber(),
                mint: underlyingTokenMint.toString(),
                lpMint: derivativeTokenMint.toString(),
                //currency: quoteTokenMint.toString()
            };
        } catch (error) {
            throw error;
        }
    }

    async getAllCallPriceList() {
        try {
            //get tokenlist
            const tokenAddresses = Object.values(TOKENS).map(x => x.toString());
            let [tokensInfo, lpTokens] = await new Promise((resolve) => {
                new TokenListProvider().resolve().then((tokens) => {
                    const list = tokens.getList();
                    const result = list.filter(x => tokenAddresses.includes(x.address));
                    const kataLPs = tokens.filterByTag('Katana').getList();
                    resolve([result, kataLPs]);
                });
            });

            const priceList = [];
            for (let i = 0; i < tokensInfo.length; i++) {
                const token = tokensInfo[i];

                console.log(`Getting price for ${token.symbol}: ${token.address.toString()}`);

                try {
                    let price = await this.getPriceByUnderlingMint(token.address);
                    const lpInfo = lpTokens.filter(x => x.address === price.lpMint);
                    price = { ...price, mintSymbol: token.symbol, lpSymbol: lpInfo.length > 0 ? lpInfo[0].symbol : undefined }; //add symbols

                    priceList.push(price);
                } catch (error) {
                    console.error(error);
                }

                await sleep(1);
            }
            return priceList;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = KatanaPrices;
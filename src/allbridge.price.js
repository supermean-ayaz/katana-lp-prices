const { fetch } = require('cross-fetch');

class AllBridgePrices {
    constructor() {
        this.tokenInfo = {
            price: 0, //will be calculated later
            symbol: "xABR",
            address: "xAx6d1sjmBvpWkVZQEqgUvPmGBNndEXPxYpr3QVp61H" //Solana address
        }
    }

    async getPriceList(blockchainCode = "SOL") {
        try {
            //get tokenlist
            const res = await fetch(`https://allbridgeapi.net/staking-pool-info`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });
            const data = await res.json();
            const { stakeInfo } = data.find(x => x.blockchainId === blockchainCode);

            const result = {
                ...this.tokenInfo,
                price: Number((stakeInfo.totalStake / stakeInfo.totalSupply * stakeInfo.baseTokenInfo.price).toFixed(6))
            }

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AllBridgePrices;
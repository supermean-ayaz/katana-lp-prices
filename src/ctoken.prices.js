const { fetch } = require('cross-fetch');
const { normalizeAmount } = require('./utils');

class CTokenPrices {
    constructor() {
        this.cTokenDecimals = 18;
        //prices will be calculated later
        this.tokensInfo = [
            {
                symbol: "cSOL",
                address: "5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV",
                price: 0,
            },
            {
                symbol: "cUSDC",
                address: "993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk",
                price: 0,
            },
            {
                symbol: "csoETH",
                address: "AppJPZka33cu4DyUenFe9Dc1ZmZ3oQju6mBn9k37bNAa",
                price: 0,
            },
            {
                symbol: "cBTC",
                address: "Gqu3TFmJXfnfSX84kqbZ5u9JjSBVoesaHjfTsaPjRSnZ",
                price: 0,
            },
            {
                symbol: "cSRM",
                address: "4CxGuD2NMr6zM8f18gr6kRhgd748pnmkAhkY1YJtkup1",
                price: 0,
            },
            {
                symbol: "cUSDT",
                address: "BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8",
                price: 0,
            },
            {
                symbol: "csoFTT",
                address: "A38TjtcYrfutXT6nfRxhqwoGiXyzwJsGPmekoZYYmfgP",
                price: 0,
            },
            {
                symbol: "cORCA",
                address: "E9LAZYxBVhJr9Cdfi9Tn4GSiJHDWSZDsew5tfgJja6Cu",
                price: 0,
            },
            {
                symbol: "cRAY",
                address: "2d95ZC8L5XP6xCnaKx8D5U5eX6rKbboBBAwuBLxaFmmJ",
                price: 0,
            },
            {
                symbol: "cSBR",
                address: "4GAGuewTRMfBJukgu3HSzpT48iqP4bYVCq3tygnjqmxL",
                price: 0,
            },
            {
                symbol: "cMER",
                address: "BsWLxf6hRJnyytKR52kKBiz7qU7BB3SH77mrBxNnYU1G",
                price: 0,
            },
            {
                symbol: "cmSOL",
                address: "3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h",
                price: 0,
            },
            {
                symbol: "cETH",
                address: "FbKvdbx5h6F86h1pZuEqv7FxwmsVhJ88cDuSqHvLm6Xf",
                price: 0,
            },
            {
                symbol: "cSLND",
                address: "D3Cu5urZJhkKyNZQQq2ne6xSfzbXLU4RrywVErMA2vf8",
                price: 0,
            },
            {
                symbol: "cscnSOL",
                address: "AFq1sSdevxfqWGcmcz7XpPbfjHevcJY7baZf9RkyrzoR",
                price: 0,
            },
            {
                symbol: "cstSOL",
                address: "QQ6WK86aUCBvNPkGeYBKikk15sUg6aMUEi5PTL6eB4i",
                price: 0,
            },
            {
                symbol: "cUST",
                address: "nZtL8HKX3aQtk3VpdvtdwPpXF2uMia522Pnan2meqdf",
                price: 0,
            },
            {
                symbol: "cFTT",
                address: "DiMx1n2dJmxqFtENRPhYWsqi8Mhg2p39MpTzsm6phzMP",
                price: 0,
            },
            {
                symbol: "cUSDT-USDC",
                address: "6XrbsKScacEwpEW5DVNko9t5vW3cim9wktAeT9mmiYHS",
                price: 0,
            },
            {
                symbol: "cmSOL-SOL",
                address: "4icXEpFVMrcqob6fnd3jZ6KjKrc6cqre6do1f8kKAC1u",
                price: 0,
            }
        ];
    }

    // discord.com/channels/839224914720325703/879615939484725259/999442721112588340
    async getPriceList() {
        try {
            const pubKeyList = this.tokensInfo.map(x => x.address).join(',');

            //get tokenlist
            const res = await fetch(`https://api.solend.fi/v1/reserves?ids=${pubKeyList}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "MeanFi"
                }
            });
            const data = await res.json();

            const decimals18 = Math.pow(10, this.cTokenDecimals);
            for (let i = 0; i < data.results.length; i++) {
                const { reserve: { liquidity, collateral } } = data.results[i];
                //price=(availableAmount*10**18 + borrowedAmountWads)/(mintTotalSupply*10**18)
                const price = ((Number(liquidity.availableAmount) * decimals18) + Number(liquidity.borrowedAmountWads)) / (Number(collateral.mintTotalSupply) * decimals18);
                console.log('price: ', price);
            }

            const result = {
                ...this.tokenInfo,
                price: Number((stakeInfo.totalStake / stakeInfo.totalSupply * stakeInfo.baseTokenInfo.price).toFixed(6))
            }

            return [result];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CTokenPrices;
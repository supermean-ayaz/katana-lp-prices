const { fetch } = require('cross-fetch');
const { normalizeAmount } = require('./utils');

class CTokenPrices {
    constructor() {
        this.cTokenDecimals = 18;
        //prices will be calculated later
        //reserves: docs.solend.fi/Architecture/addresses/mainnet/main-pools#reserve
        this.tokensInfo = [
            {
                symbol: "cSOL",
                address: "5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV",
                reserve: "8PbodeaosQP19SjYFx855UMqWxH2HynZLdBXmsrbac36",
                price: 0,
            },
            {
                symbol: "cUSDC",
                address: "993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk",
                reserve: "BgxfHJDzm44T7XG68MYKx7YisTjZu73tVovyZSjJMpmw",
                price: 0,
            },
            {
                symbol: "csoETH",
                address: "AppJPZka33cu4DyUenFe9Dc1ZmZ3oQju6mBn9k37bNAa",
                reserve: "3PArRsZQ6SLkr1WERZWyC6AqsajtALMq4C66ZMYz4dKQ",
                price: 0,
            },
            {
                symbol: "cBTC",
                address: "Gqu3TFmJXfnfSX84kqbZ5u9JjSBVoesaHjfTsaPjRSnZ",
                reserve: "GYzjMCXTDue12eUGKKWAqtF5jcBYNmewr6Db6LaguEaX",
                price: 0,
            },
            {
                symbol: "cSRM",
                address: "4CxGuD2NMr6zM8f18gr6kRhgd748pnmkAhkY1YJtkup1",
                reserve: "5suXmvdbKQ98VonxGCXqViuWRu8k4zgZRxndYKsH2fJg",
                price: 0,
            },
            {
                symbol: "cUSDT",
                address: "BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8",
                reserve: "8K9WC8xoh2rtQNY7iEGXtPvfbDCi563SdWhCAhuMP2xE",
                price: 0,
            },
            {
                symbol: "csoFTT",
                address: "A38TjtcYrfutXT6nfRxhqwoGiXyzwJsGPmekoZYYmfgP",
                reserve: "2dC4V23zJxuv521iYQj8c471jrxYLNQFaGS6YPwtTHMd",
                price: 0,
            },
            {
                symbol: "cORCA",
                address: "E9LAZYxBVhJr9Cdfi9Tn4GSiJHDWSZDsew5tfgJja6Cu",
                reserve: "",
                price: 0,
            },
            {
                symbol: "cRAY",
                address: "2d95ZC8L5XP6xCnaKx8D5U5eX6rKbboBBAwuBLxaFmmJ",
                reserve: "9n2exoMQwMTzfw6NFoFFujxYPndWVLtKREJePssrKb36",
                price: 0,
            },
            {
                symbol: "cSBR",
                address: "4GAGuewTRMfBJukgu3HSzpT48iqP4bYVCq3tygnjqmxL",
                reserve: "Hthrt4Lab21Yz1Dx9Q4sFW4WVihdBUTtWRQBjPsYHCor",
                price: 0,
            },
            {
                symbol: "cMER",
                address: "BsWLxf6hRJnyytKR52kKBiz7qU7BB3SH77mrBxNnYU1G",
                reserve: "5Sb6wDpweg6mtYksPJ2pfGbSyikrhR8Ut8GszcULQ83A",
                price: 0,
            },
            {
                symbol: "cmSOL",
                address: "3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h",
                reserve: "CCpirWrgNuBVLdkP2haxLTbD6XqEgaYuVXixbbpxUB6",
                price: 0,
            },
            {
                symbol: "cETH",
                address: "FbKvdbx5h6F86h1pZuEqv7FxwmsVhJ88cDuSqHvLm6Xf",
                reserve: "CPDiKagfozERtJ33p7HHhEfJERjvfk1VAjMXAFLrvrKP",
                price: 0,
            },
            {
                symbol: "cSLND",
                address: "D3Cu5urZJhkKyNZQQq2ne6xSfzbXLU4RrywVErMA2vf8",
                reserve: "CviGNzD2C9ZCMmjDt5DKCce5cLV4Emrcm3NFvwudBFKA",
                price: 0,
            },
            {
                symbol: "cscnSOL",
                address: "AFq1sSdevxfqWGcmcz7XpPbfjHevcJY7baZf9RkyrzoR",
                reserve: "DUExYJG5sc1SQdMMdq6LdUYW9ULXbo2fFFTbedywgjNN",
                price: 0,
            },
            {
                symbol: "cstSOL",
                address: "QQ6WK86aUCBvNPkGeYBKikk15sUg6aMUEi5PTL6eB4i",
                reserve: "5sjkv6HD8wycocJ4tC4U36HHbvgcXYqcyiPRUkncnwWs",
                price: 0,
            },
            {
                symbol: "cUST",
                address: "nZtL8HKX3aQtk3VpdvtdwPpXF2uMia522Pnan2meqdf",
                reserve: "Ab48bKsiEzdm481mGaNVmv9m9DmXsWWxcYHM588M59Yd",
                price: 0,
            },
            {
                symbol: "cFTT",
                address: "DiMx1n2dJmxqFtENRPhYWsqi8Mhg2p39MpTzsm6phzMP",
                reserve: "8bDyV3N7ctLKoaSVqUoEwUzw6msS2F65yyNPgAVUisKm",
                price: 0,
            },
            {
                symbol: "cUSDT-USDC",
                address: "6XrbsKScacEwpEW5DVNko9t5vW3cim9wktAeT9mmiYHS",
                reserve: "9mZsd1b9cN7JyqJvkbqhVuTfg8PAuKjuhPxpcsVNjYoC",
                price: 0,
            },
            {
                symbol: "cmSOL-SOL",
                address: "4icXEpFVMrcqob6fnd3jZ6KjKrc6cqre6do1f8kKAC1u",
                reserve: "6ve8XyELbecPdbzSTsyhYKiWr7wg3JpjfxE1cqoN9qhN",
                price: 0,
            }
        ];
    }

    // discord.com/channels/839224914720325703/879615939484725259/999442721112588340
    async getPriceList() {
        try {
            const pubKeyList = this.tokensInfo.filter(x => x.reserve.length > 0).map(x => x.reserve).join(',');

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

                const tokenInfo = this.tokensInfo.find(x => x.address == collateral.mintPubkey);
                if (tokenInfo) {
                    tokenInfo.price = price;
                } else {
                    console.log(`No tokeinfo for ${collateral.mintPubkey}`);
                }
            }

            const result = this.tokensInfo.filter(x => x.reserve.length > 0).forEach(x => delete x.reserve);

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CTokenPrices;
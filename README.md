# Crypto Backend API in NodeJS 
API to fetch data of cryptocurrencies (bitcoin, Ethereum, and Matic-network).

# Features 
## Background Data Fetching
- Asynchronous data fetching and updating the database with the latest values every 2 hours interval.
## Stats
**API endpoint :** https://koinx-project-hro4.onrender.com/coin/${coin-name}/stats
- Bitcoin: https://koinx-project-hro4.onrender.com/coin/bitcoin/stats
- response demo:
 ```json
   {
      "message": "Data fetched successfully",
      "data": {
        "name": "bitcoin",
        "price": 94575,
        "marketCap": 1872483029853,
        "price_change_24h": -180.962571772965
      },
      "success": true
    }
```
- Ethereum: https://koinx-project-hro4.onrender.com/coin/ethereum/stats
- Matic network: https://koinx-project-hro4.onrender.com/coin/matic-network/stats

## Standard Deviation
**API endpoint :** https://koinx-project-hro4.onrender.com/coin/${coin-name}/deviation
- Bitcoin: https://koinx-project-hro4.onrender.com/coin/bitcoin/deviation
- response demo:
 ```json
   {
      "coin": "bitcoin",
      "standardDeviation": 45,
      "dataPoints": 2
    }
```
- Ethereum: https://koinx-project-hro4.onrender.com/coin/ethereum/deviation
- Matic network: https://koinx-project-hro4.onrender.com/coin/matic-network/deviation


# Contact
For any inquiries or issues, please reach out to:

- **Name:** Abhishek Kumawat
- **Email:** abhishekkumawat.ak21@gmail.com
- **Portfolio:** [Abhsihek Kumawat](https://abhishekkumawat.netlify.app/)
- **LinkedIn:** [Abhishek kumawat](https://www.linkedin.com/in/abhishekkumawt/)
- **Github:** [Abhsihek Kumawat](https://github.com/abhi0a11)

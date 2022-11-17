# Web 3 App
[![Test Web3](https://github.com/Jonas-Grill/mtp-blockchain/actions/workflows/test-web3.yml/badge.svg)](https://github.com/Jonas-Grill/mtp-blockchain/actions/workflows/test-web3.yml)

## TODO:
- [ ] Naming convention besser durchziehen manchmal camelcase manchmal mit underscore ... bad style

## Local Setup

Follow the steps to use the system locally.

### Prerequisites

1. Change directory to `web3`.
2. Install packages using npm `npm i`

### 1. Ganache configuration

To use the web3 applications locally, the [Ganache](https://trufflesuite.com/ganache/) application is required. 

- IP: `http://localhost:8545`
- Chain Id: `1337`
- MNEMONIC: `exclude curve virtual science volume siren nose crop bike again buffalo trick`

#### Ganache - Server config
![Ganache - Server config](assets/img/ganache-server-config.png)

#### Ganache - Accounts & Key config
![Ganache - Accounts & Key config](assets/img/ganache-accounts-key-config.png)

To properly view the deployed smart-contracts link the `truffle-config.js` to Ganache.

#### Ganache - Truffle Config JS config
![Ganache - Truffle Config JS config](assets/img/ganache-smart-contracts-js.png)

### 2. Deploy smart contracts to local chain

To properly use the API the corresponding smart contracts have to be deployed to the local chain. 

The docu how to deploy the smart contracts to the chain can be viewed in the [Readme](../smart-contracts/README.md)  from the `smart-contracts` module. 

### 3. Create .env file
A environment file has to be created to store the current env and the JWT secrets key.

Create a `.env` file in the `web3/` root folder.

```
# Node Environment
NODE_ENV=dev

# Secrets Key for JWT
JWT_SECRET_KEY=TEST_JWT_SECRET_KEY
```

Do not change the JWT_SECRET_KEY key otherwise the in Postman set JWT token is not valid. 

#### 3.1. JWT

JWT is used to create tokens which get validated on our side against a secret.

To test use the following `JWT_SECRET_KEY=TEST_JWT_SECRET_KEY` for the `.env` file and the following token:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVHVlIE5vdiAxNSAyMDIyIDIxOjM0OjU4IEdNVCswMTAwIChNaXR0ZWxldXJvcMOkaXNjaGUgTm9ybWFsemVpdCkiLCJhZGRyZXNzIjoiMHg5MTc0NDE0MTIyMjNBYzExMDQ2MTdDYTA3Y2E5ODUzNTA0QkVBNWQwIiwiaWF0IjoxNjY4NTQ0NDk4fQ.u4u-poigpIpjVLis7idFF3Ga4u-yngwXSqxYIJT7oC0
```

### 4. Deploy smart contracts 
To use the API the `index.js` file has to be started using node js. 

```
npm run dev
```

### 5. Usage
The API is accessible over the `8080` Port on `localhost`. 

#### 5.1 Postman
The API can be accessed and tested using the software postman. The configuration file is located under:

- File: `assets/postman/MTP Blockchain.postman_collection.json` > [link](assets/postman)

Just import the json file into postman to access the API. 
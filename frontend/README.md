# Frontend
[![Test Web3](https://github.com/Jonas-Grill/mtp-blockchain/actions/workflows/test-web3.yml/badge.svg)](https://github.com/Jonas-Grill/mtp-blockchain/actions/workflows/test-web3.yml)

## TODO
- [ ] Fix failed tests in cicd

## Local Setup

Follow the steps to use the system locally.

### Prerequisites

1. Change directory to `frontend`.
2. Install packages using npm `npm i`

### 1. Ganache configuration

To use the web3 applications locally, the [Ganache](https://trufflesuite.com/ganache/) application is required. 

- IP: `http://127.0.0.1:8545`
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

### 3. Deploy smart contracts 
To use the frontend run: 

```
npm run dev
```

### 4. Usage
The frontend is accessible over the `3000` Port on `127.0.0.1`.

## KNOWN ISSUES

### 1. Web3 tests fail in cicd
Functions are tested using the web3 tests in `web3/test/`. Unfourtunately some tests fail if executed in the cicd. Locally all test run properly.

> The failed tests are skipped in the cicd

The tests fail with the following error:

```
Error: Transaction has been reverted by the EVM:
{
  "transactionHash": "0x2ca45061fe9f0bf0905c28e8c6f83e31476f359247d76f38a43844a1d76bfd66",
  "transactionIndex": 0,
  "blockNumber": 17,
  "blockHash": "0x42a3e5baa41620be9dcecd48c9da42c09ee1ec10940835202bfd892cc9b102a8",
  "from": "0xdb2b0bd5112a85ca2b073146f7cf3da6eb9bf55d",
  "to": "0x44f35b285db0727c211bbf304734eea38d1f5733",
  "cumulativeGasUsed": 24417,
  "gasUsed": 24417,
  "contractAddress": null,
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": false,
  "effectiveGasPrice": 2619659664,
  "type": "0x2",
  "events": {}
}
      at Object.TransactionError (node_modules/web3-core-helpers/lib/errors.js:87:21)
      at Object.TransactionRevertedWithoutReasonError (node_modules/web3-core-helpers/lib/errors.js:98:21)
      at /home/runner/work/mtp-blockchain/mtp-blockchain/frontend/node_modules/web3-core-method/lib/index.js:396:57
      at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
```
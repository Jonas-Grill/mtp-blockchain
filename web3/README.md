# Web 3 App
[![Test Web3](https://github.com/Jonas-Grill/mtp-blockchain/actions/workflows/test-web3.yml/badge.svg)](https://github.com/Jonas-Grill/mtp-blockchain/actions/workflows/test-web3.yml)

## TODO:
- [ ] Naming convention besser durchziehen manchmal camelcase manchmal mit underscore ... bad style

## Usage
To use the API the index.js file has to be started using node js. 

```
node index.js
```

A environment file has to be created to store the current env and the JWT secrets key.

## Local develoment

To use the web3 applications locally, the Ganache application is required. 

### Ganache configuration

- IP: `http://localhost:8545`
- Chain Id: `1337`
- MNEMONIC: `exclude curve virtual science volume siren nose crop bike again buffalo trick`

![Ganache - Server config](assets/img/ganache-server-config.png)
![Ganache - Accounts & Key config](assets/img/ganache-accounts-key-config.png)


## Config

Create a `.env` file in the `web3/` root folder.

```
# Node Environment
NODE_ENV=dev

# Secrets Key for JWT
JWT_SECRET_KEY=TEST_JWT_SECRET_KEY
```

## JWT

JWT is used to create tokens which get validated on our side against a secret.

To test use the following `JWT_SECRET_KEY=TEST_JWT_SECRET_KEY` for the `.env` file and the following token:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiVHVlIE5vdiAxNSAyMDIyIDIxOjM0OjU4IEdNVCswMTAwIChNaXR0ZWxldXJvcMOkaXNjaGUgTm9ybWFsemVpdCkiLCJhZGRyZXNzIjoiMHg5MTc0NDE0MTIyMjNBYzExMDQ2MTdDYTA3Y2E5ODUzNTA0QkVBNWQwIiwiaWF0IjoxNjY4NTQ0NDk4fQ.u4u-poigpIpjVLis7idFF3Ga4u-yngwXSqxYIJT7oC0
```

## Postman
The API can be accessed and tested using the software postman. The configuration file is located under:

- File: `assets/postman/MTP Blockchain.postman_collection.json` > [link](assets/postman)

Just import the json file into postman to access the API. 


const express = require("express");
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());

// require web3
const Web3 = require('web3');

// Read arguments passed with execution of node
const argv = require('minimist')(process.argv.slice(2));

// Fallback to dev .env if "--env" is "dev"
if (argv["env"] != "prd") {
    console.log("Using dev .env");
    require('dotenv').config({ path: 'config/dev/.env' });
}

// setup web3
const web3Provider = new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER);
const web3 = new Web3(web3Provider);

// Get port
API_PORT = process.env.API_PORT

// create sendEth endpoint
app.post("/sendEth", async (req, res) => {

    const abi = [{
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "sendEth",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    }]

    const faucetContract = new web3.eth.Contract(abi, process.env.FAUCET_STORAGE_CONTRACT_ADDRESS, { from: process.env.UNLOCKED_ACCOUNT })

    await faucetContract.methods.sendEth(req.body["toAddress"]).send({ from: process.env.UNLOCKED_ACCOUNT });

    res.sendStatus(200);
});

app.listen(API_PORT, () => {
    console.log("Server running on port " + API_PORT);
});
/*
Store some utility functions
*/

class NOWUtils {
    /**
     * Returns the eth amount from wei
     *
     * @param {int} wei
     * @returns eth
     */
    weiToEth(wei) {
        return Number(wei) / Number(1000000000000000000);
    }

    /**
     * Returns the wei amount from eth
     *
     * @param {float} eth
     */
    ethToWei(eth) {
        return parseFloat(eth) * Number(1000000000000000000);
    }

    /**
     * Returns the object of the smart contract
     *
     * @param {string} contractName name of the json contract file without the json suffix
     * @return json object
     */
    getContractJson(contractName) {
        const json = require(`../../../../smart-contracts/build/contracts/${contractName}.json`);

        return JSON.parse(JSON.stringify(json))
    }

    /**
     * Returns the abi given the json file name
     *
     * @param {string} contractName name of the json contract file without the json suffix
     * @returns json abi object
     */
    getContractAbi(contractName) {
        return this.getContractJson(contractName).abi;
    }

    /**
     * Returns the address of the smart contract
     *
     * @param {string} contractName name of the json contract file without the json suffix
     * @param {int} networkId Id of the network the blockchain is running on
     * @returns contract address
     */
    getContractAddress(contractName, networkId) {
        const deployedNetwork = this.getContractJson(contractName).networks[networkId];

        return deployedNetwork.address;
    }

    /**
     * Return the interface from the smart contract
     *
     * @param {web3} web3 web3 instance to connect to blockchain
     * @param {string} contractName Name of the contract to return
     * @param {string} fromAddress Address the contract should be executed from
     * @param {int} networkId Id of the network the blockchain is running on
     * @returns Interface from the smart contract
     */
    getContract(web3, contractName, fromAddress, networkId) {
        // faucet storage abi
        const abi = this.getContractAbi(contractName)

        // address from FaucetStorage contract
        const contractAddress = this.getContractAddress(contractName, networkId)

        // Get faucetStorageContract using logged in web3 address
        return new web3.eth.Contract(abi, contractAddress, {
            from: fromAddress
        });
    }

    /**
     * Return the assignment validator contract from the smart contract
     *
     * @param {web3} web3
     * @param {string} fromAddress
     * @param {string} assignmentValidatorContractAddress
     * @returns
     */
    getAssignmentValidatorContract(web3, fromAddress, assignmentValidatorContractAddress) {
        // faucet storage abi
        const abi = this.getContractAbi("BaseAssignmentValidator")

        console.log("assignmentValidatorContractAddress", assignmentValidatorContractAddress)
        // Get faucetStorageContract using logged in web3 address
        return new web3.eth.Contract(abi, assignmentValidatorContractAddress, {
            from: fromAddress
        });
    }

    /**
     * Returns the from account
     *
     * @param {web3} web3 web3 instance to connect to blockchain
     * @returns the from account
     */
    async getFromAccount(web3) {
        try {
            const address = await web3.eth.requestAccounts();
            return address[0];
        }
        catch (error) {
            const address = await web3.eth.getAccounts();
            return address[0];
        }
    }


    /*=============================================
    =              BLOCK HELPER                 =
    =============================================*/

    /**
     * Returns the average time for a block to mine
     *
     * @param {web3} web3 Web3 instance to connect to blockchain
     * @returns average time for a block to mine
     */
    async getBlockAverageTime(web3) {
        const span = 100
        const times = []
        const currentNumber = await web3.eth.getBlockNumber()
        const firstBlock = await web3.eth.getBlock(currentNumber - span)
        let prevTimestamp = firstBlock.timestamp

        for (let i = currentNumber - span + 1; i <= currentNumber; i++) {
            const block = await web3.eth.getBlock(i)
            let time = block.timestamp - prevTimestamp
            prevTimestamp = block.timestamp
            times.push(time)
        }

        return Math.round(times.reduce((a, b) => a + b) / times.length)
    }

    /**
     * Returns the current block
     *
     * @param {web3} web3 Web3 instance to connect to blockchain
     * @returns Return current block
     */
    async getCurrentBlock(web3) {
        const blockNumber = await web3.eth.getBlockNumber();

        const block = await web3.eth.getBlock(blockNumber);
        return block;
    }

    /**
     * Return current block number
     *
     * @param {web3} web3 Web3 instance to connect to blockchain
     * @returns Returns the current block number
     */
    async getCurrentBlockNumber(web3) {
        return await web3.eth.getBlockNumber();
    }

    /**
     * Returns the estimated timestamp of the block number
     *
     * @param {web3} web3 Web3 instance to connect to blockchain
     * @param {int} blockNumber Block number to be converted to timestamp
     * @returns Estimated timestamp of the block number
     */
    async getTimestampFromBlockNumber(web3, estimateBlockNumber) {
        const currentBlockNumber = await this.getCurrentBlockNumber(web3);

        if (estimateBlockNumber > currentBlockNumber) {
            console.log("Block number is higher than current block number");

            const diff = estimateBlockNumber - currentBlockNumber;

            const averageTime = await this.getBlockAverageTime(web3);

            const currentBlock = await this.getCurrentBlock(web3);

            // parse timestamp 2023-01-06 09:45:54
            const currentBlockTimestamp = new Date(currentBlock.timestamp * 1000);
            const estimatedTime = new Date(currentBlockTimestamp.getTime() + (1000 * (averageTime * diff)));

            return estimatedTime;
        }
        else {
            console.log("Block number is lower or equal to current block number");

            const block = await web3.eth.getBlock(estimateBlockNumber);

            return new Date(block.timestamp * 1000);
        }
    }

    /*=====     End of BLOCK HELPER        ======*/

}

// export unima class
module.exports = { NOWUtils };

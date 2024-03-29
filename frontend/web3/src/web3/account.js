/*
Store some account related functions
*/

class NOWAccount {
    /**
     * Create Account class
     */
    constructor(_web3) {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.NOWConfig(_web3)

        // Require utils
        const utilsHandler = require('./utils')

        this.utils = new utilsHandler.NOWUtils()

        this.web3 = _web3;
    }

    /**
     * Send eth to address
     *
     * @param {address} _to address to send eth to
     */
    async sendEth(_to) {
        const faucetStorageContract = this.utils.getContract(this.web3,
            "FaucetStorage",
            _to,
            await this.web3.eth.net.getId()
        );

        const block = await this.web3.eth.getBlock("latest");

        faucetStorageContract.options.gasLimit = block.gasLimit
        faucetStorageContract.options.gas = block.gasLimit

        const fromAddress = await this.utils.getFromAccount(this.web3);
        let revertReason;

        await faucetStorageContract.methods.sendEth(_to)
            .send({ from: fromAddress }).catch((error) => {
                revertReason = this.utils.handleRevert(error, this.web3);
            });

        revertReason = await revertReason;

        if (revertReason) {
            console.log(revertReason);
            throw new Error(revertReason);
        };
    }

    /**
     * Get balance of faucet smart contract
     *
     * @returns faucet balance
     */
    async getFaucetBalance() {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const faucetStorageContract = this.utils.getContract(this.web3,
            "FaucetStorage",
            fromAddress,
            await this.web3.eth.net.getId())

        return await faucetStorageContract.methods.getFaucetBalance().call({ from: await this.utils.getFromAccount(this.web3) })
    }

    /**
     * Return amount of Knowledge Coins from address (in full coins)
     *
     * @param {string} address address to check for first event transaction
     * @returns amount of Knowledge Coins
     */
    async getKnowledgeCoinBalance(address) {
        const knowledgeCoinContract = this.utils.getContract(this.web3,
            "SBCoin",
            address,
            await this.web3.eth.net.getId()
        )

        return await knowledgeCoinContract.methods.scaledBalanceOf(address).call({ from: await this.utils.getFromAccount(this.web3) })
    }

    /**
     * Return amount of Knowledge Coins from address (in full coins)
     *
     * @param {string} address address to check for balance in range
     * @param {int} startBlock Start block to check for balance
     * @param {int} endBlock  End block to check for balance
     * @returns Balance in range
     */
    async getKnowledgeCoinBalanceInRange(address, startBlock, endBlock) {
        const knowledgeCoinContract = this.utils.getContract(this.web3,
            "SBCoin",
            address,
            await this.web3.eth.net.getId()
        )

        const balance = await knowledgeCoinContract.methods.coinsInBlockNumberRange(address, startBlock, endBlock).call({ from: await this.utils.getFromAccount(this.web3), gas: 12000000 })

        return await knowledgeCoinContract.methods.exchangeToDecimalCoin(balance).call({ from: await this.utils.getFromAccount(this.web3), gas: 12000000 })
    }

    /**
     * Check if student passed the minimum amount of NOW coins needed
     *
     * @param {string} studentAddress Address of student to check
     * @param {id} semesterId Id of semester
     * @returns True if student passed the minimum amount of NOW coins needed, false if not
     */
    async hasStudentPassedSemester(studentAddress, semesterId) {
        const configHandler = require("./config.js");
        const config = new configHandler.NOWConfig(this.web3);

        const semester = await config.getSemester(semesterId);

        const startBlock = semester.startBlock;
        const endBlock = semester.endBlock;

        const balance = await this.getKnowledgeCoinBalanceInRange(studentAddress, startBlock, endBlock);

        if (balance >= semester.minKnowledgeCoinAmount) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Return list of addresses which passed the semester
     *
     * @param {array} studentAddresses Array of student addresses to check
     * @param {id} semesterId Id of semester
     * @returns Return array of addresses which passed the semester
     */
    async hasStudentsPassedSemester(studentAddresses, semesterId) {
        const configHandler = require("./config.js");
        const config = new configHandler.NOWConfig(this.web3);

        const semester = await config.getSemester(semesterId);

        const startBlock = semester.startBlock;
        const endBlock = semester.endBlock;

        const passedStudents = [];

        for (let i = 0; i < studentAddresses.length; i++) {
            const balance = await this.getKnowledgeCoinBalanceInRange(studentAddresses[i], startBlock, endBlock);

            if (balance > semester.minKnowledgeCoinAmount) {
                passedStudents.push(studentAddresses[i]);
            }
        }

        return passedStudents;
    }


    /**
     * Return csv of addresses which passed the semester
     *
     * @param {string} csv CSV string with student numbers (first row is header)
     * @param {int} semesterId Id of semester
     * @returns Return csv of addresses which passed the semester (first row is header)
     */
    async hasStudentsPassedSemesterCSV(csv, semesterId) {
        // Parse semester infos
        const configHandler = require("./config.js");
        const config = new configHandler.NOWConfig(this.web3);

        const semester = await config.getSemester(semesterId);
        
        const startBlock = semester.startBlock;
        const endBlock = semester.endBlock;

        const assignmentIds = await config.getAssignmentIds(semesterId);
        console.log(assignmentIds);
        const assignments = [];

        for (let i = 0; i < assignmentIds.length; i++) {
            assignments.push(await config.getAssignment(semesterId, assignmentIds[i]));
        }

        // Parse csv
        const csvParsed = require('csv-string').parse(csv);

        // remove first row
        csvParsed.splice(0, 1);

        const passedStudents = [];

        // loop over array
        for (let i = 0; i < csvParsed.length; i++) {
            const row = [];

            const studentNumber = csvParsed[i][6].trim();
            const studentAddress = csvParsed[i][5].trim();

            const balance = await this.getKnowledgeCoinBalanceInRange(studentAddress, startBlock, endBlock);

            row.push(studentNumber);
            row.push(studentAddress);

            // loop over assignments and push points to passedStudents array
            for (let j = 0; j < assignments.length; j++) {
                const assignment = assignments[j];
                const buffer = 6 * 7200;
                const assignmentBalance = await this.getKnowledgeCoinBalanceInRange(studentAddress, assignment.startBlock, assignment.endBlock + buffer);

                row.push(assignmentBalance);
            }

            if (balance >= semester.minKnowledgeCoinAmount) {
                row.push("ALLOWED");
            }
            else {
                row.push("NOT ALLOWED");
            }

            passedStudents.push(row);
        }

        // Create header
        const header = ["Student Id", "Student Address"];

        for (let i = 0; i < assignments.length; i++) {
            header.push(assignments[i].name);
        }

        header.push("Allowed to take exam?");

        // Create csv string
        const csvString = [
            header,
            ...passedStudents.map(item => item)
        ].map(e => e.join(","))
            .join("\n");;

        return csvString;
    }
}
// export account class
module.exports = { NOWAccount };

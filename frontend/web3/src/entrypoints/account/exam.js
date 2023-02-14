/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require("../../web3/account")


// Address passed semester
exports.hasStudentPassedSemester = async (web3, studentAddress, semesterId) => {
    const account = new accountHandler.NOWAccount(web3);

    return await account.hasStudentPassedSemester(studentAddress, semesterId);
}

// Addresses passed semester > return only addresses which passed
exports.hasStudentsPassedSemester = async (web3, studentAddresses, semesterId) => {
    const account = new accountHandler.NOWAccount(web3);

    return await account.hasStudentsPassedSemester(studentAddresses, semesterId);
}

// CSV passed semester > return csv of addresses which passed
exports.hasStudentsPassedSemesterCSV = async (web3, csv, semesterId) => {
    const account = new accountHandler.NOWAccount(web3);

    return await account.hasStudentsPassedSemesterCSV(csv, semesterId);
}
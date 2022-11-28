// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                 BaseAssignment                 =
=============================================*/

contract BaseAssignment {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}

/*=====       End of BaseAssignment        ======*/

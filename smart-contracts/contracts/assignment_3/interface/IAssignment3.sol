// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import BaseAssignment.sol
import "../../IBaseAssignment.sol";

// Create contract > define Contract Name
abstract contract IAssignment3 is IBaseAssignment {
    function openChannel(address _sender, address _receiver)
        public
        payable
        virtual;

    function verifyPaymentMsg(uint256 _ethAmount, bytes memory _signature)
        public
        view
        virtual
        returns (bool);

    function closeChannel(uint256 _ethAmount, bytes memory _signature)
        public
        payable
        virtual;

    function openChannelTimeout(
        address _sender,
        address _receiver,
        uint256 timeout
    ) public payable virtual;

    function expireChannel() public payable virtual;

    function closeChannelNoReentrancy(
        uint256 _ethAmount,
        bytes memory _signature
    ) public payable virtual;

    function forceReset() public virtual;
}

pragma solidity ^0.4.21;

import "./FixedSwapIntoVariable.sol"

contract SwapIntoVariable is FixedSwapIntoVariable{
    
    
    uint public escrow_amount; //to be sent to the contract by user
    uint public notional_amount; //principal amount
    uint public fixed_rate;
    string public rate_type = "variable";
    address public variable_user;

    constructor(uint _escrow_amount, uint _notional_amount, uint _fixed_rate) public { 
        escrow_amount = _escrow_amount; 
        notional_amount = _notional_amount;
        fixed_rate = _fixed_rate;
    }



    // function () external payable {
    //   sendEscrow();
    // }
    
    // function sendEscrow() public payable onlyOwner {
    //     variable_user = msg.sender; 
    // }

}

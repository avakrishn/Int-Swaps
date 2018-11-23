pragma solidity ^0.4.21;

import "./VariableSwapIntoFixed.sol"

contract SwapIntoFixed is VariableSwapIntoFixed{
    
    uint public escrow_amount; //to be sent to the contract by user
    uint public notional_amount; //principal amount
    uint public floater_margin_over_index; // Floater Margin over index rate in basis points
    string public interest_rate_index; //SOFR, LIBOR, SONIA etc.
    string public rate_type = "fixed";
    address public fixed_user;

    constructor(uint _escrow_amount, uint _notional_amount, uint _floater_margin_over_index, string _interest_rate_index) public { 
        escrow_amount = _escrow_amount; 
        notional_amount = _notional_amount;
        floater_margin_over_index = _floater_margin_over_index;
        interest_rate_index = _interest_rate_index;
    }



    // function () external payable {
    //   sendEscrowToContract();
    // }
    
    // function sendEscrowToContract() public payable onlyOwner {

    //     fixed_user = msg.sender 
    // }

    

}
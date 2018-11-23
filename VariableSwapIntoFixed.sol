pragma solidity ^0.4.21;


/**
 * @title VariableSwapIntoFixed interface
 * @description user has variable rate and wants to swap into fixed rate
 */
contract VariableSwapIntoFixed{
    uint public escrow_amount; //to be sent to the contract by user
    uint public notional_amount; //principal amount
    uint public floater_margin_over_index; // Floater Margin over index rate in basis points
    string public interest_rate_index; //SOFR, LIBOR, SONIA etc.
    string public rate_type; // fixed

  	// function sendEscrow() public payable ;
}
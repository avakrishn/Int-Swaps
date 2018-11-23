pragma solidity ^0.4.21;


/**
 * @title FixedSwapIntoVariable interface
 * @description user has fixed rate and wants to swap into variable rate
 */
contract FixedSwapIntoVariable {
	uint public escrow_amount; //to be sent to the contract by user
    uint public notional_amount; //principal amount
	uint public fixed_rate;
	string public rate_type; // variable

	// function sendEscrow() public payable ;


}
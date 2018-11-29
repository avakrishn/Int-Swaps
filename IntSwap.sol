pragma solidity ^0.4.21;

import './VariableSwapIntoFixed';
import './FixedSwapIntoVariable';


contract IntSwap{
    
    uint public start_date; //when contract was created 
    uint public maturity_date;
    uint public swap_contract_rate;
    uint public escrow_amount; // to be sent to the contract by users
    uint public fixed_notional_amount;
    uint public variable_notional_amount;
    VariableSwapIntoFixed public VariableToFixed; //address of the contract that extends VariableSwapIntoFixed interface
    FixedSwapIntoVariable public FixedToVariable; //address of the contract that extends FixedSwapIntoVariable interface

    mapping (string => address) public rate_type_to_user_address;
    // in mapping called registeredAddresses the key is address and value is a boolean

    
    constructor(uint _maturity_date, uint _escrow_amount, VariableSwapIntoFixed _VariableToFixed, FixedSwapIntoVariable _FixedToVariable ) public { 
        start_date = now;
        maturity_date = _maturity_date;
        escrow_amount = _escrow_amount; 
        VariableToFixed = _VariableToFixed;
        FixedToVariable = _FixedToVariable;
    }


    function () external payable {
      sendEscrow();
    }
    
    function sendEscrowToContract() public payable {

    }

    function readyToWithdraw() external{

    }

    function getFixedNotionalAmount() internal return (uint){
        fixed_notional_amount = VariableToFixed.notional_value.call();
    }

    function getVariableNotionalAmount() internal return (uint){
        Variable_notional_amount = FixedToVariable.notional_value.call();
    }

    // function calculateCurrentSwapContractRate () internal returns(uint _swap_contract_rate){
    //     //code

    //     return swap_contract_rate = _swap_contract_rate;
    // }

    function fixedUserWillRecieve () internal return(uint){
        return (fixed_notional_amount * swap_contract_rate)/12);
    }

    function fixedUserWillOwe() internal return (uint){

    }

    function variableUserWillRecieve () internal return(uint){
        
    }

    function variableUserWillOwe() internal return (uint){
        return (variable_notional_amount * swap_contract_rate)/12);
    }

    //send in index rate such as LIBOR, SOFR, SONIA
    function getIndexRate() external return(uint){

    }

    //added feature: terminate contract

    
}

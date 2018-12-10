pragma solidity >=0.4.0 <0.6.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract IntSwap is Ownable{
    // using one-month LIBOR
    struct IntSwapContract{
        uint contract_id;
        uint notional_amount;  //this is in wei
        uint escrow_amount; // we will only accept ETH for demo
        uint swap_rate; //expressed in 7 decimal points converted to integer--i.e. 0.0239539 or 2.39539% x10000000 is 239539
        uint maturity_date; //month, day, year or # of months from start timestamp
        uint start_date; //when contract was created 
        bool VarToFixedEscrowFlag;
        bool FixedToVarEscrowFlag;
        address fixed_to_var_owner;
        address var_to_fixed_owner; 
    }
   //global variables 

    uint256 public contract_id;

    mapping (uint256 => IntSwapContract) public contract_id_to_Intswap_struct;

    address private OracleOwner; //should we hard code this?
    uint public VarToFixedEscrow; // amount in wei always positive integer
    uint public FixedToVarEscrow; // amount in wei always positive integer
    uint public VarToFixedTimestamp; // need timestamp for receipt of escrow
    uint public FixedToVarTimestamp; // need timestamp for receipt of escrow
    uint public end_LIBOR; //measured at beginning of maturity month with 7 decimal places i.e. .0239539 or 2.39539%
    uint public VarToFixedPayout; //this includes return of escrow so will always be 0 or positive    
    uint public FixedToVarPayout; //this includes return of escrow so will always be 0 or positive
 
    
    //mapping (address => uint) public // ??do we need this??
    //enum Status { Created, Funded, Matured, PaidOut }  //use this to track status?
    //emit status
    
    function mintIntSwap ( uint _notional_amount, uint _escrow_amount, uint _swap_rate, uint _maturity_date, string _rate_type, address _counterparty) public { 
        contract_id++;
        uint _start_date = now;
        // owner = msg.sender; 
        address _fixed_to_var_owner;
        address _var_to_fixed_owner;
        if(keccak256(_rate_type) == keccak256("Fixed to Variable")){
            _fixed_to_var_owner = msg.sender;
            _var_to_fixed_owner = _counterparty;
        }else{
            _var_to_fixed_owner = msg.sender;
            _fixed_to_var_owner = _counterparty;
        }
        //we will be owner of contract unless Pavan tells us a better way.  
        //Cannot have either party be owner or they could delete it
        // use of memory on next iine below and not storage?
       IntSwapContract memory intswapcontract  = IntSwapContract({ contract_id: contract_id, notional_amount: _notional_amount, escrow_amount: _escrow_amount, swap_rate: _swap_rate, maturity_date: _maturity_date, start_date: _start_date,  fixed_to_var_owner: _fixed_to_var_owner, var_to_fixed_owner: _var_to_fixed_owner, VarToFixedEscrowFlag: false, FixedToVarEscrowFlag: false});

       contract_id_to_Intswap_struct[contract_id] = intswapcontract;
    }
     modifier onlyVarToFixed() {
        require(msg.sender == contract_id_to_Intswap_struct[contract_id][var_to_fixed_owner],"Only variable to fixed party can call this function.");
        _;
    }
    modifier onlyFixedToVar() {
        require(msg.sender == contract_id_to_Intswap_struct[contract_id][fixed_to_var_owner],"Only fixed to variable party can call this function.");
        _;
    }
    function receiveVarToFixedEscrow(uint _VarToFixedEscrow) public payable onlyVarToFixed returns (bool VarToFixedEscrowFlag){ 
        // record received amount.  Can't just use true/false flag because maybe they sent wrong amount.
        require(msg.value == _VarToFixedEscrow);
        require(_VarToFixedEscrow == escrow_amount);
        VarToFixedEscrow = _VarToFixedEscrow;
        VarToFixedTimestamp = block.timestamp;
        VarToFixedEscrowFlag = true;
        // need to test timestamp for within 48 hours -- how to do this?
        // need to send escrow back if over 48 hrs and cancel contract-not finished
        // need to send excess back if over required escrow amount
    }
    function receiveFixedToVarEscrow(uint _FixedToVarEscrow) public payable onlyFixedToVar returns (bool FixedToVarEscrowFlag){
        //do we have to return two things to have access to FixedToVarEscrow in later functions?
        // receive ETH but I'm not sure how to do that--is next stmt ok?
        require(msg.value == _FixedToVarEscrow);
        require (_FixedToVarEscrow == escrow_amount);
        FixedToVarEscrow = _FixedToVarEscrow;
        FixedToVarTimestamp = block.timestamp; 
        FixedToVarEscrowFlag = true;
        // need to test timestamp for within 48 hours -- how to do this?
        // need to send escrow back if over 48 hrs and cancel contract--not finished 
        // need to send excess back if over required escrow amount       
    }
    function OKtoProceed() public returns (bool) {
        require (FixedToVarEscrow >= escrow_amount);
        require (VarToFixedEscrow >= escrow_amount);
        //use ethereum alarm clock here to test that escrow payment period time limit (48 hrs) was met
        //expand this to test for flags at each step and notate status
        return true;
    }
    
    function getEndLibor() external returns(uint end_LIBOR){
        //use ethereum-alarm-clock function or similar to trigger this ??
        //contact oracle (or array for demo) to get one-month LIBOR at beginning of maturity month
        //but I am not sure how to do that
        //test if now later than maturity_date 
        require (now > maturity_date, "Contract has not matured yet.");
        require (msg.sender == OracleOwner, "You are not authorized."); 
        end_LIBOR =  msg.data;
        return end_LIBOR;
        //fallback function needed here ?
        //once we get the ending LIBOR how do we trigger the payout calc function?
        }
        
    }
    function VarToFixedPayoutCalc() public returns(uint VarToFixedPayout){
        //if LIBOR increases (is positive) VarToFixed owner gets a profit
        //if LIBOR decreases (is negative) VarToFixed owner gets a loss
        //divide rates by 120000000 (with 7 zeroes) to convert from annual to monthly and from integer to 7 decimal places
        uint public VarToFixedGain;
        uint public VarToFixedLoss;
        
        if (end_LIBOR > _swap_rate){
            VarToFixedGain = _notional_amount * (end_LIBOR - _swap_rate)/120000000;
        }
        if (end_LIBOR <= _swap_rate){
            VarToFixedLoss = _notional_amount * (_swap_rate - end_LIBOR)/120000000;
        }
        if (VarToFixedGain > _escrow_amount){
            VarToFixedGain = _escrow_amount; //ok to replace value of variable value or shd we use new name?
        }
        if (VarToFixedLoss > _escrow_amount){
            VarToFixedLoss = _escrow_amount; //ok to replace value of variable value or shd we use new name?
        }
        VarToFixedPayout = _escrow_amount + VarToFixedGain - VarToFixedLoss;
        
       return VarToFixedPayout;
    } 

    function FixedToVarPayoutCalc() public returns(uint FixedToVarPayout){
        //if LIBOR increases (is positive) FixedToVar owner gets a loss
        //if LIBOR decreases (is negative) FixedToVar owner gets a profit
        
        uint public FixedToVarGain;
        uint public FixedToVarLoss;
        if (end_LIBOR < _swap_rate){
            FixedToVarGain = _notional_amount * (_swap_rate - end_LIBOR)/120000000;
        }
        else if (end_LIBOR >= _swap_rate){
            FixedToVarLoss = _notional_amount * (end_LIBOR - _swap_rate)/120000000;
        }
        else if (FixedToVarGain > _escrow_amount){
            FixedToVarGain = _escrow_amount;  //ok to replace value of FixedToVarGain variable or shd we use new name?
        }
        else if (FixedToVarLoss > _escrow_amount){
            FixedToVarLoss = _escrow_amount;  //ok to replace value of variable value or shd we use new name?
        }
        FixedToVarPayout = _escrow_amount + FixedToVarGain - FixedToVarLoss;
        return FixedToVarPayout;        
    }
       
    function withdrawVarToFixed(uint256 amount) public onlyVarToFixed{
        require(VarToFixedEscrowFlag == true);
        require(msg.value = amount);
        require(amount <= VarToFixedPayout);
        //  reduce the balance first to prevent re-entrancy attacks
        VarToFixedPayout -= amount;
        msg.sender.transfer(amount);
    }
    function withdrawFixedToVar(uint256 amount) public onlyFixedToVar{
        //can we reuse amount or does it have to have a different name because we used it in function above?
        require(FixedToVarEscrowFlag == true);
        require(msg.value = amount);
        require(amount <= FixedToVarPayout);
        //  reduce the balance first to prevent re-entrancy attacks
        FixedToVarPayout -= amount;
        msg.sender.transfer(amount);
    }
}
//Terms and Risks to disclose:
//notional amount is in wei
//return payouts based in wei at ETH exchange rate in effect at contract inception
//mismatch with your own mortage reset dates, particular index in use
//monthly based on 30/360 year and not actual days in each month.
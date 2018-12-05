pragma solidity >=0.4.0 <0.6.0;

contract IntSwap is Ownable{
	// using one-month LIBOR

	struct storage OwnerOfIntSwap{
		uint public notional_amount;  //this is in wei
		uint public escrow_amount; // we will only accept ETH for demo
        uint public swap_rate; //expressed in 7 decimal points converted to integer--i.e. 0.0239539 or 2.39539% x10000000 is 239539
		uint public maturity_date; //month, day, year or # of months from start timestamp
		address public payable fixed_to_var_owner;
        address public payable var_to_fixed_owner; 
	}

   //global variables 
    address private OracleOwner; //should we hard code this?
    uint public VarToFixedEscrowRecd; // amount in wei always positive integer
    uint public FixedToVarEscrowRecd; // amount in wei always positive integer
    uint public VarToFixedTimeRecd; // need timestamp for receipt of escrow
    uint public FixedToVarTimeRecd; // need timestamp for receipt of escrow
	uint public start_date; //when contract was created 
    uint public end_LIBOR; //measured at beginning of maturity month with 7 decimal places i.e. .0239539 or 2.39539%
    uint public VarToFixedPayout; //this includes return of escrow so will always be 0 or positive    
    uint public FixedToVarPayout; //this includes return of escrow so will always be 0 or positive
    bool public VarToFixedEscrowFlag;
    bool public FixedToVarEscrowFlag;
    
    //mapping (address => uint) public // ??do we need this??

    //enum Status { Created, Funded, Matured, PaidOut }  //use this to track status?
    //emit status
    
    constructor( uint _notional_amount, uint _escrow_amount, uint _swap_rate, uint _maturity_date, address _fixed_to_var_owner, address _var_to_fixed_owner) public { 

	    start_date = now;
	    owner = msg.sender;  
        //we will be owner of contract unless Pavan tells us a better way.  
        //Cannot have either party be owner or they could delete it
        // use of memory on next iine below and not storage?

       OwnerOfIntSwap memory owner_of_int_swap  = OwnerOfIntSwap({ notional_amount: _notional_amount, escrow_amount: _escrow_amount, swap_rate: _swap_rate, maturity_date: _maturity_date,  fixed_to_var_owner: _fixed_to_var_owner, var_to_fixed_owner: _var_to_fixed_owner});

    }

     modifier onlyVarToFixed() {
        require(
        msg.sender == _var_to_fixed_owner,
        "Only variable to fixed party can call this."
        );
        _;
    }
    modifier onlyFixedToVar() {
        require(
        msg.sender == _fixed_to_var_owner,
        "Only fixed to variable party can call this."
        );
        _;
    }

    function receiveVarToFixedEscrow(uint amount) public payable OnlyVarToFixed returns (bool VarToFixedEscrowFlag){ 
        // record received amount.  Can't just use true/false flag because maybe they sent wrong amount.
        require(msg.value = amount);
        VarToFixedEscrowRecd += amount;
        VarToFixedTimeRecd = block.timestamp;
        // need to test timestamp for within 48 hours -- how to do this?
        // need to send escrow back if over 48 hrs and cancel contract-not finished
        // need to send excess back if over required escrow amount
        if (VarToFixedEscrowRecd >= _escrow_amount) {VarToFixedEscrowFlag = true;
        } 
        else {
        VarToFixedEscrowFlag = false;
        }
    }

    function receiveFixedToVarEscrow(uint amount) public payable OnlyFixedToVar returns (bool FixedToVarEscrowFlag){
        //do we have to return two things to have access to FixedToVarEscrowRecd in later functions?
        // receive ETH but I'm not sure how to do that--is next stmt ok?
        require(msg.value = amount);
        FixedToVarEscrowRecd += amount;
        FixedToVarTimeRecd = block.timestamp;  
        // need to test timestamp for within 48 hours -- how to do this?
        // need to send escrow back if over 48 hrs and cancel contract--not finished 
        // need to send excess back if over required escrow amount
        if (FixedToVarEscrowRecd >= _escrow_amount) {FixedToVarEscrowFlag = true;
        }
        else {
        FixedToVarEscrowFlag = false;
        }        
    }

    function OKtoProceed() public returns (bool "Good To Go") {
        Require FixedToVarEscrowRecd >= _escrow_amount;
        Require VarToFixedEscrowRecd >= _escrow_amount;
        //use ethereum alarm clock here to test that escrow payment period time limit (48 hrs) was met
        //expand this to test for flags at each step and notate status
        return true;

    }
    
    function getEndLibor() external returns(uint end_LIBOR){
        //use ethereum-alarm-clock function or similar to trigger this ??
        //contact oracle (or array for demo) to get one-month LIBOR at beginning of maturity month
        //but I am not sure how to do that
        //test if now later than maturity_date 
        Require (now > _maturity_date, "Contract has not matured yet.");
        Require (msg.sender == OracleOwner, "You are not authorized."); 
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
        }
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
        if (end_LIBOR >= _swap_rate){
        FixedToVarLoss = _notional_amount * (end_LIBOR - _swap_rate)/120000000;
        }
        if (FixedToVarGain > _escrow_amount){
        FixedToVarGain = _escrow_amount;  //ok to replace value of FixedToVarGain variable or shd we use new name?
        }
        if (FixedToVarLoss > _escrow_amount){
        FixedToVarLoss = _escrow_amount;  //ok to replace value of variable value or shd we use new name?
        }
        FixedToVarPayout = _escrow_amount + FixedToVarGain - FixedToVarLoss;
        return FixedToVarPayout;        
    }
       
    function withdrawVarToFixed(uint256 amount) public payable OnlyVarToFixed{
        require(VarToFixedEscrowFlag == true);
        require(msg.value = amount);
        require(amount <= VarToFixedPayout);
        //  reduce the balance first to prevent re-entrancy attacks
        VarToFixedPayout -= amount;
        msg.sender.transfer(amount);
    }

    function withdrawFixedToVar(uint256 amount) public payable OnlyFixedToVar{
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
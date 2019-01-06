//https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol
import  'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import  'openzeppelin-solidity/contracts/math/SafeMath.sol';

pragma solidity ^0.4.18;

contract IntSwap is Ownable{
    using SafeMath for uint256;

    event Deposited(address indexed payee, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed payee, uint256 amount, uint256 timestamp);

    struct IntSwapTerms {
        uint total_escrow_amount; // we will only accept ETH for demo. Escrow set at 0.2% of notional amount.
        uint swap_rate; //expressed in 7 decimal points converted to integer--i.e. 0.0239539 or 2.39539% x10000000 is 239539
        uint termStartUnixTimestamp;
        uint termEndUnixTimestamp; //month, day, year or # of months from start timestamp
        // address fixed_to_var_owner;
        // address var_to_fixed_owner;
    }

    struct ProposalOwner {
        uint notional_amount;  //this amount is used to calculate the escrow amount
        uint owner_input_rate; //current interest rate of proposal owner
        uint termEndUnixTimestamp; //month, day, year or # of months from start timestamp. Mature date of the terms
        string owner_input_rate_type; //fixed or variable. If fixed, then proposal owner is fixed_to_var_owner, vice versa.
    }

    struct CounterpartyEscrow {
        uint escrowDepositTimestamp;
        uint escrow_amount_deposited;
    }

    struct ProposalEscrow {
        uint escrowDepositTimestamp;
        uint escrow_amount_deposited; //expressed in wei/ether
    }


    // Given that Solidity does not support floating points, we encode
    // interest rates as percentages scaled up by a factor of 10,000
    // As such, interest rates can, at a maximum, have 4 decimal places
    // of precision.
    //10,000,000 => 1% interest rate
    //1,000,000 => 0.1% interest rate
    //100,000 => 0.01% interest rate
    // To convert an encoded interest rate into its equivalent multiplier
    // (for purposes of calculating total interest), divide the notional amount by INTEREST_RATE_SCALING_FACTOR_PERCENT -- e.g.
    //     10,000,000 => 0.01 interest multiplier
    uint public constant INTEREST_RATE_SCALING_FACTOR_PERCENT = 10 ** 7; //10,000,000
    uint public constant INTEREST_RATE_SCALING_FACTOR_MULTIPLIER = INTEREST_RATE_SCALING_FACTOR_PERCENT * 100; //1,000,000,000
    uint public num;

    string public fixedRate = 'fixed';
    string public variableRate = 'variable';
    address public proposalOwner; //proposal owner address
    address public counterparty; // counterparty owner address

    mapping (address => IntSwapTerms) public contractAddressToContractTerms; //this uses the address of the contract to map to the contract terms
    mapping (address => ProposalOwner) public proposalAddressToProposalOwner; //this uses the address of the proposer to get his information
    mapping (address => ProposalEscrow) public proposalAddressToProposalEscrow;
    mapping (address => CounterpartyEscrow) public counterpartyAddressToCounterpartyAddressEscrow;
    mapping (address => uint256) public payeeAddressToPayAmount;
  

    modifier onlyProposalOwner() {
        // require(msg.sender == contractAddressToContractTerms[address(this)][var_to_fixed_owner],"Only the contract terms propasal owner can call this function.");
        require(msg.sender == proposalOwner, "Only the contract terms propasal owner can call this function.");
        _;
    }

    modifier onlyCounterparty() {
        // require(msg.sender == contractAddressToContractTerms[address(this)][fixed_to_var_owner],"Only the contract terms conterparty can call this function.");
        require(msg.sender == counterparty, "Only the contract terms conterparty can call this function.");
        _;
    }

    modifier hasMatured(){
        IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)]; //address(this) is the address of this contract
        num++; //need to spend gas in order to get now timestamp

        require (now > int_swap_terms.termEndUnixTimestamp, "Contract has not matured yet.");
        _;

    }

    //run this function to register as the IntSwap contract proposal owner
    //Consider to make this function be called by the proposer
    function registerProposalOwner(uint _notional_amount, uint _owner_input_rate, uint matured_date, string _owner_input_rate_type, address _proposal_owner) onlyOwner public {

        ProposalOwner memory proposal_owner = ProposalOwner({notional_amount: _notional_amount, owner_input_rate: _owner_input_rate, termEndUnixTimestamp: matured_date, owner_input_rate_type: _owner_input_rate_type});

        // if (keccak256(_owner_input_rate_type) == keccak256(fixedRate)) {
        //     IntSwapTerms memory int_swap_terms = IntSwapTerms({fixed_to_var_owner: _proposal_owner});
        //     proposalOwner = _proposal_owner; //store the address of the proposal owner
        // } else {
        //     IntSwapTerms memory int_swap_terms = IntSwapTerms({var_to_fixed_owner: _proposal_owner});
        //     proposalOwner = _proposal_owner;
        // }

        proposalOwner = _proposal_owner;
        //map the proposal owner address to proposal owner struct
        proposalAddressToProposalOwner[_proposal_owner] = proposal_owner;

        //map the contract's address to the struct
        // contractAddressToContractTerms[address(this)] = int_swap_terms;

    }

    //consider to have the counterparty call this function
    function registerCounterparty(address _counterparty) onlyOwner public {
        require (proposalOwner != address(0), "Needs to register the proposal owner first");

        // IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)]; //address(this) is the address of this contract

        //check if the address is not set. address(0) == empty address
        //if empty, then this is the counterparty
        // if (int_swap_terms.fixed_to_var_owner == address(0)) {
        //     int_swap_terms.fixed_to_var_owner = _counterparty;
        //     counterparty = _counterparty; //store the address of the counterparty
        // } else {
        //     int_swap_terms.var_to_fixed_owner = _counterparty;
        //     counterparty = _counterparty;
        // }

        //map the counterparty address to counterpary struct
        // counterpartyAddressToCounterparty[_counterparty];

        counterparty = _counterparty;
    }

    //can only be called when escrow is deposited
    function calculateEscrowAmount (uint _escrowPercent) internal returns (uint) {
        //Escrow set at 0.2% of notional (2,000,000 is the converted _escrowPercent)
        // IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)];
        ProposalOwner memory proposal_owner = proposalAddressToProposalOwner[proposalOwner];
        //ex. notional_amount = 100,000
        // escrow amount could have decimals (cents) need to look at in future
        uint escrow_amount = proposal_owner.notional_amount.mul(_escrowPercent).div(INTEREST_RATE_SCALING_FACTOR_MULTIPLIER);
        return escrow_amount;
    }

    //the escrow amount is already calculated on the frontend.
    function proposerDepositIntoEscrow (uint _escrowAmount, uint _escrowPercent) public payable onlyProposalOwner {
        require(msg.value == _escrowAmount); //msg.value(in wei or ether) has to be the same as the escrow amount
        require(_escrowAmount == calculateEscrowAmount(_escrowPercent)); //require the proposal owner to send the same amount of calculated escrow
        ProposalEscrow memory proposal_escrow = ProposalEscrow({escrowDepositTimestamp: block.timestamp, escrow_amount_deposited: _escrowAmount});
        proposalAddressToProposalEscrow[proposalOwner] = proposal_escrow;

        emit Deposited(proposalOwner, _escrowAmount, block.timestamp);
    }

    function counterpartyDepositIntoEscrow (uint _escrowAmount, uint _escrowPercent) public payable onlyCounterparty {
        require(msg.value == _escrowAmount);
        require(_escrowAmount == calculateEscrowAmount(_escrowPercent)); //require the proposal owner to send the same amount of calculated escrow

        CounterpartyEscrow memory counterparty_escrow = CounterpartyEscrow({escrowDepositTimestamp: block.timestamp, escrow_amount_deposited: _escrowAmount});
        counterpartyAddressToCounterpartyAddressEscrow[counterparty] = counterparty_escrow;

        emit Deposited(counterparty, _escrowAmount, block.timestamp);
    }

    function escrowDepositsOf(address payee) public view returns (uint256) {
        require(payee == proposalOwner || payee == counterparty);

        if(payee == proposalOwner){
            return proposalAddressToProposalEscrow[payee].escrow_amount_deposited;
        }
        if(payee == counterparty){
            return counterpartyAddressToCounterpartyAddressEscrow[payee].escrow_amount_deposited;
        }
        
    }

    // _swap_rate = 2.88% based on forward rate of what the US LIBOR 1 month market is expected in 23 months if it is a 24 month contract (1st day of contract maturity month)
    function mintIntSwap (uint _swap_rate) onlyOwner public {
        // IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)];
        ProposalOwner memory proposal_owner = proposalAddressToProposalOwner[proposalOwner]; //this gives us the proposal owner struct
        ProposalEscrow memory proposal_escrow = proposalAddressToProposalEscrow[proposalOwner]; //This gives us the proposal escrow struct
        CounterpartyEscrow memory counterparty_escrow = counterpartyAddressToCounterpartyAddressEscrow[counterparty];

        require (proposal_escrow.escrow_amount_deposited != 0); //making sure proposal owner has deposited the money
        require (counterparty_escrow.escrow_amount_deposited != 0);
        require (proposal_escrow.escrow_amount_deposited == counterparty_escrow.escrow_amount_deposited);
        require (_swap_rate > 0);
        require (proposalOwner != 0);
        require (counterparty != 0);

        uint totalEscrowAmount = proposal_escrow.escrow_amount_deposited.add(counterparty_escrow.escrow_amount_deposited);
        uint timeStampStart = now;

        IntSwapTerms memory intswap_terms = IntSwapTerms({total_escrow_amount: totalEscrowAmount, swap_rate: _swap_rate, termStartUnixTimestamp: timeStampStart, termEndUnixTimestamp: proposal_owner.termEndUnixTimestamp});

        contractAddressToContractTerms[address(this)] = intswap_terms;
    }

    // function getEndLibor(uint end_LIBOR) internal hasMatured onlyOwner returns (uint){
    //     //this function only called when contract is matured
    //     //contact oracle (or array for demo) to get one-month LIBOR at beginning of maturity month

    //     // uint end_LIBOR = msg.data;

    //     return end_LIBOR;
    // }

    function VarToFixedPayoutCalc(uint _end_LIBOR) public hasMatured onlyOwner returns (uint VarToFixedPayout){
        // 2.9% = 0.029 LIBOR will be scaled to 29,000,000 
        // 0.88% = 0.0088 scaled to 8,800,000 LIBOR
        // _end_LIBOR to be passed into function = 29,000,000
        // swap rate will be scaled to 28,800,000 (2.88% = 0.0288)
        //notional amount = 100,000
        
        //if LIBOR increases (is positive) VarToFixed owner gets a profit
        //if LIBOR decreases (is negative) VarToFixed owner gets a loss
        //divide rates by 120,000,000 (with 7 zeroes) to convert from annual to monthly and from integer to 7 decimal places
       
        ProposalOwner memory proposal_owner = proposalAddressToProposalOwner[proposalOwner];        
        IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)]; //address(this) is the address of this contract
        
        uint VarToFixedGain;
        uint VarToFixedLoss;
        // uint end_LIBOR = getEndLibor();
        uint end_LIBOR = _end_LIBOR;
        uint _swap_rate = int_swap_terms.swap_rate;
        uint _notional_amount = proposal_owner.notional_amount;
        uint _escrow_amount;
        uint months = 12;
        uint MONTHLY_INTEREST_RATE_SCALING_FACTOR_MULTIPLIER = months.mul(INTEREST_RATE_SCALING_FACTOR_MULTIPLIER);

        address varToFixedOwner;

        if (keccak256(proposal_owner.owner_input_rate_type) == keccak256(variableRate)) {
            _escrow_amount = proposalAddressToProposalEscrow[proposalOwner].escrow_amount_deposited;
            varToFixedOwner = proposalOwner;
        } else {
            _escrow_amount = counterpartyAddressToCounterpartyAddressEscrow[counterparty].escrow_amount_deposited; 
            varToFixedOwner = counterparty;
        }

        
        // when end_LIBOR gone up they experience a gain
        if (end_LIBOR > _swap_rate){
            VarToFixedGain = (_notional_amount.mul(end_LIBOR.sub(_swap_rate))).div(MONTHLY_INTEREST_RATE_SCALING_FACTOR_MULTIPLIER); //166.666
        }
        // when end_LIBOR gone down they experience a loss
        if (end_LIBOR <= _swap_rate){
            VarToFixedLoss = (_notional_amount.mul(_swap_rate.sub(end_LIBOR))).div(MONTHLY_INTEREST_RATE_SCALING_FACTOR_MULTIPLIER);
        }

        //VarToFixedGain is limited by the _escrow_amount
        // if the VarToFixedGain is greater than the _escrow_amount
        // gain cannot exceed the other party's escrow
        if (VarToFixedGain > _escrow_amount){
            VarToFixedGain = _escrow_amount; 
        }
        //if the VarToFixedLoss is greater than the _escrow_amount
        //loss cannot excess your own escrow
        if (VarToFixedLoss > _escrow_amount){
            VarToFixedLoss = _escrow_amount; 
        }

        VarToFixedPayout = _escrow_amount + VarToFixedGain - VarToFixedLoss;

        payeeAddressToPayAmount[varToFixedOwner] = VarToFixedPayout;
        
        return VarToFixedPayout;
    } 

    function FixedToVarPayoutCalc(uint _end_LIBOR) public hasMatured onlyOwner returns(uint FixedToVarPayout){
        //if LIBOR increases (is positive) FixedToVar owner gets a loss
        //if LIBOR decreases (is negative) FixedToVar owner gets a profit
        ProposalOwner memory proposal_owner = proposalAddressToProposalOwner[proposalOwner];        
        IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)]; //address(this) is the address of this contract
        
        uint FixedToVarGain;
        uint FixedToVarLoss;
        // uint end_LIBOR = getEndLibor();
        uint end_LIBOR = _end_LIBOR;
        uint _swap_rate = int_swap_terms.swap_rate;
        uint _notional_amount = proposal_owner.notional_amount;
        uint _escrow_amount;
        uint months = 12;
        uint MONTHLY_INTEREST_RATE_SCALING_FACTOR_MULTIPLIER = months.mul(INTEREST_RATE_SCALING_FACTOR_MULTIPLIER);

        address fixedToVarOwner;
        

        if (keccak256(proposal_owner.owner_input_rate_type) == keccak256(fixedRate)) {
            _escrow_amount = proposalAddressToProposalEscrow[proposalOwner].escrow_amount_deposited;
            fixedToVarOwner = proposalOwner;
        } else {
            _escrow_amount = counterpartyAddressToCounterpartyAddressEscrow[counterparty].escrow_amount_deposited; 
            fixedToVarOwner = counterparty;
        }

        if (end_LIBOR < _swap_rate){
            FixedToVarGain = (_notional_amount.mul(_swap_rate.sub(end_LIBOR))).div(MONTHLY_INTEREST_RATE_SCALING_FACTOR_MULTIPLIER);
        }
        if (end_LIBOR >= _swap_rate){
            FixedToVarLoss = (_notional_amount.mul(end_LIBOR.sub(_swap_rate))).div(MONTHLY_INTEREST_RATE_SCALING_FACTOR_MULTIPLIER);
        }
        if (FixedToVarGain > _escrow_amount){
            FixedToVarGain = _escrow_amount;  //ok to replace value of FixedToVarGain variable or shd we use new name?
        }
        if (FixedToVarLoss > _escrow_amount){
            FixedToVarLoss = _escrow_amount;  //ok to replace value of variable value or shd we use new name?
        }
        FixedToVarPayout = _escrow_amount + FixedToVarGain - FixedToVarLoss;

        payeeAddressToPayAmount[fixedToVarOwner] = FixedToVarPayout;

        return FixedToVarPayout;        
    }

    function proposalOwnerWithdrawPayment() public hasMatured onlyProposalOwner {
        address payee = msg.sender;
        uint256 payment = payeeAddressToPayAmount[payee];

        require(payment != 0, "There is nothing to withdraw");
        require(address(this).balance >= payment);

        // reduce the balance first to prevent re-entrancy attacks
        payeeAddressToPayAmount[payee] = 0;

        payee.transfer(payment);

        emit Withdrawn(payee, payment, block.timestamp);
    }

    function counterpartyOwnerWithdrawPayment() public hasMatured onlyCounterparty {
        address payee = msg.sender;
        uint256 payment = payeeAddressToPayAmount[payee];

        require(payment != 0,"There is nothing to withdraw");
        require(address(this).balance >= payment);

        // reduce the balance first to prevent re-entrancy attacks
        payeeAddressToPayAmount[payee] = 0;

        payee.transfer(payment);

        emit Withdrawn(payee, payment, block.timestamp);
    }
}
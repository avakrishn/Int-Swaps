//https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

pragma solidity ^0.4.18;

contract IntSwap is Ownable{

    struct IntSwapTerms {
        uint escrow_amount; // we will only accept ETH for demo. Escrow set at 0.2% of notional amount.
        uint swap_rate; //expressed in 7 decimal points converted to integer--i.e. 0.0239539 or 2.39539% x10000000 is 239539
        uint termStartUnixTimestamp;
        uint termEndUnixTimestamp; //month, day, year or # of months from start timestamp
        address fixed_to_var_owner;
        address var_to_fixed_owner;
    }

    struct ProposalOwner {
        uint notional_amount;  //this amount is used to calculate the escrow amount
        uint owner_input_rate;
        string owner_input_rate_type; //fixed or variable
        uint escrowDepositTimestamp;
        uint escrow_amount_deposited;
    }

    struct Counterparty {
        uint escrowDepositTimestamp;
        uint escrow_amount_deposited;
    }


    // Given that Solidity does not support floating points, we encode
    // interest rates as percentages scaled up by a factor of 10,000
    // As such, interest rates can, at a maximum, have 4 decimal places
    // of precision.
    //10,000 => 1% interest rate
    //1000 => 0.1% interest rate
    //100 => 0.01% interest rate
    // To convert an encoded interest rate into its equivalent multiplier
    // (for purposes of calculating total interest), divide the notional amount by INTEREST_RATE_SCALING_FACTOR_PERCENT -- e.g.
    //     10,000 => 0.01 interest multiplier
    uint public constant INTEREST_RATE_SCALING_FACTOR_PERCENT = 10 ** 4;
    uint public constant INTEREST_RATE_SCALING_FACTOR_MULTIPLIER = INTEREST_RATE_SCALING_FACTOR_PERCENT * 100;

    string public fixedRate = 'fixed';
    string public variableRate = 'variable';
    address public propsalOwner;
    address public counterparty;

    mapping (address => IntSwapTerms) public contractAddressToContractTerms; //this uses the contract of the address to map to the contract terms
    mapping (address => ProposalOwner) public propsalAddressToProposalOwner; //this uses the address of the proposal to get his information
    mapping (address => Counterparty) public counterpartyAddressToCounterparty;

    modifier onlyProposalOwner() {
        require(msg.sender == contractAddressToContractTerms[address(this)][var_to_fixed_owner],"Only the contract terms propasal owner can call this function.");
        _;
    }

    modifier onlyCounterparty() {
        require(msg.sender == contractAddressToContractTerms[address(this)][fixed_to_var_owner],"Only the contract terms conterparty can call this function.");
        _;
    }

    //run this function to register as the IntSwap contract proposal owner
    function registerProposalOwner(uint _notional_amount, uint _owner_input_rate, string _owner_input_rate_type, address _proposal_owner) onlyOwner public {

        ProposalOwner memory proposal_owner = ProposalOwner({notional_amount: _notional_amount, owner_input_rate: _owner_input_rate, owner_input_rate_type: _owner_input_rate_type});

        if (keccak256(_owner_input_rate_type) == keccak256(fixedRate) {
            IntSwapTerms memory int_swap_terms = IntSwapTerms({fixed_to_var_owner: _proposal_owner});
            propsalOwner = _proposal_owner; //store the address of the propsal owner
        } else {
            IntSwapTerms memory int_swap_terms = IntSwapTerms({var_to_fixed_owner: _proposal_owner});
            propsalOwner = _proposal_owner;
        }

        //map the contract's address to the struct
        contractAddressToContractTerms[address(this)] = int_swap_terms;

        //map the proposal owner address to propsal owner struct
        propsalAddressToProposalOwner[_proposal_owner] = proposal_owner;
    }

    function registerCounterparty(address _counterparty) onlyOwner public {
        require (propsalOwner != address(0), "Needs to register the proposal owner first");

        IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)]; //address(this) is the address of this contract

        //check if the address is not set. address(0) == empty address
        //if empty, then this is the counterparty
        if (int_swap_terms.fixed_to_var_owner == address(0)) {
            int_swap_terms.fixed_to_var_owner = _counterparty;
            counterparty = _counterparty; //store the address of the counterparty
        } else {
            int_swap_terms.var_to_fixed_owner = _counterparty;
            counterparty = _counterparty;
        }

        //map the counterparty address to counterpary struct
        counterpartyAddressToCounterparty[_counterparty];
    }

    //can only be called when escrow is deposited
    function calculateEscrowAmount (uint _escrowPercent) internal returns (uint) {
        //Escrow set at 0.2% of notional
        IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)];
        ProposalOwner memory proposal_owner = propsalAddressToProposalOwner[propsalOwner];

        return int_swap_terms.escrow_amount = proposal_owner.notional_amount.mul(_escrowPercent).div(INTEREST_RATE_SCALING_FACTOR_MULTIPLIER);
    }

    function proposerDepositIntoEscrow (uint _escrowAmount, uint _escrowPercent) public payable onlyProposalOwner {
        require(msg.value == _escrowAmount);
        require(_escrowAmount == calculateEscrowAmount(_escrowPercent)); //require the proposal owner to send the same amount of calculated escrow
        PropsalOwner memory propsal_owner = PropsalOwner({escrowDepositTimestamp: block.timestamp, escrow_amount_deposited: _escrowAmount});
    }

    function counterpartyDepositIntoEscrow (uint _escrowAmount, uint _escrowPercent) public payable onlyCounterparty {
        require(msg.value == _escrowAmount);
        require(_escrowAmount == calculateEscrowAmount(_escrowPercent)); //require the proposal owner to send the same amount of calculated escrow

        Counterparty memory counterparty = Counterparty({escrowDepositTimestamp: block.timestamp, escrow_amount_deposited: _escrowAmount});
    }

    function getEndLibor() internal returns(uint end_LIBOR){
        //this function only called when contract is matured
        //contact oracle (or array for demo) to get one-month LIBOR at beginning of maturity month
        require (now > maturity_date, "Contract has not matured yet.");

        end_LIBOR =  msg.data;

        return end_LIBOR;

        }
    }

    function mintIntSwap (uint _maturity_date) onlyOwner public {
        IntSwapTerms memory int_swap_terms = contractAddressToContractTerms[address(this)];
        ProposalOwner memory proposal_owner = propsalAddressToProposalOwner[propsalOwner];
        Counterparty memory counterparty = counterpartyAddressToCounterparty[counterparty];

        require (proposal_owner.escrow_amount_deposited != 0); //making sure propsal owner has deposited the money
        require (counterparty.escrow_amount_deposited != 0);
        require (int_swap_terms.swap_rate > 0);
        require (int_swap_terms.fixed_to_var_owner != 0);
        require (int_swap_terms.var_to_fixed_owner != 0);

        int_swap_terms.termStartUnixTimestamp = now;
        int_swap_terms.termEndUnixTimestamp = _maturity_date;
    }

}
// Js file for intswap.html but name changed to getquote.html
var $contract_address;
var $notional_amount = $('#notional_amount');
var $maturity_month = $('#maturity_month');
var $maturity_year = $('#maturity_year');
var $current_annual_rate = $('#current_annual_rate');
var $swap_out_of_rate_type = $('#swap_out_of_rate_type');
var $proposal_owner_address = $('#proposal_owner_address');
var $counterparty_owner_address;
var proposer_rate;
var eth_notional_amount;
var wei_notional_amount;
var eth_escrow_amount;
var wei_escrow_amount;
var c_deposited_escrow_amount;
var p_deposited_escrow_amount;
let proposerAddress;
let counterpartyAddress;
var variable_to_fixed_payee;
var fixed_to_variable_payee;
var total_escrow_deposited_in_contract;
var intSwap_tx;
var p_swap_out_rate;

var registerProposalOwnerRunning = false;

var $proposed_int_swap = $('#proposed_int_swap');
var $mint_int_swap = $('#mint_int_swap');


var price_in_usd_for_one_eth;

var escrow_percent = 2000000;
var swap_contract_rate_percent = 2.88;
var swap_contract_rate_scaled = 28800000;


function proposedIntSwapCard(notional_amount, proposer_input_rate, end_date, proposer_rate_type, escrow ){

  if(notional_amount > 0 && escrow > 0){
    var alternative_rate;

    if(proposer_rate_type == "fixed"){
        alternative_rate = "variable"
    }else{
      alternative_rate = "fixed"
    }

    var $cardContainer = $('<div>').attr('class', 'card justify-content-center text-center p-1 mt-5');

    var $cardBody = $('<div>').attr('class', 'card-body');
    var $cardTitle = $('<h2>').attr('class', 'card-title mt-2').text(`Proposed Int Swap Contract`);
    var $notional_amount = $('<h5>').attr('class', 'card-text').text(`Notional Amount: ${notional_amount}`);
    var $proposer = $('<h5>').attr('class', 'card-text').text(`Proposer is swapping out of current ${proposer_rate_type} rate of ${proposer_input_rate.toFixed(2)}% into ${alternative_rate} rate`);
    var $counterparty = $('<h5>').attr('class', 'card-text').text(`As the counterparty you will swap out of ${alternative_rate} into ${proposer_rate_type} rate`);
    var $swap_rate = $('<h5>').attr('class', 'card-text').text(`The swap rate is ${swap_contract_rate_percent}%`);
    var $maturity_date = $('<h5>').attr('class', 'card-text').text(`This contract will reach settlement on maturity date: ${end_date}`);
    var $counterparty_input_label = $('<label class="mr-3">').text(`Enter Your Address to Become the Counterparty:`);
    var $counterparty_input = $('<input class="container d-block w-75" id="counterparty_owner_address">').attr('type', 'text');
    var $enter_button = $(`<button type="button" class="btn btn-primary center btn-sm mt-3" data-escrow=${escrow} data-percent=${escrow_percent} id="registerCounterparty" style="width: auto">Enter into Int Swap as Counterparty</button>`);

    $cardBody.append($cardTitle, $notional_amount, $proposer, $counterparty, $swap_rate, $maturity_date, $counterparty_input_label, $counterparty_input, $enter_button);
    $cardContainer.append($cardBody);
    return $cardContainer;
  }

}

function intSwapCard(notional_amount, p_owner_input_rate, end_date, proposer_rate_type, proposerAddress, counterpartyAddress, p_deposited_escrow_amount, c_deposited_escrow_amount ){

  let total_deposited_escrow = p_deposited_escrow_amount + c_deposited_escrow_amount;

    var alternative_rate;

    if(proposer_rate_type == "fixed"){
        alternative_rate = "variable"
    }else{
      alternative_rate = "fixed"
    }

    var $cardContainer = $('<div>').attr('class', 'card justify-content-center text-center p-1 mt-5');

    var $cardBody = $('<div>').attr('class', 'card-body');
    var $cardTitle = $('<h2>').attr('class', 'card-title mt-2').text(`Summary of IntSwap Contract to be Minted`);
    var $notional_amount = $('<h5>').attr('class', 'card-text').text(`Notional Amount: ${notional_amount}`);
    var $proposer = $('<h5>').attr('class', 'card-text').text(`Proposer is swapping out of current ${proposer_rate_type} rate of ${p_owner_input_rate.toFixed(2)}% into ${alternative_rate} rate`);
    var $proposerEscrow = $('<h5>').attr('class', 'card-text').text(`Proposer has deposited $${p_deposited_escrow_amount} into escrow from address ${proposerAddress}.`);
    var $counterpartyEscrow = $('<h5>').attr('class', 'card-text').text(`Counterparty has deposited $${c_deposited_escrow_amount} into escrow from address ${counterpartyAddress}.`);
    var $swap_rate = $('<h5>').attr('class', 'card-text').text(`The swap rate is ${swap_contract_rate_percent}%`);
    var $maturity_date = $('<h5>').attr('class', 'card-text').text(`This contract will reach settlement on maturity date: ${end_date}`);
    var $counterparty_input_label = $('<label class="mr-3">').text(`Enter the above Swap Rate to Confirm the IntSwap Contract.`);
    var $counterparty_input = $('<input class="container d-block w-75" id="swap_rate_input">').attr('type', 'text');
    var $enter_button = $(`<button type="button" class="btn btn-primary center btn-sm mt-3" data-swaprate=${swap_contract_rate_percent} id="mintIntswap" style="width: auto">Mint IntSwap</button>`);

    $cardBody.append($cardTitle, $notional_amount, $proposer, $proposerEscrow, $counterpartyEscrow, $swap_rate, $maturity_date, $counterparty_input_label, $counterparty_input, $enter_button);
    $cardContainer.append($cardBody);
    return $cardContainer;



}

function displayIntSwapTX(transactionHash) {
  var mintIntSwapResult =  $('<div>');
  var $tx = $('<h5>').attr('class', 'card-text').text(`IntSwap Minted Successfully: ${transactionHash}`);

  // var getPayout_VarToFixed = cal_payout_VarToFixed();
  // var getPayout_FixedToVar = cal_payout_FixedToVar()

  mintIntSwapResult.append($tx);
  return mintIntSwapResult;
}

function payout() {
  var calPaypout =  $('<div>');

  var getPayout_VarToFixed = cal_payout_VarToFixed();
  var getPayout_FixedToVar = cal_payout_FixedToVar()

  calPaypout.append(getPayout_VarToFixed, getPayout_FixedToVar);
  return calPaypout;
}


function cal_payout_VarToFixed() {
  var $varToFixedCalLabel = $('<label class="mr-3">').text(`Variable to Fixed Payout`);
  var $varToFixedPayoutCal_input = $('<input placeholder="Enter Libor Rate" class="container d-block w-75" id="varToFixedPayoutCalc_liborRate">').attr('type', 'text');
  var $varToFixedPayoutCalc_button = $(`<button type="button" class="btn btn-primary center btn-sm mt-3" id="varToFixedPayoutCal_button" style="width: auto">Calculate</button>`);

  var cal_payout_VarToFixed_div = $('<div id="cal_payout_VarToFixed">');
  cal_payout_VarToFixed_div.append($varToFixedCalLabel, $varToFixedPayoutCal_input, $varToFixedPayoutCalc_button);

  return cal_payout_VarToFixed_div
}

function cal_payout_FixedToVar() {
  var $fixedToVarCalLabel = $('<label class="mr-3">').text(`Fixed to Variable Payout`);
  var $fixedToVarPayoutCal_input = $('<input placeholder="Enter Libor Rate" class="container d-block w-75" id="fixedToVarPayoutCalc_liborRate">').attr('type', 'text');
  var $fixedToVarPayoutCalc_button = $(`<button type="button" class="btn btn-primary center btn-sm mt-3" id="fixedToVarPayoutCal_button" style="width: auto">Calculate</button>`);

  var cal_payout_FixedToVar = $('<div id="cal_payout_FixedToVar">');
  cal_payout_FixedToVar.append($fixedToVarCalLabel, $fixedToVarPayoutCal_input, $fixedToVarPayoutCalc_button);

  return cal_payout_FixedToVar
}

function displayVariableToFixedPayout(payee, payment) {
  var $result = $('<h5>').attr('class', 'card-text').text(`The payout amount to the ${payee} is $${payment}.`);
  return $result
}

function displayFixedToVariablePayout(payee, payment) {
  var $result = $('<h5>').attr('class', 'card-text').text(`The payout amount to the ${payee} is $${payment}.`);
  return $result
}

$.ajax({
  type: "GET",
  url: "https://api.coinmarketcap.com/v1/ticker/ethereum/",
  dataType: "json",
  success: function (result) {
    price_in_usd_for_one_eth = result[0].price_usd;
  },
  error: function (err) {
    console.log(err);
  }
});



App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('IntSwap.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var IntSwapArtifact = data;
      App.contracts.IntSwap = TruffleContract(IntSwapArtifact);

      // Set the provider for our contract.
      App.contracts.IntSwap.setProvider(App.web3Provider);

      // return App.bindEvents inside this $.getJSON function so that we return at the end of this function
      return App.bindEvents();

    });


  },

  bindEvents: function () {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#displayProfitLoss', App.displayProfitLoss);
    $(document).on('click', '#placeTrade', App.registerProposalOwner);
    $(document).on('click', '#registerCounterparty', App.registerCounterpartyOwner);
    $(document).on('click', '#mintIntswap', App.mintIntSwap);
    $(document).on('click', '#varToFixedPayoutCal_button', App.varToFixedPayoutCalc);
    $(document).on('click', '#fixedToVarPayoutCal_button', App.fixedToVarPayoutCalc);

    App.grabState();
  },

  grabState: function () {
    var intSwapInstance;

    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      $contract_address = intSwapInstance.contract.address;

      var partiesPromises = [];

      partiesPromises.push(intSwapInstance.proposalOwner.call(), intSwapInstance.counterparty.call());

      return Promise.all(partiesPromises);


    }).then(function (result){

        proposerAddress = result[0];
        counterpartyAddress = result[1];

        var promises = [];

        promises.push(intSwapInstance.proposalAddressToProposalOwner.call(proposerAddress), intSwapInstance.proposalAddressToProposalEscrow.call(proposerAddress), intSwapInstance.counterpartyAddressToCounterpartyAddressEscrow.call(counterpartyAddress));

        return Promise.all(promises);

    }).then(function (result){
      var proposal_owner_struct = result[0];
      var proposal_owner_escrow = result[1];
      var p_escrow = proposal_owner_escrow[1];
      var counterparty_escrow = result[2];
      var c_escrow = counterparty_escrow[1];

      //calculate counterparty deposited escrow amount
      var c_eth_ecrow_amount = c_escrow/ Math.pow(10, 18);
      var c_escrow_amount = c_eth_ecrow_amount * price_in_usd_for_one_eth;
      c_deposited_escrow_amount = parseInt(c_escrow_amount);

      //calculate proposer deposited escrow amount
      var p_eth_ecrow_amount = p_escrow/ Math.pow(10, 18);
      var p_escrow_amount = p_eth_ecrow_amount * price_in_usd_for_one_eth;
      p_deposited_escrow_amount = parseInt(p_escrow_amount);

      //convert notional amount in wei to notional amount in USD
      var p_wei_notional_amount = proposal_owner_struct[0];
      var p_eth_notional_amount = p_wei_notional_amount/ Math.pow(10, 18);
      var p_notional_amount = p_eth_notional_amount * price_in_usd_for_one_eth;
      p_notional_amount = parseInt(p_notional_amount);

      // proposal owner input rate
      var p_owner_input_rate = proposal_owner_struct[1];
      p_owner_input_rate = p_owner_input_rate / Math.pow(10, 9);
      p_owner_input_rate = p_owner_input_rate * 100;

      // maturity end date
      var date = new Date(parseFloat(proposal_owner_struct[2]) * 1000);
      date = date.toString().split(" ");
      date = `${date[1]} ${date[3]}`

      // proposal owner will swap out of p_swap_out_rate
      p_swap_out_rate = proposal_owner_struct[3];



      if(counterpartyAddress == "0x0000000000000000000000000000000000000000"){
        var card = proposedIntSwapCard(p_notional_amount, p_owner_input_rate, date, p_swap_out_rate, p_escrow);

        $proposed_int_swap.html(card);
      }

      //show mint swap if counterparty deposited and but the intswap proposal has not created
      if(counterpartyAddress != "0x0000000000000000000000000000000000000000" && !total_escrow_deposited_in_contract){
        var mintInswapCard = intSwapCard(p_notional_amount, p_owner_input_rate, date, p_swap_out_rate, proposerAddress, counterpartyAddress, p_deposited_escrow_amount, c_deposited_escrow_amount);
        $mint_int_swap.html(mintInswapCard);
      }

      // if (total_escrow_deposited_in_contract) {
      //   var calculatePayout = payout();
      //   $("#cal_payout").html(calculatePayout);
      // }
      var calculatePayout = payout();
      $("#cal_payout").html(calculatePayout);



    }).catch(function (err) {
      console.log(err);

    });
  },

  displayProfitLoss: function (event) {
    $(document).ready(function () {
      $("#displayProfitLoss").click(function () {
        $("#step_one").hide();
        $("#step_two").show();
      });
    });
    var $escrow_amount = notional_amount * 0.002;
    var $unix_date_now = new Date();
    var $unix_maturity_date = new Date(maturity_date);
    var $swap_contract_rate = 0.0280;   //hard-code this value for demo
    var $contract_months = $unix_maturity_date - $unix_date_now; //parse month and year instead???
    document.getElementById("display_maturity_date").innerHTML = $unix_maturity_date;
    document.getElementById("display_inception_date").innerHTML = $unix_date_now;
    document.getElementById("display_escrow_amount").innerHTML = "The required escrow amount is:".$escrow_amount;
    document.getElementById("demo").innerHTML = "Hello World!";

    //left off here* still need to calculate number of months ****************************************************************************************



  },

  registerProposalOwner: function (event) {
    if(registerProposalOwnerRunning ==  true){
      return false;
    }else{
      registerProposalOwnerRunning = true;
    }

    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      // get the maturity date in unix timestamp
      // maturity_date = year.month.date
      var maturity_date = `${$maturity_year.val()}.${$maturity_month.val()}.01`
      var unix_maturity_date = new Date(maturity_date).getTime() / 1000

      // determine if rate type of proposer is fixed or variable
      var rate_type;
      if ($swap_out_of_rate_type.val() == 1) {
        rate_type = "fixed";
      } else {
        rate_type = "variable";
      }

      // calculations for notional amount and escrow amount
      var notional_amount = $notional_amount.val();
      var escrow_amount = 0.002 * notional_amount;

      // convert notional amount into eth and then into wei for metamask
      eth_notional_amount = notional_amount / price_in_usd_for_one_eth;
      // wei_notional_amount = Math.pow(10, 18) * eth_notional_amount;
      wei_notional_amount = window.web3.toWei(eth_notional_amount, "ether");

      // convert escrow amount into eth and then into wei for metamask
      eth_escrow_amount = escrow_amount / price_in_usd_for_one_eth;
      // wei_escrow_amount = Math.pow(10, 18) * eth_escrow_amount;
      wei_escrow_amount = window.web3.toWei(eth_escrow_amount, "ether");

      proposer_rate = $current_annual_rate.val() /100;
      proposer_rate = proposer_rate * Math.pow(10, 9);

      // register the proposal Owner
      return intSwapInstance.registerProposalOwner(wei_notional_amount, proposer_rate, unix_maturity_date, rate_type, $proposal_owner_address.val());

    }).then(function (result) {
      registerProposalOwnerRunning = false;
      // get the Proposal owner struct from the proposalAddressToProposalOwner mapping with the key of proposal owner address
      return intSwapInstance.proposalAddressToProposalOwner.call($proposal_owner_address.val());


    }).then(function (res) {
      console.log(res);
      console.log(wei_escrow_amount);
      console.log(escrow_percent);


      // have proposal owner deposit escrow into Int Swap contract using msg.data and msg.value
      // return setTimeout(function(){
      //   intSwapInstance.proposerDepositIntoEscrow(wei_escrow_amount, escrow_percent, { from: $proposal_owner_address.val(), gas: 3000000, value: wei_escrow_amount });
      // }, 1000);

      return intSwapInstance.proposerDepositIntoEscrow(wei_escrow_amount, escrow_percent, { from: $proposal_owner_address.val(), gas: 3000000, value: wei_escrow_amount });


      // pattern for deposit eth into account
      // myContractInstance.depositFunds({from: web3.eth.accounts[0], gas: 3000000, value: 100}, function(err, res){});


    }).then(function (result) {
      console.log(result);
      return intSwapInstance.proposalAddressToProposalEscrow.call($proposal_owner_address.val());


    }).then(function (res) {
      console.log(res);

    }).catch(function (err) {
      console.log(err.message);
    });
  },

  registerCounterpartyOwner: function (event) {
    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      $counterparty_owner_address = $('#counterparty_owner_address');
      console.log($counterparty_owner_address.val());


      return intSwapInstance.registerCounterparty($counterparty_owner_address.val());

    }).then(function (res) {
      console.log(res);

      var wei_escrow_amount = $("#registerCounterparty").attr('data-escrow');
      var escrow_percent = $("#registerCounterparty").attr('data-percent');

      // have counterparty owner deposit escrow into Int Swap contract using msg.data and msg.value
      return intSwapInstance.counterpartyDepositIntoEscrow(wei_escrow_amount, escrow_percent, { from: $counterparty_owner_address.val(), gas: 3000000, value: wei_escrow_amount });

      // pattern for deposit eth into account
      // myContractInstance.depositFunds({from: web3.eth.accounts[0], gas: 3000000, value: 100}, function(err, res){});


    }).then(function (result) {
      console.log(result);
      return intSwapInstance.counterpartyAddressToCounterpartyAddressEscrow.call($counterparty_owner_address.val());


    }).then(function (res) {
      console.log(res);

    }).catch(function (err) {
      console.log(err.message);
    });


  },
  mintIntSwap: function (event) {
    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      $input_swap_rate = $('#swap_rate_input').val();
      $contract_swap_rate = $("#mintIntswap").attr('data-swaprate');

      if ($input_swap_rate !== $contract_swap_rate) {
        return alert("Please enter the correct Swap Rate")
      }

      return intSwapInstance.mintIntSwap(swap_contract_rate_scaled);

    }).then(function (res) {
      console.log(res);
      intSwap_tx = res.tx;

      return intSwapInstance.contractAddressToContractTerms.call($contract_address);

    }).then(function (res) {
      total_escrow_deposited_in_contract = res[0]/Math.pow(10, 18) * price_in_usd_for_one_eth;

      var intSwapMessage = displayIntSwapTX(intSwap_tx);
      $mint_int_swap.append(intSwapMessage);
    }).catch(function (err) {
      console.log(err.message);
    });


  },
  varToFixedPayoutCalc: function (event) {
    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      var $end_libor_rate = $('#varToFixedPayoutCalc_liborRate').val();
      var $scaled_end_libor_rate = $end_libor_rate * 1000000

      return intSwapInstance.VarToFixedPayoutCalc($scaled_end_libor_rate);

    }).then(function (res) {
      console.log(res);
      if(p_swap_out_rate == "variable"){ //if proposer is swapping from variable to fixed
        variable_to_fixed_payee = "Proposer"
        return intSwapInstance.payeeAddressToPayAmount.call(proposerAddress);
      }else{
        variable_to_fixed_payee = "Counterparty"
        return intSwapInstance.payeeAddressToPayAmount.call(counterpartyAddress);
      }
    }).then(function (res) {
      //calculate the payout
      var variable_to_fixed_eth_payout_amount = res/ Math.pow(10, 18);
      var variable_to_fixed_usd_payout_amount = variable_to_fixed_eth_payout_amount * price_in_usd_for_one_eth;
      var variable_to_fixed_payout_amount = parseInt(variable_to_fixed_usd_payout_amount);

      var payoutResult = displayVariableToFixedPayout(variable_to_fixed_payee, variable_to_fixed_payout_amount);
      debugger
      $("#cal_payout").append(payoutResult);


    }).catch(function (err) {
      console.log(err.message);
    });
  },
  fixedToVarPayoutCalc: function (event) {
    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      var $end_libor_rate = $('#fixedToVarPayoutCalc_liborRate').val();
      var $scaled_end_libor_rate = $end_libor_rate * 1000000

      return intSwapInstance.FixedToVarPayoutCalc($scaled_end_libor_rate);

    }).then(function (res) {
      console.log(res);
      if(p_swap_out_rate == "fixed"){ //if proposer is swapping fixed to variable
        fixed_to_variable_payee = "Proposer";
        return intSwapInstance.payeeAddressToPayAmount.call(proposerAddress);
      }else{
        fixed_to_variable_payee = "Counterparty";
        return intSwapInstance.payeeAddressToPayAmount.call(counterpartyAddress);
        //put counterparty title and payout to html
      }
    }).then(function (res) {
      //calculate the payout
      var fixed_to_variable_eth_payout_amount = res/ Math.pow(10, 18);
      var fixed_to_variable_usd_payout_amount = fixed_to_variable_eth_payout_amount * price_in_usd_for_one_eth;
      var fixed_to_variable_payout_amount = parseInt(fixed_to_variable_usd_payout_amount);

      var payoutResult = displayFixedToVariablePayout(fixed_to_variable_payee, fixed_to_variable_payout_amount);
      $("#cal_payout").append(payoutResult);


    }).catch(function (err) {
      console.log(err.message);
    });
  },
  proposerWithdraw: function (event) {
    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      return intSwapInstance.proposalOwnerWithdrawPayment();

    }).then(function (res) {

      console.log(res);

    }).catch(function (err) {
      console.log(err.message);
    });
  },
  counterpartyWithdraw: function (event) {
    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;

      return intSwapInstance.counterpartyOwnerWithdrawPayment();

    }).then(function (res) {

      console.log(res);

    }).catch(function (err) {
      console.log(err.message);
    });
  },

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});





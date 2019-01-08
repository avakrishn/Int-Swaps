// Js file for intswap.html but name changed to getquote.html

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

var $proposed_int_swap = $('#proposed_int_swap');


var price_in_usd_for_one_eth;

var escrow_percent = 2000000;
var swap_contract_rate = 2.88;
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
    var $swap_rate = $('<h5>').attr('class', 'card-text').text(`The swap rate is ${swap_contract_rate}%`);
    var $maturity_date = $('<h5>').attr('class', 'card-text').text(`This contract will reach settlement on maturity date: ${end_date}`);
    var $counterparty_input_label = $('<label class="mr-3">').text(`Enter Your Address to Become the Counterparty:`);
    var $counterparty_input = $('<input class="container d-block w-75" id="counterparty_owner_address">').attr('type', 'text');
    var $enter_button = $(`<button type="button" class="btn btn-primary center btn-sm mt-3" data-escrow=${escrow} data-percent=${escrow_percent} id="registerCounterparty" style="width: auto">Enter into Int Swap as Counterparty</button>`);
    
    $cardBody.append($cardTitle, $notional_amount, $proposer, $counterparty, $swap_rate, $maturity_date, $counterparty_input_label, $counterparty_input, $enter_button);
    $cardContainer.append($cardBody);
    return $cardContainer;
  }
  
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
    
    App.grabState();
  },

  grabState: function () {
    var intSwapInstance;
  
    App.contracts.IntSwap.deployed().then(function (instance) {
      intSwapInstance = instance;
      
    
      return intSwapInstance.proposalOwner.call();
      

    }).then(function (result){
    

        console.log(result);

        var promises = [];

        promises.push(intSwapInstance.proposalAddressToProposalOwner.call(result), intSwapInstance.proposalAddressToProposalEscrow.call(result));


        return Promise.all(promises);

    }).then(function (result){
      var proposal_owner_struct = result[0];
      var proposal_owner_escrow = result[1];
      var p_escrow = proposal_owner_escrow[1];

      // convert notional amount in wei to notional amount in USD
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
      var p_swap_out_rate = proposal_owner_struct[3];
      
      var card = proposedIntSwapCard(p_notional_amount, p_owner_input_rate, date, p_swap_out_rate, p_escrow);

      $proposed_int_swap.html(card);

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
      wei_notional_amount = Math.pow(10, 18) * eth_notional_amount;

      // convert escrow amount into eth and then into wei for metamask
      eth_escrow_amount = escrow_amount / price_in_usd_for_one_eth;
      wei_escrow_amount = Math.pow(10, 18) * eth_escrow_amount;

      proposer_rate = $current_annual_rate.val() /100;
      proposer_rate = proposer_rate * Math.pow(10, 9);

      // register the proposal Owner
      return intSwapInstance.registerProposalOwner(wei_notional_amount, proposer_rate, unix_maturity_date, rate_type, $proposal_owner_address.val());

    }).then(function (result) {

      // get the Proposal owner struct from the proposalAddressToProposalOwner mapping with the key of proposal owner address
      return intSwapInstance.proposalAddressToProposalOwner.call($proposal_owner_address.val());


    }).then(function (res) {
      console.log(res);
      console.log(wei_escrow_amount);
      console.log(escrow_percent);


      // have proposal owner deposit escrow into Int Swap contract using msg.data and msg.value
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

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});





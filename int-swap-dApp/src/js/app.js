// Js file for intswap.html but name changed to getquote.html
const rp = require('../../request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    start: 1,
    limit: 5000,
    convert: 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'a3cfb929-0767-498b-b32d-271c640e722b'
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
  console.log('API call response:', response);
}).catch((err) => {
  console.log('API call error:', err.message);
});


$notional_amount = $('#notional_amount');
$maturity_month = $('#maturity_month');
$maturity_year= $('#maturity_year');
$current_annual_rate = $('#current_annual_rate');
$swap_out_of_rate_type = $('#swap_out_of_rate_type');
$proposal_owner_address = $('#proposal_owner_address');


App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
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

  initContract: function() {
    $.getJSON('IntSwap.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var IntSwapArtifact = data;
      App.contracts.IntSwap = TruffleContract(IntSwapArtifact);

      // Set the provider for our contract.
      App.contracts.IntSwap.setProvider(App.web3Provider);

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#displayProfitLoss', App.displayProfitLoss);
    $(document).on('click', '#placeTrade', App.registerProposalOwner);
  },


  displayProfitLoss: function(event){
    $(document).ready(function(){
      $("#displayProfitLoss").click(function(){
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

  // handleTransfer: function(event) {
  //   event.preventDefault();

  //   var amount = parseInt($('#TTTransferAmount').val());
  //   var toAddress = $('#TTTransferAddress').val();

  //   console.log('Transfer ' + amount + ' TT to ' + toAddress);

  //   var tutorialTokenInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];

  //     App.contracts.TutorialToken.deployed().then(function(instance) {
  //       tutorialTokenInstance = instance;

  //       return tutorialTokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
  //     }).then(function(result) {
  //       alert('Transfer Successful!');
  //       return App.getBalances();
  //     }).catch(function(err) {
  //       console.log(err.message);
  //     });
  //   });
  // },

  // getBalances: function() {
  //   console.log('Getting balances...');

  //   var tutorialTokenInstance;

  //   web3.eth.getAccounts(function(error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];

  //     App.contracts.TutorialToken.deployed().then(function(instance) {
  //       tutorialTokenInstance = instance;

  //       return tutorialTokenInstance.balanceOf(account);
  //     }).then(function(result) {
  //       balance = result.c[0];

  //       $('#TTBalance').text(balance);
  //     }).catch(function(err) {
  //       console.log(err.message);
  //     });
  //   });
  // },

  registerProposalOwner: function (event) {
    event.preventDefault();
    var intSwapInstance;
    App.contracts.IntSwap.deployed().then(function(instance){
      intSwapInstance = instance;
    
      var maturity_date = `${$maturity_year.val()}.${$maturity_month.val()}.01`
      var unix_maturity_date = new Date(maturity_date).getTime() / 1000
      var rate_type;
      if($swap_out_of_rate_type.val() == 1){
          rate_type = "fixed";
      }else{
          rate_type = "variable";
      }

      return intSwapInstance.registerProposalOwner($notional_amount.val(),$current_annual_rate.val(),unix_maturity_date, rate_type, $proposal_owner_address.val());
    }).then(function(result){
      var notional_amount = $notional_amount.val();
      var escrow_amount = 0.002 * notional_amount;
      var escrow_percent = 2000000;
      var swap_contract_rate_scaled  = 28800000; 

      
      // myContractInstance.depositFunds({from: web3.eth.accounts[0], gas: 3000000, value: 100}, function(err, res){});
      return intSwapInstance.proposerDepositIntoEscrow(escrow_amount, escrow_percent, {from: $proposal_owner_address.val(), gas:3000000, value: escrow_amount})

    }).then(function(res){
        console.log(res);
    
    }).catch(function(err) {
        console.log(err.message);
    });
  },

  registerCounterpartyOwner: function(event){


  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});





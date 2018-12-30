// Js file for intswap.html but name changed to getquote.html
//get input data from getquote.html input form
var notional_amount = $('#notional_amount');
var maturity_month = $('#maturity_month');
var maturity_year = $('#maturity_year');
var maturity_month_year = maturity_month.maturity_year;
var current_annual_rate = $('#current_annual_rate');
var swap_out_of_rate_type = $('#swap_out_of_rate_type');
var escrow_amount = notional_amount * 0.002;
var swap_contract_rate = 0.0288;   //hard-code this value for demo


App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },  //end of init

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  }, //end of initWeb3

  initContract: function() {
    $.getJSON('IntSwap.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var IntSwapArtifact = data;
      App.contracts.IntSwap = TruffleContract(IntSwapArtifact);

      // Set the provider for our contract.
      App.contracts.IntSwap.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  }, //end of initContract

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#placeTrade', App.placeTrade);

  }, //end of bindEvents

 


  
   
  placeTrade: function(event){
   
    $(document).ready(function(){
         event.preventDefault();

    if (document.getElementByID("agree").innerHTML =="agree"){
        $("#placeTrade").click(function(){
          // hard coding the swap rate and moving decimal 7 places
           var swap_rate = 288000;
          // convert escrow_amount to wei?
           var SwapBuyInstance;
           
           App.contracts.IntSwap.deployed().then(function(instance) {
            SwapBuyInstance = instance;
            return SwapBuyInstance.newRecord(contract_id.val(), notional_amount.val(), escrow_amount.val(), swap_rate.val(), maturity_year_month.val(), swap_out_of_rate_type.val(), contract_address.val());

            var tradeConfirmPara = document.createElement("p");
            var tradeConfirmText = document.createTextNode("Your IntSwaps trade is confirmed. Your confirmation number is ");
            tradeConfirmPara.appendChild(tradeConfirmText);
            document.getElementByID("step_six_confirm_trade").appendChild(TradeConfirmPara);

           })
      
        }); 
      
    }
    elseif 
       (document.getElementByID("disagree").innerHTML == "disagree"){
        var notAgreePara = document.createElement("p");
        var notAgreeText = document.createTextNode("You must check that you understand and agree to the terms and risks before you can place an order.");
        notAgreePara.appendChild(notAgreeText);
        document.getElementByID("RiskAgreeMessage").appendChild(notAgreePara);
    }
    else{
      var noResponsePara = document.createElement("p");
      var noResponseText = document.createTextNode("You must make a selection.")
      noResponsePara.appendChild(noResponseText);
       document.getElementByID("RiskAgreeMessage").appendChild(noResponsePara);
    }
    });  
  }, //end of placeTrade

  

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }, //end of handleTransfer

  getBalances: function() {
    console.log('Getting balances...');

    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }, //end of getBalances


};  //should be end } of App but does not light up as a pair with opening {  ???





$(function() {
  $(window).load(function() {
    App.init();
  });
});










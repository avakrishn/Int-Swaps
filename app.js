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
var fixed_pay_amount = notional_amount * swap_contract_rate / 12;
var minus_three_pay_amount = notional_amount * (swap_contract_rate - .03) / 12;
var minus_two_pay_amount = notional_amount * (swap_contract_rate - .02) / 12;
var minus_one_pay_amount = notional_amount * (swap_contract_rate - .01) / 12;
var zero_change_pay_amount = notional_amount * swap_contract_rate / 12;
var plus_one_pay_amount = notional_amount * (swap_contract_rate + .01) / 12;
var plus_two_pay_amount = notional_amount * (swap_contract_rate + .02) / 12;
var plus_three_pay_amount = notional_amount * (swap_contract_rate + .03) / 12;

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
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
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

      // Use our contract to retrieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#getQuote', App.getQuote);
    $(document).on('click', '#placeTrade', App.placeTrade);
    $(document).on('click', '#cancelTrade', App.cancelTrade);

  },


  getQuote: function(event){
    $(document).ready(function(){
      $("#getQuote").click(function(){
      $("#step_one_input").hide();
      $("#step_two_display_quote").show();
      $("#step_three_profit_loss_table").show();
      $("#step_four_display_risks").show();
      $("#step_five_agree").show();
      }); 
    });
   
    document.getElementById("insert_notional_amount").innerHTML = "$".notional_amount;
    document.getElementById("insert_month_year").innerHTML = maturity_month."/".maturity_year;
    document.getElementById("insert_current_annual_rate").innerHTML = current_annual_rate."%";
    document.getElementById("insert_swap_out_of_rate_type").innerHTML = swap_out_of_rate_type;
    document.getElementById("insert_escrow_amount").innerHTML = "$".escrow_amount;
    document.getElementById("insert_swap_rate").innerHTML = swap_contract_rate."%";
   
   
    if (swap_out_of_rate_type = "Variable to Fixed"){
      
      var minus_three_result = minus_three_pay_amount - fixed_pay_amount;
      var minus_two_result = minus_two_pay_amount - fixed_pay_amount;
      var minus_one_result = minus_one_pay_amount - fixed_pay_amount;
      var zero_change_result = 0;
      var plus_one_result = plus_one_pay_amount - fixed_pay_amount;
      var plus_two_result = plus_two_pay_amount - fixed_pay_amount;
      var plus_three_result = plus_three_pay_amount - fixed_pay_amount;

        if (minus_three_pay_result < (escrow_amount * -1) ) {
          limit_minus_three_result = escrow_amount * -1;
        };
        if (plus_three_pay_result > escrow_amount) {
          limit_plus_three_result = escrow_amount;
        };

      document.getElementById("insert_minus_three_result").innerHTML = "$".limit_minus_three_result;
      document.getElementById("insert_minus_two_result").innerHTML = "$".minus_two_result;
      document.getElementById("insert_minus_one_result").innerHTML = "$".minus_one_result;
      document.getElementById("insert_zero_change_result").innerHTML = "$".zero_change_result;
      document.getElementById("insert_plus_one_result").innerHTML = "$".plus_one_result;
      document.getElementById("insert_plus_two_result").innerHTML = "$".plus_two_result;
      document.getElementById("insert_plus_three_result").innerHTML = "$".limit_plus_three_result;
    

    }
    else{
    };
    
    if (swap_out_of_rate_type = "Fixed to Variable"){
       
      var minus_three_result = fixed_pay_amount - minus_three_pay_amount;
      var minus_two_result = fixed_pay_amount - minus_two_pay_amount;
      var minus_one_result = fixed_pay_amount - minus_one_pay_amount;
      var zero_change_result = 0;
      var plus_one_result = fixed_pay_amount - plus_one_pay_amount;
      var plus_two_result = fixed_pay_amount - plus_two_pay_amount;
      var plus_three_result = fixed_pay_amount - plus_three_pay_amount;
 
       if (minus_three_pay_result > escrow_amount ){
          limit_minus_three_result = escrow_amount;
        };
        if (plus_three_pay_result < (escrow_amount * -1) ){
          limit_plus_three_result = escrow_amount * -1;
        };

      document.getElementById("insert_minus_three_result").innerHTML = "$".limit_minus_three_result;
      document.getElementById("insert_minus_two_result").innerHTML = "$".minus_two_result;
      document.getElementById("insert_minus_one_result").innerHTML = "$".minus_one_result;
      document.getElementById("insert_zero_change_result").innerHTML = "$".zero_change_result;
      document.getElementById("insert_plus_one_result").innerHTML = "$".plus_one_result;
      document.getElementById("insert_plus_two_result").innerHTML = "$".plus_two_result;
      document.getElementById("insert_plus_three_result").innerHTML = "$".limit_plus_three_result;
    
    }
    else{
    };


  },
   
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
  },

  cancelTrade: function(event){
      $(document).ready(function(){
      $("#cancelTrade").click(function(){
      $("#step_one_input").show();
      $("#step_two_display_quote").hide();
      $("#step_three_profit_loss_table").hide();
      $("#step_four_display_risks").hide();
      $("#step_five_agree").hide();
     
      
      }); 
    });

  },

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
  },

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
  }

};

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
  //I was trying to put #getQuote here because it is not firing when it is in bindEvents
  //it is not working here either. Any ideas?
  $(document).on('click', '#getQuote', App.getQuote);

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});





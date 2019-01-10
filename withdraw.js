// Js file for withdraw.html
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
    $.getJSON('TutorialToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var TutorialTokenArtifact = data;
      App.contracts.TutorialToken = TruffleContract(TutorialTokenArtifact);

      // Set the provider for our contract.
      App.contracts.TutorialToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
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

//JavaScript function below parses and returns the parameters from the url querystring.
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
// then pick up the value from the variable array.

// set a default value to the variable if url parameter is empty:
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}



function displayWithdrawTerms() {
  var $contractnum = getUrlVars()["contractnum"];
  console.log ($contractnum, "contract number");
  var $payout_string = getUrlVars()["payout"];
  var $payout = parseFloat($payout_string);
  console.log($payout, "payout");
  var $matmonth = getUrlVars()["matmonth"];
  var $matyear = getUrlVars()["matyear"];
  var $swaprate_string = getUrlVars()["swaprate"];
  var $swaprate = parseFloat($swaprate_string);
  console.log($swaprate, "swap rate");
  var $LIBOR_string = getUrlVars()["LIBOR"];
  var $LIBOR = parseFloat($LIBOR_string);
  var $swaptype = getUrlVars()["swaptype"];
  console.log($swaptype, "swap type");
  var $notional_string = getUrlVars()["notional"];
  var $notional = parseFloat($notional_string);
  var $escrow_string = getUrlVars()["escrow"];
  var $escrow = parseFloat($escrow_string);
  console.log($escrow, "escrow");

  document.getElementById("insert_contract_number").innerHTML = "&nbsp;" + $contractnum;
  document.getElementById("insert_maturity_month_year").innerHTML = "&nbsp;" + $matmonth + "/" + $matyear;
  
 
  if ($swaptype == "1" ) {
     document.getElementById("insert_swap_type").innerHTML = "&nbsp;" + "From Fixed to Variable";
  }
  else if ($swaptype == "2" ) {
    document.getElementById("insert_swap_type").innerHTML = "&nbsp;" + "From Variable to Fixed";
  }
  else {
    console.log("swaptype undefined");
  }
  document.getElementById("insert_notional_amount").innerHTML = "&nbsp;" + "$" + $notional;
  document.getElementById("insert_swap_rate").innerHTML = "&nbsp;" + $swaprate + "%";
  document.getElementById("insert_LIBOR").innerHTML = "&nbsp;" + $LIBOR + "%";
  document.getElementById("insert_escrow_amt").innerHTML = "&nbsp;" + $escrow.toFixed(2);
  document.getElementById("insert_payout_amount").innerHTML = "&nbsp;" + $payout.toFixed(2);
}

$(function() {
  $(window).load(function() {
    App.init();
    getUrlVars();
   displayWithdrawTerms();

  });
});


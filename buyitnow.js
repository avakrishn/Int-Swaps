// this is for file buyitnow.js 
//do we need to have App.js here because have transferButton function 
//called on buyitnow.html page ??







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



function displayBuyItNowTerms() {
  var $contractnum = getUrlVars()["contractnum"];
  console.log ($contractnum, "contract number");
   var $notional_string = getUrlVars()["notional"];
  var $notional = parseFloat($notional_string);
  console.log($notional, "notional");
  var $matmonth = getUrlVars()["matmonth"];
  var $matyear = getUrlVars()["matyear"];
  var $swaprate_string = getUrlVars()["swaprate"];
  var $swaprate = parseFloat($swaprate_string);
  console.log($swaprate, "swap rate");
  var $swaptype = getUrlVars()["swaptype"];
  console.log($swaptype, "swap type");
  var $escrow_string = getUrlVars()["escrow"];
  var $escrow = parseFloat($escrow_string);
  console.log($escrow, "escrow");

  document.getElementById("insert_contract_number").innerHTML = "&nbsp;" + $contractnum;
  document.getElementById("insert_contract_num").innerHTML = "&nbsp;" + $contractnum;
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
  document.getElementById("insert_swap_rate").innerHTML = "&nbsp;" + $swaprate;
  document.getElementById("insert_escrow_amount").innerHTML = "&nbsp;" + $escrow;

}

$(function() {
  $(window).load(function() {
    App.init();
    getUrlVars();
   displayBuyItNowTerms();

  });
});

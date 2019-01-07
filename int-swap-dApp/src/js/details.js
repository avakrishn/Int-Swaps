//Javascript for detailtemplate.html

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
//end of default value section

function displayDetails() {

	var $notional_string = getUrlVars()["notional"];
	var $notional = parseFloat($notional_string);
	console.log($notional, "notional");
	var $matmonth = getUrlVars()["matmonth"];
	var $matyear = getUrlVars()["matyear"];
	var $swaprate_string = getUrlVars()["swaprate"];
	var $swaprate = parseFloat($swaprate_string);
	console.log($swaprate, "swap rate");
	var $currentrate_string = getUrlVars()["currentrate"];
	var $currentrate = parseFloat($currentrate_string);
	console.log($currentrate, "current rate");
	var $swaptype = getUrlVars()["swaptype"];
	console.log($swaptype, "swap type");
	var $escrow_string = getUrlVars()["escrow"];
	var $escrow = parseFloat($escrow_string);
	console.log($escrow, "escrow");
	var $ratechange_string = getUrlVars()["ratechange"];
	var $ratechange = parseFloat($ratechange_string);
	console.log($ratechange, "rate change");
	var $mytext = getUrlParam('text','Empty');
	console.log ($mytext);
	var $origpymt = ($notional * $currentrate * -1)/ 1200;
	var $revised_orig_fixed_pymt = ($notional * $currentrate * -1)/ 1200;

	if ($ratechange >= $swaprate){
		$limitratechange_string = $swaprate;
	}
	else if ($ratechange < $swaprate * -1) {
		$limitratechange_string = $swaprate * -1;		
	}
	else {
		$limitratechange_string = $ratechange;
		console.log($ratechange, "rate change");
		console.log($swaprate, "swap rate");
		console.log("error in testing limit of zero on rate change");

	}
	$limitratechange = parseFloat($limitratechange_string);
	console.log($limitratechange, "limit of rate change");
	var $revised_orig_var_pymt = ($notional * -1 * ($currentrate + $limitratechange))/ 1200;
	console.log($revised_orig_var_pymt, "revised original variable payment after LIBOR change");
	var $variablepymt = $notional * ($swaprate + $limitratechange) / 1200;
	console.log($variablepymt, "variable pymt");

	var $fixedpymt = $notional * $swaprate / 1200;
	var $fixedpymtpaid = $fixedpymt * -1;

	document.getElementById("insert_notional_detail").innerHTML = "$" + $notional;
	document.getElementById("insert_month_year").innerHTML = $matmonth + "/" + $matyear;
	document.getElementById("insert_current_rate_detail").innerHTML = $currentrate + "%";

	if ($swaptype == "1" ) {
	document.getElementById("insert_swap_type_detail").innerHTML = "From Fixed to Variable";
	document.getElementById("insert_orig_pymt_label").innerHTML = "Current fixed rate interest paid by you to your own bank";
	document.getElementById("insert_orig_pymt_detail").innerHTML = "$" + $origpymt.toFixed(2);
	document.getElementById("insert_revised_orig_pymt_detail").innerHTML = "$" + $revised_orig_fixed_pymt.toFixed(2);
	document.getElementById("insert_revised_orig_pymt_again").innerHTML  = "$" + $revised_orig_fixed_pymt.toFixed(2);
	document.getElementById("insert_variable_pymt_label").innerHTML = "Variable rate interest paid by you to IntSwaps";
	var $variablepymt_paid = $variablepymt * -1;
	document.getElementById("insert_variable_pymt_detail").innerHTML = "&nbsp;&nbsp;" + $variablepymt_paid.toFixed(2);
	document.getElementById("insert_fixed_pymt_label").innerHTML = "Fixed rate interest received by you from IntSwaps";
	document.getElementById("insert_fixed_pymt_detail").innerHTML = $fixedpymt.toFixed(2);
	$netprofitbefore = $variablepymt_paid + $fixedpymt;
	$revised_orig_pymt = $revised_orig_fixed_pymt.toFixed(2);
	document.getElementById("insert_payout_message").innerHTML = "You can see that your net overall interest expense was converted from a fixed cost to a variable cost.";
	}

	else if ($swaptype == "2" ) {
	document.getElementById("insert_swap_type_detail").innerHTML = "From Variable to Fixed";
	document.getElementById("insert_orig_pymt_label").innerHTML = "Current variable rate interest paid by you to your own bank";
	document.getElementById("insert_orig_pymt_detail").innerHTML = "$" + $origpymt.toFixed(2);
	document.getElementById("insert_revised_orig_pymt_detail").innerHTML = "$" + $revised_orig_var_pymt.toFixed(2);
	document.getElementById("insert_revised_orig_pymt_again").innerHTML = "$" + $revised_orig_var_pymt.toFixed(2);
	document.getElementById("insert_variable_pymt_label").innerHTML = "Variable rate interest received by you from IntSwaps";
	
	document.getElementById("insert_variable_pymt_detail").innerHTML =  $variablepymt.toFixed(2);
	document.getElementById("insert_fixed_pymt_label").innerHTML = "Fixed rate interest paid by you to IntSwaps";
	document.getElementById("insert_fixed_pymt_detail").innerHTML = $fixedpymtpaid.toFixed(2);
	$netprofitbefore = $fixedpymtpaid + $variablepymt;
	$revised_orig_pymt = $revised_orig_var_pymt.toFixed(2);
	document.getElementById("insert_payout_message").innerHTML = "You can see that your net overall interest expense was converted from a variable cost to a fixed cost.<br>  The change in interest on your own variable rate loan was offset by the IntSwaps profit or (loss).";
	}
	else {
		console.log("swaptype undefined");
	}
// test for profit or loss in excess of escrow amount
	if ($netprofitbefore > $escrow ){
          $netprofitafter = $escrow;
        } 
    else if ($netprofitbefore < ($escrow * -1) ){
          $netprofitafter = ($escrow * -1);
        }
    else {
    	   $netprofitafter = $netprofitbefore;
    };

    console.log($netprofitbefore, "net profit before limit test");
    console.log($netprofitafter, "net profit after limited to escrow amount");
	$escrowapplied = $escrow;
	console.log($escrowapplied, "escrow applied");
	$netpayout = parseFloat($netprofitafter) + parseFloat($escrow);
	console.log($netpayout, "net payout");
	$netoverall = parseFloat($netprofitafter) + parseFloat($revised_orig_pymt);
	console.log($netoverall, "net overall");
	

	document.getElementById("insert_rate_change_detail").innerHTML = $ratechange + "%";
	document.getElementById("insert_rate_change_header").innerHTML = $ratechange + "%";
	
	document.getElementById("insert_escrow_detail").innerHTML = "$" + $escrow.toFixed(2);
    document.getElementById("insert_swap_rate_detail").innerHTML = $swaprate + "%";
    document.getElementById("insert_orig_pymt_detail").innerHTML = "$" + $origpymt.toFixed(2);
    
   
    document.getElementById("insert_net_profit_bef_adj_detail").innerHTML = $netprofitbefore.toFixed(2);
    document.getElementById("insert_net_profit_after_adj_detail").innerHTML = $netprofitafter.toFixed(2);
    document.getElementById("insert_escrow_applied_detail").innerHTML = $escrowapplied.toFixed(2);
   	document.getElementById("insert_net_payout_detail").innerHTML = $netpayout.toFixed(2);
  	$monthoneoverall = parseFloat($origpymt);
  	console.log ($monthoneoverall, "month one overall");
  	$beforeswapoverall = parseFloat($revised_orig_pymt);
  	console.log ($beforeswapoverall, "before swap overall");
   	document.getElementById("insert_month_one_net_overall_detail").innerHTML = "$" + $monthoneoverall.toFixed(2);
  	document.getElementById("insert_before_swap_net_overall_detail").innerHTML = "$" +  $beforeswapoverall.toFixed(2);
    document.getElementById("insert_net_interest_overall_detail").innerHTML = "$" + $netoverall.toFixed(2);


}; //end of displayDetails function

$(function() {
  $(window).load(function() {
   getUrlVars();
   displayDetails();
  });
});

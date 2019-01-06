//this file is for getquote.html

var $notional_amount = $('#notional_amount');

var $maturity_month = $('#maturity_month');
var $maturity_year = $('#maturity_year');
var $current_annual_rate = $('#current_annual_rate'); //needed for getdetails function
// var maturity_month_year = maturity_month.maturity_year; //might use this variable later
var $swap_out_of_rate_type = $('#swap_out_of_rate_type');

var $swap_contract_rate = 2.880;   //hard-code this value for demo

document.getElementById("getQuote").onclick = function() {getQuote()};

document.getElementById("cancelTrade").onclick = function() {cancelTrade()};


function getQuote(){
 
      $("#step_one_input").hide();
      $("#step_two_display_quote").show();
      $("#step_three_profit_loss_table").show();
      $("#step_four_display_risks").show();
      $("#step_five_agree").show();

      $("#step_six_confirm_trade").hide(); 
          
    var $notional_amount = $('#notional_amount');
    var notional_amount = $notional_amount.val();
    var maturity_month = $maturity_month.val();
    var maturity_year = $maturity_year.val();
    var current_annual_rate = $current_annual_rate.val();
    var escrow_amount = 0.002 * notional_amount;
    var swap_contract_rate = 2.880;   //hard-code this value for demo
    var swap_out_of_rate_type = $swap_out_of_rate_type.val();
    var fixed_pay_amount = notional_amount * swap_contract_rate / 1200;
    var minus_three_pay_amount = notional_amount * (swap_contract_rate - .03) / 1200;
    var minus_two_pay_amount = notional_amount * (swap_contract_rate - .02) / 1200;
    var minus_one_pay_amount = notional_amount * (swap_contract_rate - .01) / 1200;
    var zero_change_pay_amount = notional_amount * swap_contract_rate / 1200;
    var plus_one_pay_amount = notional_amount * (swap_contract_rate + .01) / 1200;
    var plus_two_pay_amount = notional_amount * (swap_contract_rate + .02) / 1200;
    var plus_three_pay_amount = notional_amount * (swap_contract_rate + .03) / 1200;
 //   var month_year =  $maturity_month.val() + "/" + maturity_year.val();
//display quote in this section
    document.getElementById("insert_notional_amount").innerHTML = "$" + $notional_amount.val();
    document.getElementById("insert_month_year").innerHTML = $maturity_month.val() + "/" + $maturity_year.val();
    document.getElementById("insert_current_annual_rate").innerHTML = $current_annual_rate.val() + "%";
  
    document.getElementById("insert_swap_out_of_rate_type").innerHTML = $swap_out_of_rate_type.val();
     document.getElementById("insert_escrow_amount").innerHTML = "$" + escrow_amount.toFixed(2);
    //this one works for swap rate--do not edit
    document.getElementById("insert_swap_rate").innerHTML = swap_contract_rate + "%";
     
    // test for variable to fixed = swap type 2
    if (swap_out_of_rate_type == "2"){
      var minus_three_result = minus_three_pay_amount - fixed_pay_amount;
      var minus_two_result = minus_two_pay_amount - fixed_pay_amount;

      var minus_one_result = minus_one_pay_amount - fixed_pay_amount;
      var zero_change_result = 0;
      var plus_one_result = plus_one_pay_amount - fixed_pay_amount;
      var plus_two_result = plus_two_pay_amount - fixed_pay_amount;
      var plus_three_result = plus_three_pay_amount - fixed_pay_amount;
      var limit_minus_three_result = minus_three_result;
      var limit_plus_three_result = plus_three_result;

        if (minus_three_result < (escrow_amount * -1) ) {
          limit_minus_three_result = (escrow_amount * -1);
        };
        if (plus_three_result > escrow_amount) {
          limit_plus_three_result = escrow_amount;
        };


      document.getElementById("insert_minus_three_result").innerHTML = "$" + limit_minus_three_result.toFixed(2);
      document.getElementById("insert_minus_two_result").innerHTML = "&nbsp;" + minus_two_result.toFixed(2);

      document.getElementById("insert_minus_one_result").innerHTML = minus_one_result.toFixed(2);
      document.getElementById("insert_zero_change_result").innerHTML = zero_change_result.toFixed(2);
      document.getElementById("insert_plus_one_result").innerHTML = plus_one_result.toFixed(2);
      document.getElementById("insert_plus_two_result").innerHTML = plus_two_result.toFixed(2);
      document.getElementById("insert_plus_three_result").innerHTML = limit_plus_three_result.toFixed(2);
    
    };
   

    //test for fixed to variable = swap type 1
    if (swap_out_of_rate_type == "1"){

    //   produces all NaN results if use .valueOf()  
      var minus_three_result = fixed_pay_amount - minus_three_pay_amount;
      var $minus_two_result = fixed_pay_amount - minus_two_pay_amount;
      var minus_one_result = fixed_pay_amount - minus_one_pay_amount;
      var zero_change_result = 0;
      var plus_one_result = fixed_pay_amount - plus_one_pay_amount;
      var plus_two_result = fixed_pay_amount - plus_two_pay_amount;
      var plus_three_result = fixed_pay_amount - plus_three_pay_amount;
      var limit_minus_three_result = minus_three_result;
      var limit_plus_three_result = plus_three_result;
 
       if (minus_three_result > escrow_amount ){
          limit_minus_three_result = escrow_amount;
        };
      
        if (plus_three_result < (escrow_amount * -1) ){
          limit_plus_three_result = (escrow_amount * -1);
        };

      document.getElementById("insert_minus_three_result").innerHTML = limit_minus_three_result.toFixed(2);
      document.getElementById("insert_minus_two_result").innerHTML = $minus_two_result.toFixed(2);
      document.getElementById("insert_minus_one_result").innerHTML = minus_one_result.toFixed(2);
      document.getElementById("insert_zero_change_result").innerHTML = zero_change_result.toFixed(2);
      document.getElementById("insert_plus_one_result").innerHTML = plus_one_result.toFixed(2);
      document.getElementById("insert_plus_two_result").innerHTML = plus_two_result.toFixed(2);
      document.getElementById("insert_plus_three_result").innerHTML = limit_plus_three_result.toFixed(2);
    
    }

   
      var detailurl = "/details.html?notional=";
      var matmonth = "&matmonth=";
      var matyear = "&matyear=";
      var swapratequery = "&swaprate=";
      var currentratequery = "&currentrate=";
      var swaptypequery = "&swaptype=";
      var escrowquery = "&escrow=";
      var ratechangequery = "&ratechange="
     
      var getHrefFront = detailurl.concat(notional_amount).concat(matmonth).concat(maturity_month).concat(matyear).concat(maturity_year).concat(swapratequery).concat(swap_contract_rate).concat(currentratequery).concat(current_annual_rate).concat(swaptypequery).concat(swap_out_of_rate_type).concat(escrowquery).concat(escrow_amount).concat(ratechangequery);

      var minus_three_change = "-3"
      var minus_two_change = "-2";
      var minus_one_change = "-1"
      var zero_change = "0";
      var plus_one_change = "1";
      var plus_two_change = "2";
      var plus_three_change = "3";

      var getMinusThreeHref = getHrefFront.concat(minus_three_change);
      var getMinusTwoHref = getHrefFront.concat(minus_two_change);
      var getMinusOneHref = getHrefFront.concat(minus_one_change);
      var getZeroChangeHref = getHrefFront.concat(zero_change);
      var getPlusOneHref = getHrefFront.concat(plus_one_change);
      var getPlusTwoHref = getHrefFront.concat(plus_two_change);
      var getPlusThreeHref = getHrefFront.concat(plus_three_change);

      document.getElementById("minus_three").target = "_blank";
      document.getElementById("minus_three").href = getMinusThreeHref;
      document.getElementById("minus_two").target = "_blank";
      document.getElementById("minus_two").href = getMinusTwoHref;
      document.getElementById("minus_one").target = "_blank";
      document.getElementById("minus_one").href = getMinusOneHref;  
      document.getElementById("zero_change").target = "_blank";
      document.getElementById("zero_change").href = getZeroChangeHref;
      document.getElementById("plus_one").target = "_blank";
      document.getElementById("plus_one").href = getPlusOneHref;  
      document.getElementById("plus_two").target = "_blank";
      document.getElementById("plus_two").href = getPlusTwoHref;  
      document.getElementById("plus_three").target = "_blank";
      document.getElementById("plus_three").href = getPlusThreeHref; 
      


  }; //end of getQuote function




function cancelTrade(){
         
      $("#step_one_input").show();
      $("#step_two_display_quote").hide();
      $("#step_three_profit_loss_table").hide();
      $("#step_four_display_risks").hide();
      $("#step_five_agree").hide(); 
      $("#step_six_confirm_trade").hide(); 
   

  } //end of cancelTrade function

// see app.js for function placeTrade() that will then 
// trigger function confirmTrade() below

function confirmTrade(){

    $("#step_one_input").hide();
    $("#step_two_display_quote").hide();
    $("#step_three_profit_loss_table").hide();
    $("#step_four_display_risks").hide();
    $("#step_five_agree").hide();   
    $("#step_six_confirm_trade").show(); 

    var current_annual_rate = $current_annual_rate.val();
    var notional_amount = $notional_amount.val();
    var escrow_amount = 0.002 * notional_amount;
    var swap_contract_rate = 2.880;   //hard-code this value for demo
    var confirm_number = "20190117-00001" //hard code confirm number for demo
   //   var today = 
   //   var today_plus_two = 
    var swap_out_of_rate_type = $swap_out_of_rate_type.val();
    var ether_exchange_rate = 159.11;
    var escrow_ether_confirm = escrow_amount * ether_exchange_rate;
    var today = new Date();
    var today_plus_two = today.setDate(today.getDate() + 2);
   
    //hard code this for now until bind event to placeTrade function to get actual new contract address
    var contract_address_confirm = "0xeba6f62f4f7bef9692ecf36cfe3eadf29fd2bed9b";  
    // generated QR code for above address and linked direct from image to step_six_confirm_trade section for demo

    document.getElementById("insert_confirm_number").innerHTML = confirm_number;
    document.getElementById("insert_today").innerHTML = today;
    document.getElementById("insert_today_plus_two").innerHTML = today_plus_two;

    if ($swaptype == "1" ) {
      document.getElementById("insert_swap_type_confirm").innerHTML = "From Fixed to Variable";
    }
    else if  ($swaptype == "2" ) {
      document.getElementById("insert_swap_type_confirm").innerHTML = "From Variable to Fixed";
    }
    else {
      console.log("swaptype undefined for trade confirmation");
    }

    document.getElementById("insert_notional_confirm").innerHTML = notional_amount;
    document.getElementById("insert_maturity_month_year_confirm").innerHTML = $maturity_month + "/" + maturity_year;
    document.getElementById("insert_current_rate_confirm").innerHTML = current_annual_rate;
    document.getElementById("insert_swap_rate_confirm").innerHTML = swap_contract_rate;
    document.getElementById("insert_escrow_dollar_confirm").innerHTML = escrow_amount;
    document.getElementById("insert_ether_exchange_rate").innerHTML = ether_exchange_rate;
    document.getElementById("insert_escrow_ether_confirm").innerHTML = escrow_ether_confirm;
//    hard code contract address into html until placeTrade function is finished with solidity 
//    document.getElementById("insert_contract_address_confirm").innerHTML = contract_address_confirm;


}  //end of confirmTrade function


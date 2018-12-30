//this file is for getquote.html
var current_annual_rate = $('#current_annual_rate');
var fixed_pay_amount = notional_amount * swap_contract_rate / 12;
var minus_three_pay_amount = notional_amount * (swap_contract_rate - .03) / 12;
var minus_two_pay_amount = notional_amount * (swap_contract_rate - .02) / 12;
var minus_one_pay_amount = notional_amount * (swap_contract_rate - .01) / 12;
var zero_change_pay_amount = notional_amount * swap_contract_rate / 12;
var plus_one_pay_amount = notional_amount * (swap_contract_rate + .01) / 12;
var plus_two_pay_amount = notional_amount * (swap_contract_rate + .02) / 12;
var plus_three_pay_amount = notional_amount * (swap_contract_rate + .03) / 12;

function getQuote(){
//trying this as a jquery function--still does not work
    $(document).ready(function(){
 //    $("#getQuote").click(function(){
      $("#step_one_input").hide();
      $("#step_two_display_quote").show();
      $("#step_three_profit_loss_table").show();
      $("#step_four_display_risks").show();
      $("#step_five_agree").show();
      }); 
   
   
    document.getElementById("insert_notional_amount").innerHTML = "$" + notional_amount;
    document.getElementById("insert_month_year").innerHTML = maturity_month + "/" + maturity_year;
    document.getElementById("insert_current_annual_rate").innerHTML = current_annual_rate + "%";
    document.getElementById("insert_swap_out_of_rate_type").innerHTML = swap_out_of_rate_type;
    document.getElementById("insert_escrow_amount").innerHTML = "$"+ escrow_amount;
    document.getElementById("insert_swap_rate").innerHTML = swap_contract_rate + "%";
   
   
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

      document.getElementById("insert_minus_three_result").innerHTML = "$" + limit_minus_three_result;
      document.getElementById("insert_minus_two_result").innerHTML = "$" + minus_two_result;
      document.getElementById("insert_minus_one_result").innerHTML = "$"+ minus_one_result;
      document.getElementById("insert_zero_change_result").innerHTML = "$" + zero_change_result;
      document.getElementById("insert_plus_one_result").innerHTML = "$" + plus_one_result;
      document.getElementById("insert_plus_two_result").innerHTML = "$" + plus_two_result;
      document.getElementById("insert_plus_three_result").innerHTML = "$" + limit_plus_three_result;
    

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


  }; //end of getQuote function




function getDetails(swap_rate_vs_LIBOR){
      window.open();

//stopped here--not done


};  //end of getDetails function

function cancelTrade(event){
      $(document).ready(function(){
      $("#cancelTrade").click(function(){
      $("#step_one_input").show();
      $("#step_two_display_quote").hide();
      $("#step_three_profit_loss_table").hide();
      $("#step_four_display_risks").hide();
      $("#step_five_agree").hide();
     
      
      }); 
    });

  }, //end of cancelTrade function
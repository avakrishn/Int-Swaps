//this file is for getquote.html
// var $notional_amount = $('#notional_amount');
var $maturity_month = $('#maturity_month');
var $maturity_year = $('#maturity_year');
var $current_annual_rate = $('#current_annual_rate'); //needed for getdetails function
// var maturity_month_year = maturity_month.maturity_year; //might use this variable later
var $swap_out_of_rate_type = $('#swap_out_of_rate_type');
var swap_contract_rate = 0.0288;   //hard-code this value for demo

document.getElementById("getQuote").onclick = function() {getQuote()};

function getQuote(){
 
      $("#step_one_input").hide();
      $("#step_two_display_quote").show();
      $("#step_three_profit_loss_table").show();
      $("#step_four_display_risks").show();
      $("#step_five_agree").show();
    var $notional_amount = $('#notional_amount');

    var notional_amount = $notional_amount.val();
    var escrow_amount = 0.002 * notional_amount;
 //   var swap_contract_rate = 0.0288;   //hard-code this value for demo
    var fixed_pay_amount = notional_amount * swap_contract_rate / 12;
    var minus_three_pay_amount = notional_amount * (swap_contract_rate - .03) / 12;
    var minus_two_pay_amount = notional_amount * (swap_contract_rate - .02) / 12;
    var minus_one_pay_amount = notional_amount * (swap_contract_rate - .01) / 12;
    var zero_change_pay_amount = notional_amount * swap_contract_rate / 12;
    var plus_one_pay_amount = notional_amount * (swap_contract_rate + .01) / 12;
    var plus_two_pay_amount = notional_amount * (swap_contract_rate + .02) / 12;
    var plus_three_pay_amount = notional_amount * (swap_contract_rate + .03) / 12;

//display quote in this section
    document.getElementById("insert_notional_amount").innerHTML = "$" + $notional_amount.val();
    document.getElementById("insert_month_year").innerHTML = $maturity_month.val() + "/" + maturity_year.val();
    document.getElementById("insert_current_annual_rate").innerHTML = $current_annual_rate.val() + "%";
    document.getElementById("insert_swap_out_of_rate_type").innerHTML = $swap_out_of_rate_type.val();
  // error msg $escrow_amount.val(); is not a function--does not work
  //not working
  //error result NaN if remove .val() from $escrow_amount
    document.getElementById("insert_escrow_amount").innerHTML = escrow_amount;
    //this one works for swap rate--do not edit
    document.getElementById("insert_swap_rate").innerHTML = swap_contract_rate;
     
    if (swap_out_of_rate_type = "Variable to Fixed"){
      //p[roduces all NaN for all except zero change when remove all $ and .valueOf() and .val()
      var minus_three_result = minus_three_pay_amount - fixed_pay_amount;
      var $minus_two_result = minus_two_pay_amount - fixed_pay_amount;
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

      document.getElementById("insert_minus_three_result").innerHTML = limit_minus_three_result.toFixed(2);
      document.getElementById("insert_minus_two_result").innerHTML = $minus_two_result.toFixed(2);
      document.getElementById("insert_minus_one_result").innerHTML = minus_one_result.toFixed(2);
      document.getElementById("insert_zero_change_result").innerHTML = zero_change_result.toFixed(2);
      document.getElementById("insert_plus_one_result").innerHTML = plus_one_result.toFixed(2);
      document.getElementById("insert_plus_two_result").innerHTML = plus_two_result.toFixed(2);
      document.getElementById("insert_plus_three_result").innerHTML = limit_plus_three_result.toFixed(2);
    
    };
   
    
    if (swap_out_of_rate_type = "Fixed to Variable"){
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
    

  }; //end of getQuote function




function getDetails(swap_rate_vs_LIBOR){
//      window.open();



//stopped here--not done--use modal method instead of function


};  //end of getDetails function

//Modal section using javascrpt and css--not bootstrap
// Get the modal
//var modal = document.getElementById('detailModal');

// Get the button that opens the modal
//var btn = document.getElementById("detailBtn");

// Get the <span> element that closes the modal
//var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
//btn.onclick = function() {
//  modal.style.display = "block";
//}

// When the user clicks on <span> (x), close the modal
//span.onclick = function() {
//  modal.style.display = "none";
//}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}  //end of modal section

//modal section using bootstrap  -but  this did not work--modal pops and disappears
// $(document).ready(function(){
//   $("#detailBtn").click(function(){
//   });
// });

//triggered by button click--no javascript needed for bootstrap


//this works--if trigger by javascript
//    $("#detailModal").modal("toggle");
//  });

//tried to do modal by get element by ID method and this works too:
//document.getElementById("detailBtn").onclick = function() {
//    $("#detailModal").modal("toggle")};

// however all the modals are not working properly --
// all black screen instead of visible content
// and reverts to blank form instead of get details section.


document.getElementById("cancelTrade").onclick = function() {cancelTrade()};
function cancelTrade(){
         
      $("#step_one_input").show();
      $("#step_two_display_quote").hide();
      $("#step_three_profit_loss_table").hide();
      $("#step_four_display_risks").hide();
      $("#step_five_agree").hide();   
   

  } //end of cancelTrade function
// Js file for index.html and about.html
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip(); 
  //I was trying to put #getQuote here because it is not firing when it is in bindEvents
  //it is not working here either. Any ideas?
  $(document).on('click', '#getQuote', App.getQuote);

};

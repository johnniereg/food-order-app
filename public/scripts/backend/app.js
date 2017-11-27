// document ready
$(function(){

  // Listener for submission of dish changes.
  $('.dish-editor-form').on('submit', submitChanges);
  // Listener for submission of new dishes.
  $('#add-new-dish').on('submit', submitNewDish);
  // show inputs for individual dish properties
  $('main.dish-edit-panel section').on('click', showInput);

});

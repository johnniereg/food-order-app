// document ready
$(function(){

  // Listener for submission of dish changes.
  $('.dish-editor-form').on('submit', submitChanges);

  // Listener for submission of new dishes.
  $('.dish-add-new').find('form').on('submit', submitNewDish);
  // show inputs for individual dish properties
  $('main.dish-edit-panel section').on('click', showInput);

});

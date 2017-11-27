// document ready
$(function(){

  // Listener for submission of dish changes.
  $('.dish-editor-form').on('submit', submitChanges);

  // Listener for submission of new dishes.
  $('.dish-add-new').find('form').on('submit', submitNewDish);

  // Show input field to edit a dish property.
  $('main.dish-edit-panel section').on('click', showInput);

});

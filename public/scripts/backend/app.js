// document ready
$(function(){

  $('.dish-edit').on('click', makeForms);
  // Listener for submission of dish changes.
  $('.modify-dish').find('form').on('submit', submitChanges);
  // Listener for submission of new dishes.
  $('.dish-add-new').find('form').on('submit', submitNewDish);

  $('main.dish-edit-panel section').on('click', showInput);

});

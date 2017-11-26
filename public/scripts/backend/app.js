// document ready
$(function(){
  $('.dish-edit').on('click', makeForms);
  $('form').on('submit', submitChanges);
  $('main.dish-edit-panel section').on('click', function(event) {
    var section = $(this);
    section.find('.dish-edit-field').removeClass('hide');
    section.closest('article').find('footer .dish-edit-submit').removeClass('hide');
  });
});

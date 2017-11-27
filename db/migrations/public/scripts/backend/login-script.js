/**
* printErrors - pTo be used with an $.ajax done() method in a form submit listened.
* Handles errors by printing them on the form for which a submit event occured.
* @param  {object} form The jquery form element that is the target of the form submit.
* @param  {varies} responseData An object or string returned by the server
*/
function printErrors(form){
  return function(responseData){
    // if there is an error message.
    if(typeof responseData === 'object'){
      let warning = $('<label>').text(responseData.message).addClass('editor-warning');
      // if a warning already exists, remove it.
      $('.editor-warning').remove();
      form.append(warning);
      return;
    }
    // refresh if data is a string
    window.location.replace(responseData);
  }
}


/**
 * sendLogin - Collects and sends the login fields.
 *
 * @param  {object} event The event object from the form listener.
 */
function sendLogin(event){
  event.preventDefault();
  var form = $(this);
  var formData = form.serialize();
  $.ajax({
    url: '/backend/login',
    method: 'POST',
    data: formData
  })
  .done(printErrors(form));
}

// document ready
$(function(){
  $('form').on('submit', sendLogin);
});

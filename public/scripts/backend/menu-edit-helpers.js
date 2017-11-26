
/**
 * Show input field for an individual menu item property. To be used with a click listener.
 *
 * @param {object} event The event object from the click listener.
 */

function showInput(event){
  var section = $(this);
  section.find('.dish-edit-field').removeClass('hide');
  section.closest('article').find('footer .dish-edit-submit').removeClass('hide');
}

/**
* To be used with an $.ajax done() method in a form submit listened.
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
 * Creates the form data from the changes made to a menu item and sends it.
 * Displays any error messages that are returned.
 * To be used with a form submit listener.
 *
 * @param {object} event The event object from the form submit listener.
 */

function submitChanges(event){
  event.preventDefault();
  var form = $(this);
  // collect image and text form data into an object for sending.
  var formData = new FormData(this);
  $.ajax({
    url:$(this).attr('action'),
    method:'PUT',
    processData: false,
    contentType: false,
    data:formData
  }).done(printErrors(form));
}

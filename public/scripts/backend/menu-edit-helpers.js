function makeForms(event){
  console.log('in event', 'makeForms');
  var card = $(this).closest('article');
  var dishId = card.data('id');
}

function submitChanges(event){
  event.preventDefault();
  var form = $(this);
  var formData = new FormData(this);
  $.ajax({
    url:$(this).attr('action'),
    method:'PUT',
    processData: false,
    contentType: false,
    data:formData
  }).done(function (data) {
    if(typeof data === 'object'){
      let warning = $('<label>').text(data.message).addClass('editor-warning');
      // if a warning already exists, remove it.
      $('.editor-warning').remove();
      form.append(warning);
      return;
    }
    window.location.replace(data);
  });
}

function submitNewDish(event){
  event.preventDefault();
  var form = $(this);
  var formData = new FormData(this);
  console.log("We're trying to submit a new dish.");
  $.ajax({
    url:$(this).attr('action'),
    method:'POST',
    processData: false,
    contentType: false,
    data:formData
  });
}

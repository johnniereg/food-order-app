function makeForms(event){
  console.log('in event', 'makeForms');
  var card = $(this).closest('article');
  var dishId = card.data('id');
}

function submitChanges(event){
  event.preventDefault();
  var inputs = $(this).serialize();
  $.ajax({
    url:$(this).attr('action'),
    method:'PUT',
    data:inputs
  }).done(function (data) {
    console.log(data);
    window.location.replace(data);
  });
}

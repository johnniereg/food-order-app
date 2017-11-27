// document ready
$(function(){
  // delete an order
  $('.delete-order').on('click', function(){
    var $button = $(this);
    $.ajax({
      url: $button.data('action'),
      method: 'DELETE'
    }).done(function(url){
      window.location.replace(url);
    });
  });

  // Send confirmation message for an order.
  $('.finish-order').on('click', function(){
    var $button = $(this);
    var $panelBody = $button.closest('main');
    $.ajax({
      url: $button.data('action'),
      method: 'POST'
    }).done(function(messageObj){
      $panelBody.append($('<label>').text(messageObj.message));
    });
  });
});

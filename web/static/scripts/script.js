// POPPIN OFF
$(document).ready(function() {

  var socket = io();

  // chat socket push
  $('form').submit(function(e) {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    e.preventDefault();
  });

  $('#goBlack').on('click', function() {
    socket.emit('goBlack', 'clicked');
  });
  $('#goWhite').on('click', function() {
    socket.emit('goWhite', 'clicked');
  });

  // Push new messages (from everybody) to the chatbox
  socket.on('chat message', function(msg) {
    console.log(msg)
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('goBlack', function() {
    $('body').css('background', '#000');
  })

  socket.on('goWhite', function() {
    $('body').css('background', '#fff');
  })

})

// POPPIN OFF
$(document).ready(function() {

  var socket = io();

  // chat socket push
  $('form').submit(function(e) {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    e.preventDefault();
  });

  // Get Test Info from socket
  socket.on('test', function(info) {
    console.log(info);
    $('#test').html(`
      ${info.name}<br>
      ${info.message}
    `);
  });

})

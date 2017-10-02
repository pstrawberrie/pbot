/* App Scripts - controlled import */
const socket = io.connect('http://localhost:3002');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
socket.on('character', function (data) {
  console.log(data);
  socket.emit('character', { whats: 'up' });
});

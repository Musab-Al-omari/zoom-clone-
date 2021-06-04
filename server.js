'use strict';


const express = require('express');
const app = express();
const uuid = require('uuid').v4;
const cors = require('cors');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
const sio = require('socket.io')(server);

const ExpressPeerServer = require('peer').ExpressPeerServer;

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static('public'));
app.use('/peerjs', ExpressPeerServer(server, {
  debug: true,
}));
// app.use(express.static('./public'));
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuid()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

sio.on('connection', socket => {


  socket.on('join-room', (roomId, userId) => {

    socket.join(roomId);
    console.log('roomId', roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

  });
});

server.listen(PORT, () => {
  console.log(`we are here on ${PORT}`);
});
'use strict';


const express = require('express');
const app = express();
const uuid = require('uuid').v4;
const cors = require('cors');
const server = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
const sio = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static('public'));


// app.use(express.static(__dirname + '/public'));



// create a room id 

app.get('/', (req, res) => {
  res.redirect(`/${uuid()}`);
});


// send room id to the front end

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});


let ids = [];
sio.on('connection', socket => {

  let newName = '';
  // let MyUserId = '';
  socket.on('join-room', (roomId, userId) => {
    ids.push(userId);
    // create a room using my room id 
    socket.join(roomId);

    // send the user id to whom in the room 
    socket.broadcast.to(roomId).emit('user-connected', userId);
    socket.on('share', () => {
      // socket.broadcast.to(roomId).emit('user-share', ids[1]);
      let x = ids[1];
      ids = [];
      socket.emit('user-share', x);
    });


    socket.emit('userId-Joined');

    socket.on('sendUserToServer', name => {
     
      socket.broadcast.to(roomId).emit('sendBackUserToFrontEnd', name);
    });


    socket.on('sendMassageToServer', message => {
      socket.broadcast.to(roomId).emit('sendMassageBackToFrontEnd', message, newName);
    });


    socket.on('disconnect', () => {
    
      socket.broadcast.to(roomId).emit('user-disconnected', newName, userId);
    });
  });
});


// server-side
// sio.use((socket, next) => {
//   const err = new Error('not authorized');
//   err.data = { content: 'Please retry later' }; // additional details
//   next(err);
// });




server.listen(PORT, () => {
  console.log(`we are here on ${PORT}`);
});
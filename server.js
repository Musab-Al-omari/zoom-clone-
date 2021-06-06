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




// create sio connection 
sio.on('connection', socket => {

  let newName = '';
  // let MyUserId = '';
  socket.on('join-room', (roomId, userId) => {

    // create a room using my room id 
    socket.join(roomId);

    // send the user id to whom in the room 
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.emit('userId-Joined', userId);



    socket.on('sendUserToServer', name => {
      newName = name;
      socket.broadcast.emit('sendBackUserToFrontEnd', name);
    });


    socket.on('sendMassageToServer', message => {
      socket.broadcast.emit('sendMassageBackToFrontEnd', message, newName);
    });




    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', newName, userId);
    });



  });





  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
















});






server.listen(PORT, () => {
  console.log(`we are here on ${PORT}`);
});
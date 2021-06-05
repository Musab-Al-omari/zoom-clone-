'use strict';

// eslint-disable-next-line no-undef
const socket = io('/');
// eslint-disable-next-line no-undef
const peer = new Peer();
// undefined, {
//   host: 'vediotest-123.herokuapp.com',
//   port: '3003',
//   secure: true,
// }

// https://vediotest-123.herokuapp.com/
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;



peer.on('open', (id) => {
  // eslint-disable-next-line no-undef
  console.log(roomId, id);
  // eslint-disable-next-line no-undef
  socket.emit('join-room', roomId, id);
});






navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then((stream) => {
  addVideoStream(myVideo, stream);




  peer.on('call', call => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on('user-connected', (userId) => {
    console.log(userId);
    // setTimeout(() => {
    connectToNewUser(userId, stream);
    // }, 1000);
  });


});





const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  // console.log('stream', video);
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement('video');

  console.log('call', call);

  call.on('stream', function(userVideoStream) {
    console.log('hiiii');
    console.log('userVideoStream', userVideoStream);
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    console.log('CLOSED');
    video.remove();
  });
};

socket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});




















// const myVideoElement = document.createElement('video');
// myVideoElement.muted = true;
// const videoGrid = document.getElementById('video-grid');

// navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: true,
// }).then((stream) => {
//   myVideoElement.srcObject = stream;
//   myVideoElement.addEventListener('loadedmetadata', () => {
//     myVideoElement.play();
//   });
//   videoGrid.append(myVideoElement);
// });
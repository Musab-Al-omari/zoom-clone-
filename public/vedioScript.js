'use strict';

// eslint-disable-next-line no-undef
const socket = io('/');
// eslint-disable-next-line no-undef
const peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000',
});
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;

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
    connectToNewUser(userId, stream);
  });
});

peer.on('open', id => {
  // eslint-disable-next-line no-undef
  console.log(roomId, id);
  socket.emit('join-room', roomId, id);
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
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
};





















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
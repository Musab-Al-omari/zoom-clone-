'use strict';

// eslint-disable-next-line no-undef
const socket = io('/');
// eslint-disable-next-line no-undef
const peer = new Peer(undefined, {
  host: 'vediotest-123.herokuapp.com',
  // host: '/',
  port: location.protocol === 'https:' ? 443 : 3003,
  // port: 9000,
  secure: true,
  config: {
    'iceServers': [
      { url: 'stun:stun01.sipphone.com' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stun.fwdnet.net' },
      { url: 'stun:stun.ideasip.com' },
      { url: 'stun:stun.iptel.org' },
      { url: 'stun:stun.rixtelecom.se' },
      { url: 'stun:stun.schlund.de' },
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com',
      },
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
      {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
    ],
  },
});
// undefined, {
//   host: 'vediotest-123.herokuapp.com',
//   port: '3003',
//   secure: true,
// }

// https://vediotest-123.herokuapp.com/
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;


peer.on('open', id => {
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
    setTimeout(() => {
      connectToNewUser(userId, stream);
    }, 1000);
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
'use strict';
const peerObj = {};
let peerKeyArray = [];
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;
const shareScreenB = document.getElementById('shareScreen');
const shareVideo = document.getElementById('share-grid');





// eslint-disable-next-line no-undef
const socket = io('/');
// eslint-disable-next-line no-undef
const peer = new Peer();
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-undef
const myPeer = new Peer();


peer.on('open', (id) => {
  // eslint-disable-next-line no-undef
  console.log('peer id ', id);
  peerKeyArray.push(id);
  // eslint-disable-next-line no-undef
  socket.emit('join-room', roomId, id);

});


// add video to your page
const addVideoStream = async(video, stream) => {
  video.srcObject = await stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};




async function callStream(stream) {
  addVideoStream(myVideo, stream);
  let x = await stream;


  peer.on('call', call => {
    console.log('iam in the');
    call.answer(x);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
      console.log('CLOSED');
      video.remove();
    });
    // peerObj[userId] = call;
  });
  socket.on('user-connected', (userId) => {
    console.log('first time ');
    setTimeout(() => {
      connectToNewUser(userId, x);
    }, 3000);
  });
}
const myNavigator = navigator.mediaDevices.getUserMedia({ video: true, audio: true }) || navigator.mediaDevices.webkitGetUserMedia({ video: true, audio: true }) || navigator.mediaDevices.mozGetUserMedia({ video: true, audio: true }) || navigator.mediaDevices.msGetUserMedia({ video: true, audio: true });
callStream(myNavigator);


const connectToNewUser = async(userId, stream) => {

  const call = peer.call(userId, stream);

  const video = document.createElement('video');

  call.on('stream', function(userVideoStream) {
    console.log('I CALLED');

    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    console.log('CLOSED');
    video.remove();
  });
  ////////////////////////////////////////////


  peerObj[userId] = call;

};

// socket.client error handler 
socket.on('connect_error', err => {
  console.log(err instanceof Error); // true
  console.log(`connect_error due to ${err.message}`); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});


// alert that a user joined to the browser       //////////////////////////////////////////////////////////////////////////
socket.on('userId-Joined', userid => {
  let name = prompt('give me ur name');
  if (name === null) {
    name = 'black guy from Connan';
  }
  appendMessage(`user :${name} has recently joined`);
  socket.emit('sendUserToServer', name);
});

// append the user name to message container
socket.on('sendBackUserToFrontEnd', name => {
  appendMessage(`user :${name} has recently joined`);
});


// when a user close the browser
socket.on('user-disconnected', (name, id) => {

  peerObj[id].close();
  appendMessage(`user:${name} has been disconnected`);
});


// APPENDING UR MESSAGE TO THE CONTAINER AND SENDING IT TO THE SERVER
messageForm.onsubmit = eventSubmit;

function eventSubmit(event) {
  event.preventDefault();
  const message = messageInput.value;
  if (message !== '') {
    appendMessage(`YOU:${message}`);
    socket.emit('sendMassageToServer', message);
    messageInput.value = '';
  }
}

// WRITE THE MESSAGE THAT CAME BACK FROM THE SERVER
socket.on('sendMassageBackToFrontEnd', (message, name) => {
  appendMessage(`${name}:${message}`);
});



// to append a message to the chat container
function appendMessage(message) {
  const messageElement = document.createElement('section');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}




async function startCapture() {
  let captureStream = null;
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  } catch (err) {
    console.error('Error: ' + err);
  }
  return captureStream;
}




//  share screen function 
shareScreenB.addEventListener('click', async function name(event) {
  event.preventDefault();
  // const stream = startCapture()
  socket.emit('share');

  // the answer 
  // myPeer.on('call', call => {
  //   call.answer(stream);
  //   console.log('whhhhhhhhhhhhhhhhhhhhhhhhhhh');
  //   const video = document.createElement('video');
  //   video.setAttribute('class', 'shareScreen')
  //   console.log(video);
  //   call.on('stream', userVideoStream => {
  //     addShareStream(video, userVideoStream);
  //   });
  //   call.on('close', () => {
  //     console.log('CLOSED');
  //     video.remove();
  //   });
  // });


});



socket.on('user-share', (userId) => {
  console.log('userId', userId);
  navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
    setTimeout(() => {
      connectNewShare(userId, stream);
    }, 5000);
  });
});



async function connectNewShare(userId, stream) {

  const call = myPeer.call(userId, stream);
  console.log('call', call);
}

console.log('helllllllo');
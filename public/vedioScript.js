'use strict';



const peerObj = {};
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;



// eslint-disable-next-line no-undef
const socket = io('/');
// eslint-disable-next-line no-undef
const peer = new Peer();


// some peer configuration 


// undefined, {
//   host: 'vediotest-123.herokuapp.com',
//   port: '3003',
//   secure: true,
// }
// https://vediotest-123.herokuapp.com/



// let hostId = '';
peer.on('open', (id) => {
  // eslint-disable-next-line no-undef
  // hostId = id;
  // console.log('this is my peer id', id);
  // eslint-disable-next-line no-undef
  socket.emit('join-room', roomId, id);

});

const myNavigator = navigator.mediaDevices.getUserMedia({ video: true, audio: true }) || navigator.mediaDevices.webkitGetUserMedia({ video: true, audio: true }) || navigator.mediaDevices.mozGetUserMedia({ video: true, audio: true }) || navigator.mediaDevices.msGetUserMedia({ video: true, audio: true });

async function shareScreen() {
  return await navigator.mediaDevices.getDisplayMedia({ video: true });
}




const addVideoStream = async(video, stream) => {
  console.log(2);
  video.srcObject = await stream;

  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};

const connectToNewUser = async(userId, stream) => {
  let x = await stream;
  const call = peer.call(userId, x);
  console.log('hi');
  const video = document.createElement('video');

  console.log('call', call);

  call.on('stream', function(userVideoStream) {
    console.log('hiiii');

    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    console.log('CLOSED');
    video.remove();
  });

  peerObj[userId] = call;

  // function hostClose(userId) {
  //   peerObj[userId].close();
  // }
  console.log(peerObj);
};



async function callStream(stream) {
  console.log(1);
  addVideoStream(myVideo, stream);
  // addShareScreen((myVideo, stream));
  let x = await stream;
  peer.on('call', call => {

    call.answer(x);
    const video = document.createElement('video');
    console.log(3);

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
    console.log('userId first', userId);
    setTimeout(() => {
      connectToNewUser(userId, stream);
    }, 2000);
  });
}
callStream(myNavigator);







// const addShareScreen = (myVideo, stream) => {
//   myVideo.srcObject = window.URL.createObjectURL(stream);
//   myVideo.play();
// };




socket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});



socket.on('userId-Joined', userid => {
  let name = prompt('give me ur name');
  if (name === null) {
    name = 'black guy from Connan';
  }
  // console.log(`user ${name} with the id ${userid} connect to the chat`);
  appendMessage(`user :${name} has recently joined`);
  socket.emit('sendUserToServer', name);

});
socket.on('sendBackUserToFrontEnd', name => {
  appendMessage(`user :${name} has recently joined`);
});

socket.on('user-disconnected', (name, id) => {

  console.log('peerObj[id] dis', peerObj.id);
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
  // let Isak = `${name}:${message}`;
  appendMessage(`${name}:${message}`);
});

function appendMessage(message) {
  const messageElement = document.createElement('section');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}






// const shareScreen = async() => {
//   let captureStream = null;

//   try {
//     captureStream = await navigator.mediaDevices.getDisplayMedia();
//   } catch (err) {
//     console.error("Error: " + err);
//   }
//   // connectToNewUser(myUserId, captureStream);
//   peer.call(myUserId, captureStream);
// };














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
const socket = io('/')
const videoGrid = document.getElementById('video-grid')

// const myPeer = new Peer(undefined, {
//   host: '/',
//   port: '3001'
// })

let id = null;

const myPeer = new Peer(id, {
  host: "evening-atoll-16293.herokuapp.com",
  // host: "https://peerserver.hudektech.com/",
  port: 443,
  secure: true,
});

// myPeer.on('open', id => {
//   socket.emit('join-room', ROOM_ID, id)
// })

const myVideo = document.createElement('video')
myVideo.setAttribute("playsinline", true);
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
  video: { width: 1280, height: 720 },
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })

  myPeer.on('call', call => {
    console.log('myPeer.on call');
    console.log(stream);
    console.log(call);

    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})



function connectToNewUser(userId, stream) {
  const video = document.createElement('video')

  const call = myPeer.call(userId, stream)

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  debugger;
  video.addEventListener('loadedmetadata', () => {
    video.setAttribute("playsinline", true);
    video.play()
  })
  videoGrid.append(video)
}
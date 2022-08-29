(async () => {

  // let streamDummy = await navigator.mediaDevices.getUserMedia({
  //   video: { width: 1280, height: 720 },
  //   audio: true
  // })

  // streamDummy = null;

  const socket = io('/')

  // myVideo.muted = true

  const peers = {}

  // Get my peer object
  myPeer = new Peer(null, {
    host: "evening-atoll-16293.herokuapp.com",
    port: 443,
    secure: true,
  });

  await myPeerOpen();
  const myPeerId = myPeer.id;

  // Get permissions


  // Open up my video stream
  let stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720 },
    audio: true
  })

  addVideoStream(myPeerId, stream)
  // const video = document.createElement('video')
  // video.srcObject = stream
  // video.dataset.peerId = myPeerId;
  // video.setAttribute("playsinline", true);
  // videoGrid.append(video)
  // video.addEventListener('loadedmetadata', () => video.play())


  // The room id is created by the server at the root, redirected to this room
  // The view room.ejs receives this variable from the server and
  // sets the variable ROOM_ID to this value so this script can know it
  const roomId2 = document.URL.split('/')[3];


  // Tell the server you joined the room, and the server will broadcast to 
  // everyone in the room your peerId who will call your peerId;
  socket.emit('join-room', roomId2, myPeerId)
  // socket.emit('join-room', ROOM_ID, myPeer.id)

  // addVideoStream(myPeerId, stream)

  // Receive call from your peers
  myPeer.on('call', call => {
    console.log('myPeer.on("call")');

    // console.log('myPeer.on call');
    console.log(stream);
    console.log(call);
    console.log(`partnerPeerId = ${call.peer}`);


    const partnerPeerId = call.peer;

    // Answer the call and give them your stream
    call.answer(stream)

    // When partner sends you their streem, add it
    call.on('stream', partnerStream => {
      console.log(`You call and are answered from:  ${partnerPeerId}`);

      addVideoStream(partnerPeerId, partnerStream)
    })

    call.on('close', () => {
      // video.remove()
      removeVideoElement(partnerPeerId)
    })

    peers[partnerPeerId] = call
  })


  // When a user connects, call them and send them your stream
  socket.on('peer-connected', partnerPeerId => {
    console.log('socket.on("peer-connected")');

    const call2 = myPeer.call(partnerPeerId, stream)

    call2.on('stream', partnerStream => {
      console.log(`Peer connected and they answered your call:  ${partnerPeerId}`);

      addVideoStream(partnerPeerId, partnerStream)
    })

    call2.on('close', () => {
      // video.remove()
      removeVideoElement(partnerPeerId)
    })

    peers[partnerPeerId] = call2
  })

  socket.on('peer-disconnected', partnerPeerId => {
    if (peers[partnerPeerId]) peers[partnerPeerId].close()
  })









})();
let myPeer;
const videoGrid = document.getElementById('video-grid')

const myPeerOpen = () => {
    return new Promise((resolve, reject) => {
        myPeer.on('open', id => resolve(id))
    })
}

const addVideoStream = (peerId, stream) => {
    let test = document.querySelector(`video[data-peer-id="${peerId}"]`);
    if (test) {
        console.log('exists');

        return
    }
    const video = document.createElement('video')
    video.srcObject = stream
    video.dataset.peerId = peerId;
    video.setAttribute("playsinline", true);
    videoGrid.append(video)

    video.addEventListener('loadedmetadata', () => video.play())
}

const removeVideoElement = (peerId) => {
    console.log(peerId);
    // console.log([...document.querySelectorAll(`[data-peer-id = ${peerId}]`)]);

    [...document.querySelectorAll(`[data-peer-id = "${peerId}"]`)]?.map(el => {
        el.remove()
    })
}

// const sleep = (ms) => {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// };

// const getStream = () => {
//     return new Promise((resolve, reject) => {
//         navigator.mediaDevices.getUserMedia({
//             video: { width: 1280, height: 720 },
//             audio: true
//         }, stream => resolve(stream))
//     })
// }

// const myFetch2 = (url) => {
//   return new Promise((resolve, reject) => {
//     fetch(url, (obj) => resolve(obj));
//   });
// };


// const waitForPeer = () => {
//     return new Promise((resolve, reject) => {
//         setInterval(() => {
//             if (peer?.id) {
//                 resolve();
//             }
//         }, 200);
//     });
// };
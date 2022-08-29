if (process.env.NODE_ENV !== "production") {
  console.log(process.env.NODE_ENV);
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  const newRandom = require("crypto").randomBytes(2).toString('hex');
  console.log(newRandom);
  res.redirect(`/${newRandom}`)
  // res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('peer-connected', peerId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('peer-disconnected', peerId)
    })
  })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
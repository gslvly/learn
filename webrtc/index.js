const io = require('socket.io')(9000)

io.on('connection', socket => {

  socket.on('offer', offer => {
    socket.broadcast.emit('offer', offer)
  })
  socket.on('want-in', _ => {
    socket.broadcast.emit('want-in')
    // socket.emit('offer', offer1)
    // socket.emit('candidate', candidate)
  })
  socket.on('answer', answer => {
    socket.broadcast.emit('answer', answer)
  })

  socket.on('candidate', data => {
    socket.broadcast.emit('candidate', data)

  })


})
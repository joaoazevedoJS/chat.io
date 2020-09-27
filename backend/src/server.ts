import express from 'express'
import cors from 'cors'
import socketio from 'socket.io'
import http from 'http'

import routes from './routes'

const app = express()
const server =  new http.Server(app);
const io = socketio(server)

let connections = 0 
const chatMessage = []

// vai ouvir todas as connections do usuário
io.on('connection', socket => {
  ++connections
  
  io.emit('siteConnections', connections);
  
  socket.on('disconnect', () => {
    --connections;

    io.emit('siteDisconnect', connections)
  })

  socket.on('getMessages', () => {
    socket.emit('chatMessage', chatMessage)
  })

  socket.on('sendMessage', userMessage => {
    chatMessage.push(userMessage)

    socket.broadcast.emit('chatMessage', chatMessage)
  })
})

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(process.env.PORT || 3333)
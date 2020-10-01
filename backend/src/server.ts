import express from 'express'
import cors from 'cors'
import socketio from 'socket.io'
import http from 'http'

import GenerateColor from './utils/colorGenarator'
import CreateMessage from './utils/CreateMessage'

const app = express()
const server =  new http.Server(app);
const io = socketio(server)

app.use(cors())
app.use(express.json())

let connections = 0 
const chatMessage = []

io.on('connection', socket => {
  ++connections

  const user_color = GenerateColor()
  let user_name = "Anonimo"
  
  socket.broadcast.emit('siteConnections', connections);

  socket.on('getConnections', () => {
    socket.emit('siteConnections', connections);
  })

  socket.on("userName", (userName: string) => { user_name = userName })
  
  socket.on('disconnect', () => {
    --connections;

    socket.broadcast.emit('siteDisconnect', connections)
  })

  socket.on('getMessages', () => {
    socket.emit('chatMessage', chatMessage)
  })

  socket.on('sendMessage', message => {
    const user_message = CreateMessage(message, socket.id, user_name, user_color)
    
    chatMessage.push(user_message)

    io.emit('chatMessage', chatMessage)
  })
})

server.listen(process.env.PORT || 3333)
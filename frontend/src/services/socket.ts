import socketio from 'socket.io-client'

const socket = socketio("http://localhost:3333")

export default socket
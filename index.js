'use strict'

const io = require('socket.io')(port)
const middleware = require('socketio-wildcard')()

const port = parseInt(process.argv[1]) || 8080

io.use(middleware)

io.sockets.on('connection', socket => {
	console.log('new connection: ' + socket.id)
	const _id = { id: socket.id }
	socket.broadcast.emit('new', _id)

	socket.on('*', packet => {
		console.log({ packet, _id })
	})
})

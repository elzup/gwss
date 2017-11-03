'use strict'

function gio(port) {
	const io = require('socket.io')(port)
	io.sockets.on('connection', socket => {
		console.log('new connection: ' + socket.id)
		const _id = { id: socket.id }
		socket.broadcast.emit('new', _id)

		socket.on('join', packet => {
			socket.join('testroom')
			console.log(packet)
		})
	})
}

module.exports = gio

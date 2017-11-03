'use strict'

function gio(port, ns) {
	const io = require('socket.io')(port)
	const nsp = io.of(ns)

	const store = {}
	nsp.on('connection', socket => {
		console.log('new connection: ' + socket.id)
		store[socket.id] = { id: socket.id }

		socket.on('join', packet => {
			socket.join(packet.room)
			const { id, room, profile } = packet
			store[id] = { room, profile }
			socket
				.to(room)
				.broadcast.emit('msg', { event: 'connected', id: socket.id })
		})

		socket.on('msg', packet => {
			const { id } = packet
			nsp.to(store[id].room).emit('msg', packet)
		})
	})
	return { io, nsp }
}

module.exports = gio

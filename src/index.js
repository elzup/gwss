'use strict'

function gio(port, ns) {
	const io = require('socket.io')(port)
	const nsp = io.of(ns)
	io.origins('*:*')

	nsp.on('connection', socket => {
		const { id } = socket
		console.log('new : ' + id)
		const store = {}

		socket.on('join', packet => {
			socket.join(packet.room)
			const { room, profile } = packet
			console.log(' join: ' + room + ' << ' + id)
			Object.assign(store, { room, profile })
			socket.to(room).emit('msg', Object.assign(packet, { event: 'join', id }))
		})

		socket.on('msg', packet => {
			nsp.to(store.room).emit('msg', Object.assign(packet, { id }))
		})

		socket.on('disconnect', packet => {
			console.log(packet)
			socket.to(store.room).emit('msg', { event: 'disconnect', id })
			console.log('dis : ' + id)
		})
	})
	return { io, nsp }
}

module.exports = gio

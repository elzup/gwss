'use strict'

function gio(port, ns) {
	const io = require('socket.io')(port)
	const nsp = io.of(ns)
	io.origins('*:*')

	nsp.on('connection', socket => {
		const { id } = socket
		console.log('new : ' + id)
		const store = {}
		socket.join('log')

		socket.on('log', packet => {
			nsp.to('log').emit('log', Object.assign(packet, { id }))
		})

		socket.on('disconnect', () => {
			nsp.to(store.room).emit('msg', { event: 'disconnect', id })
			console.log('dis : ' + id)
		})
	})
	return { io, nsp }
}

module.exports = gio

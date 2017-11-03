/* global describe, before, it */
'use strict'

const path = require('path')
const assert = require('assert')
const connect = require('socket.io-client')

const gio = require(path.resolve(__dirname, '../src/'))

describe('server', () => {
	before(() => {
		gio(8080)
	})

	it('should work', done => {
		const client = connect('http://localhost:8080')

		client.on('connect', () => {
			client.emit('join', { room: 'a-room', events: ['a', 'b', 'c'] })
			client.emit('a', { hoge: 'fuga' })
			client.on('a', data => {
				assert.equal(data, { hoge: 'fuga' })
				done()
			})
		})
	})
})

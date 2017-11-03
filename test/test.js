/* global describe, before, it */
'use strict'

const path = require('path')
const assert = require('assert')
const connect = require('socket.io-client')

const gio = require(path.resolve(__dirname, '../src/'))
const ns = '/test'
const { io, nsp } = gio(8080, ns)

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

describe('server', () => {
	before(() => {})

	after(() => {
		io.close()
	})

	it('should get connected', done => {
		const first = connect(`http://localhost:8080${ns}`)
		first.on('connect', () => {
			first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
			first.on('msg', data => {
				assert.equal(data.event, 'connected')
				done()
			})
		})
		sleep(100).then(() => {
			const second = connect(`http://localhost:8080${ns}`)
			second.on('connect', () => {
				second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
				second.emit('msg', { hoge: 'fuga' })
			})
		})
	})
})

/* global describe, before, it */
'use strict'

const path = require('path')
const assert = require('assert')
const connect = require('socket.io-client')

const gio = require(path.resolve(__dirname, '../src/'))
const ns = '/test'
let io, nsp

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

let i = 0
beforeEach(() => {
	i++
	const p = gio(8080, ns + i)
	io = p.io
	nsp = p.nsp
})

afterEach(() => {
	io.close()
	sleep(100).then()
})

describe('server', () => {
	it('should get connected', done => {
		const first = connect(`http://localhost:8080${ns + i}`)
		first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
		first.on('msg', data => {
			assert.equal(data.event, 'connected')
			done()
		})
		sleep(100).then(() => {
			const second = connect(`http://localhost:8080${ns + i}`)
			second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
		})
	})

	it('should get message', done => {
		const first = connect(`http://localhost:8080${ns + i}`)
		first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
		sleep(200).then(() => {
			first.on('msg', data => {
				assert.equal(data.hoge, 'fuga')
				done()
			})
		})

		const second = connect(`http://localhost:8080${ns + i}`)
		second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
		sleep(400).then(() => {
			second.emit('msg', { hoge: 'fuga' })
		})
	})

	it('should get disconnect', done => {
		const first = connect(`http://localhost:8080${ns + i}`)
		first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
		sleep(100).then(() => {
			first.on('msg', data => {
				assert.equal(data.event, 'disconnect')
				done()
			})
		})

		const second = connect(`http://localhost:8080${ns + i}`)
		second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
		sleep(200).then(() => {
			second.close()
		})
	})
})

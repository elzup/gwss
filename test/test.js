/* global describe, before, it */
'use strict'

const path = require('path')
const assert = require('assert')
const connect = require('socket.io-client')

const gio = require(path.resolve(__dirname, '../src/'))
const ns = '/test'
let io, nsp
const stepDelay = 100

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
	sleep(stepDelay).then()
})

describe('server', () => {
	it('should get connected', done => {
		const first = connect(`http://localhost:8080${ns + i}`)
		first.on('connect', () => {
			first.emit('join', { room: 'a-room', profile: { m: 'hello' } }, () => {})
			first.on('msg', data => {
				assert.equal(data.event, 'connected')
				first.close()
				second.close()
				done()
			})
			const second = connect(`http://localhost:8080${ns + i}`)
			second.on('connect', () => {
				second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
			})
		})
	})

	it('should get message', done => {
		const first = connect(`http://localhost:8080${ns + i}`)
		first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
		first.on('connect', () => {
			const second = connect(`http://localhost:8080${ns + i}`)
			second.on('connect', () => {
				second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
				sleep(stepDelay).then(() => {
					first.on('msg', data => {
						assert.deepEqual(data, { hoge: 'fuga' })
						first.close()
						second.close()
						done()
					})
				})
				sleep(stepDelay * 2).then(() => {
					second.emit('msg', { hoge: 'fuga' })
				})
			})
		})
	})

	it('should get disconnect', done => {
		const first = connect(`http://localhost:8080${ns + i}`)
		first.on('connect', () => {
			first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
			const second = connect(`http://localhost:8080${ns + i}`)
			second.on('connect', () => {
				second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
				sleep(stepDelay).then(() => {
					first.on('msg', data => {
						assert.equal(data.event, 'disconnect')
						first.close()
						done()
					})
				})
				sleep(stepDelay * 2).then(() => {
					second.close()
				})
			})
		})
	})
})

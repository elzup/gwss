/* global describe, beforeEach, afterEach, it */
'use strict'

const path = require('path')
const assert = require('assert')
const connect = require('socket.io-client')
const gio = require('../src/')

const ns = '/test'

let io
const stepDelay = 100

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))

let i = 0

beforeEach(() => {
	i++
	const p = gio(8080, ns + i)

	io = p.io
})

afterEach(() => {
	io.close()
	sleep(stepDelay).then()
})

describe('server', () => {
	it('should get join', (done) => {
		const first = connect(`http://localhost:8080${ns + i}`)

		first.on('connect', () => {
			first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
			first.on('msg', (data) => {
				assert.ok('id' in data)
				delete data.id
				if (data.profile.m === 'hello') {
					return
				}
				assert.deepEqual(data, {
					room: 'a-room',
					event: 'join',
					profile: { m: 'yo' },
					foo: 'bar',
				})
				first.close()
				second.close()
				done()
			})
			const second = connect(`http://localhost:8080${ns + i}`)

			second.on('connect', () => {
				second.emit('join', {
					room: 'a-room',
					profile: { m: 'yo' },
					foo: 'bar',
				})
			})
		})
	})

	it('should get message', (done) => {
		const first = connect(`http://localhost:8080${ns + i}`)

		first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
		first.on('connect', () => {
			const second = connect(`http://localhost:8080${ns + i}`)

			second.on('connect', () => {
				second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
				sleep(stepDelay).then(() => {
					first.on('msg', (data) => {
						assert.ok('id' in data)
						delete data.id
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

	it('should get disconnect', (done) => {
		const first = connect(`http://localhost:8080${ns + i}`)

		first.on('connect', () => {
			first.emit('join', { room: 'a-room', profile: { m: 'hello' } })
			const second = connect(`http://localhost:8080${ns + i}`)

			second.on('connect', () => {
				second.emit('join', { room: 'a-room', profile: { m: 'yo' } })
				sleep(stepDelay).then(() => {
					first.on('msg', (data) => {
						assert.ok('id' in data)
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

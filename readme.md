# gwss [![Build Status](https://travis-ci.org/elzup/gwss.svg?branch=master)](https://travis-ci.org/elzup/gwss)

> General purpose WebSocket Server




## Client usage

Client1

```js
const io = require('socket.io-client')
const url = '{{host}}/base'
const socket = io(url)

socket.on('connect', () => {
	socket.emit('join', { room: "play1", profile: { b: 'c'} })
	socket.on('msg', data => {
		console.log(data)
		// on Client2 emitted.
		// { a: 'b', b: 'c' }
	})
})

```

Client2

```js
const io = require('socket.io-client')
const url = '{{host}}/base'
const socket = io(url)

socket.on('connect', () => {
	socket.emit('join', { room: "play1", profile: { b: 'c'} })
	socket.emit('msg', { a: 'b', b: 'c' })
})

```



## License

MIT © [elzup](http://elzup.com)

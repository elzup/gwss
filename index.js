'use strict'

const gio = require('./src')

const port = parseInt(process.argv[1]) || 8080
const ns = '/base'

gio(port, ns)
console.log(`WebSocket server start!
port: ${port}
namespace: ${ns}
`)

'use strict'

const gio = require('./src')

const port = parseInt(process.argv[1]) || 8080

gio(port)

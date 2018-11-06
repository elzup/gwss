# coding: UTF-8

# from socketio_client import SocketIO, BaseNamespace
from socketIO_client_nexus import SocketIO, BaseNamespace


class LogNamespace(BaseNamespace):
    def on_aaa_response(self, *args):
        print('on_aaa_response', args)

# io = SocketIO('localhost', 8080)
io = SocketIO('10.0.0.3', 8080)

namespace = "/base"
my_namespace = io.define(LogNamespace, namespace)

print("connected")


my_namespace.emit('log', {'name': 'cad', 'logs': []})
io.wait(seconds=1)

# socketIO.wait(seconds=1)
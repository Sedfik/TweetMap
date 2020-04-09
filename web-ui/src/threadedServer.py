from socketserver import ThreadingMixIn
from http.server import HTTPServer
import os
import handler
from handler import TweetHandler


PORT = 8800
resources = os.path.join(os.path.dirname(__file__), '../resources')
os.chdir(resources)
class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass


server = ThreadingSimpleServer(("",PORT),TweetHandler)
print("serving at port", PORT)
try:
    server.serve_forever()
except KeyboardInterrupt:
	server.server_close()
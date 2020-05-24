from socketserver import ThreadingMixIn
from http.server import HTTPServer
import os
import handler
from handler import TweetHandler


#création du serveur multithread
PORT = 8800
resources = os.path.join(os.path.dirname(__file__), '../resources')
os.chdir(resources)
class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

# le serveur lance un nouveau thread pour chaque appel au handler
server = ThreadingSimpleServer(("",PORT),TweetHandler)
print("serving at port", PORT)
try:
    server.serve_forever()
except KeyboardInterrupt:
	server.server_close()
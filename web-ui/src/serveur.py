import http.server
import socketserver
import os
import handler
PORT = 8880

resources = os.path.join(os.path.dirname(__file__), '../resources')
os.chdir(resources)

Handler = handler.TweetHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
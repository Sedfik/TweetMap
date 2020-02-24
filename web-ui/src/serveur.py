import http.server
import socketserver
import os

PORT = 8888

resources = os.path.join(os.path.dirname(__file__), '../resources')
os.chdir(resources)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
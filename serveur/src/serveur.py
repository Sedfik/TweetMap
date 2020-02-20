import http.server
import socketserver
import functools

PORT = 8000

Handler =  functools.partial(http.server.SimpleHTTPRequestHandler,directory='../../web-ui/src')

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
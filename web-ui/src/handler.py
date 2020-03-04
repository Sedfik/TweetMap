import sys 
import http.server
import urllib.parse
import tweetsprocess as tp

class TweetHandler(http.server.BaseHTTPRequestHandler):
    
    def do_GET(self):
        print(self.path)
        
        if(self.path == "/users"):
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            # Send the html message
            self.wfile.write(str.encode("<h1>Hello World !</h1>"))

        return 1
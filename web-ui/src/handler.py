import sys 
import http.server
import urllib.parse

print(sys.version)


class TweetHandler(http.server.BaseHTTPRequestHandler):
    
    def do_GET(self):
        #parsed_path = urllib.parse.urlparse(self.path)
        return

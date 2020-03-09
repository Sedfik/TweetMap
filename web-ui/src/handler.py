import sys 
import os
import http.server
import urllib.parse
import pathparser as pp

class TweetHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self):
       
        # On charge index.html par defaut
        if(self.path == "/"):
            self.path = "/index.html"
        
        # Si la ressource demandee est bien accessible
        if(self.path[1:] in os.listdir("../resources")):
            
            # On essaye d'ouvrir la ressource si c'est un fichier 
            try:
                #On lit le fichier
                file_to_open = open(self.path[1:]).read()
                self.send_response(200)
            
            except:  # Sinon not found 404
                file_to_open = "File not found"
                self.send_response(404)
            
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))
            print(self.requestline)
    
        # On recupere le Path recu
        received_path = pp.Path(self.path)
        if (received_path.parameters != None):
            pass




        return 1
    """
    def do_GET(self):
        print(self.path)
        if(self.path == "/"):
            self.path = "/index.html"
            try:
                #Reading the file
                file_to_open = open(self.path[1:]).read()
                self.send_response(200)
            except:
                file_to_open = "File not found"
                self.send_response(404)
            
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))
       
        if(self.path == "/users"):
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            # Send the html message
            self.wfile.write(str.encode("<h1>Hello World !</h1>"))
        
        return 1
    """
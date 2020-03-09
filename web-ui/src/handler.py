import sys 
import os
import http.server
import urllib.parse
import pathparser as pp
import tweetsprocess as tp

class TweetHandler(http.server.SimpleHTTPRequestHandler):
    
    def do_GET(self):
        
        received_path = pp.Path(self.path)
        print(received_path.resource)
        
        # Si on veut recuperer la ressource "tweets"
        if(received_path.resource == "tweets"):
            print("-- get tweets -- ")
            # On recupere les potientiels parametres
            

            if (received_path.parameters == None): # Si aucun parametres
                tweet_filtered = tp.get_tweets() # On retourne le tout
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(tweet_filtered, 'utf-8'))

            else: 
                tweet_filtered = tp.filter(received_path.parameters)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(tweet_filtered, 'utf-8'))
            
        
        # Si la ressource demandee est une page et est bien accessible
        if(received_path.resource in os.listdir("../resources")+[""]):
            print("-- open file --")
            file_name = received_path.resource

            if(file_name == ""):
                file_name = "index.html"
            # On essaye d'ouvrir la ressource si c'est un fichier 
            try:
                #On lit le fichier
                file_to_open = open(file_name).read()
                self.send_response(200)
            
            except:  # Sinon not found 404
                file_to_open = "File not found"
                self.send_response(404)
            
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))
            print(self.requestline)

        
        return 1

import sys 
import os
import http.server
from urllib.parse import urlparse, parse_qs
import logging as log

import config # Configuration projet
import tweetsprocess as tp

TWEET_FILE_TO_SERVE = os.path.join(config.ROOT_DIR,"web-ui/resources/tweets.csv")

class TweetHandler(http.server.SimpleHTTPRequestHandler):
    
    # Reception d'un GET
    def do_GET(self):

        log.debug("Tweet file:"+str(TWEET_FILE_TO_SERVE))
        
        parsed_url = urlparse(self.path)
        # Recuperation du path et gestion d'une mauvais requete
        try:
            #path = pp.Path(self.path)
            path = parsed_url.path
            log.debug("path:" + path)
        except:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(bytes("Bad Request", 'utf-8'))

        #log.debug("queried resource:" + path.resource)

        # Si on veut recuperer la ressource "tweets"
        if(path == "/tweets"):
            log.info("get tweets")
            
            file_dataframe = tp.get_file_dataframe(TWEET_FILE_TO_SERVE)
            
            if (parsed_url.query == ''): # Si aucun parametres
                tweet_filtered = tp.get_tweets(file_dataframe) # On retourne le tout
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(tweet_filtered, 'utf-8'))

            else: # Il y a des parametres
                print("query params",parse_qs(parsed_url.query))
                tweet_filtered = tp.get_tweets_query(file_dataframe, parse_qs(parsed_url.query))

                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(tweet_filtered, 'utf-8'))
            

        # Ressource est un fichier ? : /index.html => index.html 
        file_name = path[1:] # On retire le slash

        # Si la ressource demandee est une page et est bien accessible
        if(file_name in os.listdir(".")+["","/"]):
            print("-- open file --")
            
            print("ressource =", file_name)
            if(file_name == "" or file_name == "/"):
                file_name = "index.html"
            # On essaye d'ouvrir la ressource si c'est un fichier 
            
            try:
                #On lit le fichier
                print("try to open",file_name)
                file_to_open = open(file_name).read()
                self.send_response(200)
            
            except:  # Sinon not found 404
                file_to_open = "File not found"
                self.send_response(404)
            
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))
            print(self.requestline)

        return 1

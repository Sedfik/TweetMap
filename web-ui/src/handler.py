import sys 
import os
import http.server
import config
import pathparser as pp
import tweetsprocess as tp

class TweetHandler(http.server.SimpleHTTPRequestHandler):
    
    # Reception d'un GET
    def do_GET(self):
        TWEET_FILE_TO_SERVE = config.ROOT_DIR + "web_ui/resources/tweets.csv"
        file_dataframe = tp.get_file_dataframe(TWEET_FILE_TO_SERVE)
        
        # Recuperation du path et gestion d'une mauvais requete
        try:
            received_path = pp.Path(self.path)
        except:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(bytes("Bad Request", 'utf-8'))

        print(received_path.resource)
        
        # Si on veut recuperer la ressource "tweets"
        if(received_path.resource == "tweets"):
            print("-- get tweets -- ")
            
            if (received_path.parameters == None): # Si aucun parametres
                tweet_filtered = tp.get_tweets(file_dataframe) # On retourne le tout
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(tweet_filtered, 'utf-8'))

            else: # Si il y a des parametres
                tweet_filtered = tp.get_tweets_query(file_dataframe,received_path.parameters)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(bytes(tweet_filtered, 'utf-8'))
            
        
        # Si la ressource demandee est une page et est bien accessible
        if(received_path.resource in os.listdir(".")+["","/"]):
            print("-- open file --")
            file_name = received_path.resource
            
            print("ressource =", file_name)
            print("test:",file_name == "" or "/")
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

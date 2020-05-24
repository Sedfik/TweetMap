import sys 
import os
import http.server
from urllib.parse import urlparse, parse_qs
import logging as log
import threading
import config # Configuration projet
import tweetsprocess as tp

TWEET_FILE_TO_SERVE = os.path.join(config.ROOT_DIR,"web-ui/resources/tweets.csv")

class TweetHandler(http.server.SimpleHTTPRequestHandler):
    
    # Reception d'un GET
    def do_GET(self):
        #cur_thread = threading.current_thread()
        #print(cur_thread.name)

        log.debug("Tweet file:"+str(TWEET_FILE_TO_SERVE))
        
        parsed_url = urlparse(self.path)
        # Recuperation du path et gestion d'une mauvais requete
        try:
            path = parsed_url.path
            log.debug("path:" + path)
        except:
            self.send_error(400,'Bad Request')

        #log.debug("queried resource:" + path.resource)

        # Si on veut recuperer la ressource "tweets"
        if(path == "/tweets"):
            log.info("get tweets")
            
            file_dataframe = tp.get_file_dataframe(TWEET_FILE_TO_SERVE)
            
            if (parsed_url.query == ''): # Si aucun parametres
                tweet_filtered = tp.get_tweets(file_dataframe) # On retourne le tout
                
            else: # Il y a des parametres
                print("query params",parse_qs(parsed_url.query))
                tweet_filtered = tp.get_tweets_query(file_dataframe, parse_qs(parsed_url.query))    
            
            # Le resultat sera du json
            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(bytes(tweet_filtered, 'utf-8'))

        if(path == "/countries"):
            file_dataframe = tp.get_file_dataframe(TWEET_FILE_TO_SERVE)
            try:
                countries = tp.get_column_values(file_dataframe,"place_country_code")
            except Exception as e:
                countries = e
            
            # Le resultat sera du json
            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(bytes(countries, 'utf-8'))
            

        # Ressource est un fichier ? : /index.html => index.html 
        file_name = path[1:] # On retire le slash

        # Si la ressource demandee est une page et est bien accessible
        if(file_name in os.listdir(".")+["","/"]):
            print("MIME type")
            
            if(file_name == ""): # Si on demande /
                file_name = "index.html"
            
    
			#Check the file extension required and
			#set the right mime type

            sendReply = False
            if file_name.endswith(".html"):
                mimetype='text/html'
                sendReply = True
            if file_name.endswith(".jpg"):
                mimetype='image/jpg'
                sendReply = True
            if file_name.endswith(".png"):
                mimetype='image/png'
                sendReply = True
            if file_name.endswith(".gif"):
                mimetype='image/gif'
                sendReply = True
            if file_name.endswith(".js"):
                mimetype='application/javascript'
                sendReply = True
            if file_name.endswith(".css"):
                mimetype='text/css'
                sendReply = True    

            if sendReply:

                print("ressource =", file_name)

                # On essaye d'ouvrir la ressource si c'est un fichier 
                
                try:
                    #On lit le fichier
                    print("try to open",file_name)
                    file_to_open = open(file_name,'rb')
                    self.send_response(200)
                            
                
                except:  # Sinon not found 4
                    self.send_error(404,'File Not Found %s' %file_name)       

                self.send_header('Content-type',mimetype)
                self.end_headers()
                self.wfile.write(file_to_open.read())
                file_to_open.close()
        return 1

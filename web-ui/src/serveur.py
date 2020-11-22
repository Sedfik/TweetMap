import http.server
import socketserver
import os
import handler
PORT = 8800 # Can be changed

class tweetServer(socketserver.TCPServer):

    resources = os.path.join(os.path.dirname(__file__), '../resources')
    os.chdir(resources)

    def __init__(self,server_adress,handler):

    	with socketserver.TCPServer(server_adress, handler) as httpd:
		    print("serving at port", PORT)
		    try:
		        httpd.serve_forever()
		    except KeyboardInterrupt:
		    	httpd.server_close()




if __name__ == '__main__':
	Handler = handler.TweetHandler
	server = tweetServer(("",PORT),Handler)


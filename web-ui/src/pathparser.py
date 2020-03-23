"""
Classe representant un Path. Un Path est l'agregation de :
    - D'une ressource 
    - De parametres (facultatif)

l'attribut parametre est == None si aucuns parametres.
Les attributs sont privés
"""
import re
class Path():
    # Path de type : /resource?param1=value1&param2=value2....
    path_regex = re.compile(r"^\/([a-z]|[A-Z]|[0-1])+(\?([a-z]|[A-Z]|[0-1])+\=([a-z]|[A-Z]|[0-1])+(\&([a-z]|[A-Z]|[0-1])+\=([a-z]|[A-Z]|[0-1])+)*)?$")
    
    def __init__(self, path):
        try: # On verifie la bonne formulation de la requete
            re.search(self.path_regex,path)
        except:
            raise Exception("Bad request")

        self.__path = path
        self.__resource = path.split("?")[0][1:]
        try:
            self.__parameters = dict((k,v) for k, v in [tuple(p.split("=")) for p in path.split("?")[1].split("&")])
        except:
            self.__parameters = None

    @property
    def path(self):
        return self.__path

    @property
    def resource(self):
        return self.__resource

    @property
    def parameters(self):
        return self.__parameters

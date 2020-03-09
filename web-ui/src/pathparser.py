"""
Classe representant un Path. Un Path est l'agregation de :
    - D'une ressource 
    - De parametres (facultatif)

l'attribut parametre est == None si aucuns parametres.
Les attributs sont privés
"""
class Path():

    def __init__(self, path):
        self.__path = path
        self.__resource = path.split("?")[0]
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

# Scenario nominal
path = Path("/index.html?param1=21&param2=4")
assert(path.path == "/index.html?param1=21&param2=4")
assert(path.resource == "/index.html")
assert(path.parameters == dict({'param1': '21', 'param2': '4'}))

# Cas speciaux
assert(Path("/index?a").parameters == None)
assert(Path("/index").parameters == None)
assert(Path("/index?a=").parameters == dict({'a':''}))

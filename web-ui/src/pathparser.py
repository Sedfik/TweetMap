
class Path():

    def __init__(self, path):
        self.__path = path
        self.__resource = path.split("?")[0]
        self.__parameters = dict((k,v) for k, v in [tuple(p.split("=")) for p in path.split("?")[1].split("&")])

    @property
    def path(self):
        return self.__path

    @property
    def resource(self):
        return self.__resource

    @property
    def parameters(self):
        return self.__parameters

path = Path("/index.html?param1=21&param2=4")
assert(path.path == "/index.html?param1=21&param2=4")
assert(path.resource == "/index.html")
assert(path.parameters == dict({'param1': '21', 'param2': '4'}))

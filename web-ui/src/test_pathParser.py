import unittest
import sys 
import os
import pathparser as pp

# Fichier de test que lance Travis

class TestPath(unittest.TestCase):
    
    def test_valid_query(self):
        path = pp.Path("/index.html?param1=21&param2=4")
      
        self.assertEqual(path.path, "/index.html?param1=21&param2=4")
        self.assertEqual(path.resource, "index.html")
        self.assertEqual(path.parameters, dict({'param1': '21', 'param2': '4'}))
        
        # Cas speciaux
        self.assertEqual(pp.Path("/index?a").parameters, None)
        self.assertEqual(pp.Path("/index").parameters, None)
        
        self.assertRaises(Exception,pp.Path("/index?a="))
        # TODO Accepte ?? -> assert(Path("/index?a=").parameters == dict({'a':''}))
    
    
if __name__ == "__main__":
    unittest.main()
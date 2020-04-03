import unittest 
import tweetsprocess as tp
import config
import json

# TODO Finir la class de test

class TestProcess(unittest.TestCase):
    TEST_DATAFRAME = config.ROOT_DIR + "/web-ui/test/test_tweets.csv"

    def test_get_file_dataframe(self):
        self.assertRaises(FileNotFoundError,tp.get_file_dataframe("badpath/file"))
        
        try:
            tp.get_file_dataframe(self.TEST_DATAFRAME)
        except:
            self.fail(str("get_file_dataframe(",self.TEST_DATAFRAME,") raised an Exception"))
    
    def test_get_tweets_query(self):
        # Test filter 
        # attempted value
        test_value = str(r'[{"id":"9","user_id":"2009","user_name":"Hasitha Pallemulla","user_screen_name":"HusseyLive","user_followers_count":444,"text":"Welcome 2k19. Hope you will be a good year. \nTest chatetchiendog\n#teamfareast #jetwingtravels #totalholidayoptions #totalholidayoptionssrilanka #2k19 #firstdayoftheyear\u2026 https:\/\/t.co\/4cgdNiwLR4","place_name":"Sri Lanka","place_country":"Sri Lanka","place_country_code":"LK","longitude":79.85043893,"latitude":6.91965968,"lang":"en","date":"2019-01-01T07:32:52+00:00","timestamp":1546327972666.0,"hashtag_0":"teamfareast","hashtag_1":"jetwingtravels","hashtag_2":"totalholidayoptions"},{"id":10,"user_id":2010,"user_name":"jatno","user_screen_name":"jat_ess","user_followers_count":148,"text":"Tweet contenant le mot chien ou dog","place_name":"Cimanggis, Indonesia","place_country":"Indonesia","place_country_code":"ID","longitude":106.92343701,"latitude":-6.35806877,"lang":"in","date":"2019-01-01T07:33:11+00:00","timestamp":1546327991666.0,"hashtag_0":null,"hashtag_1":null,"hashtag_2":null},{"id":12,"user_id":2012,"user_name":"Fuadi","user_screen_name":"FuadZone","user_followers_count":426,"text":"Hong Kong\nTest cat\n#amazing #life #fitness #bestoftheday #vscocam #sun #beauty #beach #followforfollow #swag #music #sky #travel #f4f #pretty #lfl #dog #vsco #sunset #photo #hair #tflers\u2026 https:\/\/t.co\/Di5vHVizYk","place_name":"\u4e2d\u897f\u5340, \u9999\u6e2f","place_country":"\u9999\u6e2f","place_country_code":"HK","longitude":114.158,"latitude":22.2826,"lang":"tl","date":"2019-01-01T07:33:59+00:00","timestamp":1546328039659.0,"hashtag_0":"amazing","hashtag_1":"life","hashtag_2":"fitness"},{"id":13,"user_id":2013,"user_name":"cengiz","user_screen_name":"cmy0707","user_followers_count":433,"text":"Yeni y\u0131l\u0131n\u0131z baldan tatl\u0131\ud83c\udf6f,\nTest dog","place_name":null,"place_country":null,"place_country_code":null,"longitude":null,"latitude":null,"lang":null,"date":null,"timestamp":null,"hashtag_0":null,"hashtag_1":null,"hashtag_2":null}]')
        print(test_value)
        # Returned value
        #returned_value = str(tp.get_tweets_query(tp.get_file_dataframe(self.TEST_DATAFRAME), dict({'text': ['dog']} )))
        #print(r'returned_value))
        #self.assertEqual(r'returned_value', test_value)

if __name__ == "__main__":
    unittest.main()
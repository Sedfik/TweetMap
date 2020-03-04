import pandas as pd
#import config

def getUsers():
    tweets = pd.read_csv("../resources/tweets.csv")
    return tweets[['user_id','user_name','user_screen_name','user_followers_count']]

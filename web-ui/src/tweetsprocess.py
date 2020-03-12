import pandas as pd
import os
#import config

def get_tweets():
    print(os.path)
    tweets = pd.read_csv("web-ui/resources/tweets.csv")
    return str(tweets)

def filter(parameters):
    print(os.path)
    tweets = pd.read_csv("web-ui/resources/tweets.csv")
    filtered = tweets
    #for (name, param) in parameters:
    filtered = filtered[(filtered['user_id']=='159054323')]
    
    return str(filtered)


"""
[['user_id','user_name','user_screen_name','user_followers_count']]
"""
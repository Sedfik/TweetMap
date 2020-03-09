import pandas as pd
#import config

def get_tweets():
    tweets = pd.read_csv("../resources/tweets.csv")
    return str(tweets)

def filter(parameters):
    tweets = pd.read_csv("../resources/tweets.csv")
    filtered = tweets
    #for (name, param) in parameters:
    filtered = filtered[(filtered['user_id']=='159054323')]
    
    return str(filtered)

print(filter(''))
"""
[['user_id','user_name','user_screen_name','user_followers_count']]
"""
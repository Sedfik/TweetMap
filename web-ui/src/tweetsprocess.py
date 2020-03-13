import pandas as pd
import re
import os
#import config

def get_tweets():
    os.chdir(os.path.join(os.path.dirname(__file__), '../..'))
    tweets = pd.read_csv("web-ui/resources/tweets.csv")
    return str(tweets)

# Retourne la liste des tweets suivants les parametres
def get_tweets_query(parameters):
    os.chdir(os.path.join(os.path.dirname(__file__), '../..'))
    tweets = pd.read_csv("web-ui/resources/tweets.csv")
    
    for p in parameters:
        tweets = filter(tweets,(p,parameters[p]))

    return str(tweets)


# Retourne le data_frame des lignes qui match avec le parametre.
def filter(data_frame, parameter):
    finded = []
    
    for t in data_frame[str(parameter[0])]:
    
        if(re.search(str(parameter[1]),str(t))):
            finded.append(True)
        else:
            finded.append(False)
    
    return data_frame[finded]

"""
[['user_id','user_name','user_screen_name','user_followers_count']]
"""
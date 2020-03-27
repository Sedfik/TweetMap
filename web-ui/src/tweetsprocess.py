import pandas as pd
import re
import os
import config

# Lire le fichier donne en tant que dataframe depuis le chemin absolu du projet
def get_file_dataframe(path):
    try:
        return pd.read_csv(path)
    except FileNotFoundError as exception:
        print(exception) 

def get_tweets(data_frame):
    if data_frame == None:
        raise ValueError("Empty data frame")
    else: 
        return data_frame.to_json
    

# Retourne la liste des tweets suivants les parametres
def get_tweets_query(data_frame,parameters):
    for p in parameters:
        data_frame = filter(data_frame,(p,parameters[p]))
    return str(data_frame.to_json(orient="records"))


# Retourne le data_frame des lignes qui match avec le parametre.
def filter(data_frame, parameter):
    finded = []
    
    for t in data_frame[str(parameter[0])]:
    
        if(re.search(str(parameter[1]),str(t))):
            finded.append(True)
        else:
            finded.append(False)
    
    return data_frame[finded]




def new_filter(data_frame, parameter):
    #patern = re.compile("dog")
    return data_frame[data_frame["text"].str.contains(r"dog")]["text"]
    #return data_frame[ (patern.search(data_frame["text"]) ) ]
    #data_frame["text"].apply(lambda x: patern.search(x),1)
    #filter(lambda x: True if x == "null")
    #return data_frame[ data_frame [ re.search( str(parameter[1]), str(parameter[0])) ] ]

def new_get_tweets_query(data_frame,parameters):
    for p in parameters:
        data_frame = new_filter(data_frame,(p,parameters[p]))
    return str(data_frame.to_json())


"""

[['user_id','user_name','user_screen_name','user_followers_count']]
"""
if __name__ == "__main__":
    #print(get_tweets(get_file_dataframe("web-ui/resources/twets.csv")))
    print(new_filter(get_file_dataframe(config.ROOT_DIR + "web-ui/resources/tweets.csv"),""))
    #print(new_get_tweets_query(get_file_dataframe("web-ui/resources/tweets.csv"), dict({'text': 'dog'} )))
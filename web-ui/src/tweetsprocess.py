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
    

"""
# Retourne la liste des tweets suivants les parametres
# parametre : data_frame -> le jeu de donnees sur lequel appliquer les filtres 
# parametre : parameters -> la liste des parametres sous forme: {'params1': ['value1'],'params1': ['value1']}

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

"""


def filter(data_frame, parameter, value):
    patern = re.compile(value)
    return data_frame[data_frame[parameter].str.contains(patern)]
    #return data_frame[ (patern.search(data_frame["text"]) ) ]
    #data_frame["text"].apply(lambda x: patern.search(x),1)
    #filter(lambda x: True if x == "null")
    #return data_frame[ data_frame [ re.search( str(parameter[1]), str(parameter[0])) ] ]

def get_tweets_query(data_frame,parameters):
    for p in parameters:
        for px in parameters[p]:
            data_frame = filter(data_frame,p,px)
    return str(data_frame.to_json(orient="records"))


"""

[['user_id','user_name','user_screen_name','user_followers_count']]
"""
if __name__ == "__main__":
    #print(get_tweets(get_file_dataframe("web-ui/resources/twets.csv")))
    #print(new_filter(get_file_dataframe(config.ROOT_DIR + "/web-ui/test/test_tweets.csv"),""))
    #print(filter(get_file_dataframe(config.ROOT_DIR + "web-ui/test/test_tweets.csv"),("text","dog")))
    print(get_tweets_query(get_file_dataframe(config.ROOT_DIR + "/web-ui/test/test_tweets.csv"), dict({'text': ['dog']} )))
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
    
# Retroune la liste des colonnes presentes dans le dataframe
def get_valid_column_name(data_frame):
    return data_frame.columns

"""
Retourne toutes les valeurs d'une colonne en effacant les doublons.
Trie les valeurs et les retourne
"""
def get_column_values(data_frame, column):
    if(column in get_valid_column_name(data_frame)):
        return data_frame[column].drop_duplicates(keep=False).sort_values().to_json(orient="records")
    raise Exception("No such colomn",column,"in the data frame")

"""
# Retourne la liste des tweets suivants les parametres
# parametre : data_frame -> le jeu de donnees sur lequel appliquer les filtres 
# parametre : parameters -> la liste des parametres sous forme: {'params1': ['value1'],'params1': ['value1']}

"""
def filter(data_frame, parameter, value):
    patern = re.compile(value)
    return data_frame[data_frame[parameter].str.contains(patern)]

def get_tweets_query(data_frame,parameters):
    for p in parameters:
        for px in parameters[p]:
            data_frame = filter(data_frame,p,px)
    return str(data_frame.to_json(orient="records"))


"""
[['user_id','user_name','user_screen_name','user_followers_count']]
"""
if __name__ == "__main__":
    print(get_tweets_query(get_file_dataframe(config.ROOT_DIR + "/web-ui/test/test_tweets.csv"), dict({'text': ['dog']} )))
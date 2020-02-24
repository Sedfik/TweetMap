import csv
import json

def generate_json_from_csv(file):
    # La premiere ligne contient les noms des attributs
    csv_file = open(file,'rU')
    jsonfile = open('../resources/tweets.json', 'w')

    reader = csv.DictReader(csv_file, fieldnames = ( "id", "user_id", "user_name", "user_screen_name", "user_followers_count", "text", "place_name", "place_country", "place_country_code", "longitude", "latitude", "lang", "date", "timestamp", "hashtag_0", "hashtag_1", "hashtag_2"))  
    out = json.dumps( [ row for row in reader ] )  
    jsonfile.write(out)
    
generate_json_from_csv('../resources/tweets.csv')
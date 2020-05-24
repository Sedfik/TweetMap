import requests
from concurrent.futures import ThreadPoolExecutor as PoolExecutor
import time



links = ['http://localhost:8800/tweets?text=dog']*100

start_time = time.time()
with PoolExecutor(max_workers=20) as executor:
    for _ in executor.map(requests.get,links):
        pass

print("--- requests finished in  %s seconds ---" % (time.time() - start_time))
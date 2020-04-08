import requests
from concurrent.futures import ThreadPoolExecutor as PoolExecutor


links = ['http://localhost:8800/tweets?text=']*500


with PoolExecutor(max_workers=20) as executor:
    for _ in executor.map(requests.get,links):
        pass
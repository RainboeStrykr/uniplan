import urllib.request
import json
import traceback

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/solve', 
    data=json.dumps(["mrv", "mcv", "lcv"]).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
try:
    with urllib.request.urlopen(req) as res:
        print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("STATUS", e.code)
    print("RESPONSE", e.read().decode('utf-8'))
except Exception as e:
    traceback.print_exc()

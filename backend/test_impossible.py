import json
import urllib.request

def solve():
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/solve', 
        data=json.dumps(["mrv", "mcv", "lcv"]).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("Solve status:", data.get("status"))

solve()

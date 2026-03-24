import urllib.request
import json

req = urllib.request.Request("http://127.0.0.1:8000/api/timetable/")
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))
    print(json.dumps(data, indent=2))

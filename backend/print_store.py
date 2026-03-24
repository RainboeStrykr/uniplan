from api.store import STATE
import json

print("COURSES:")
for k,v in STATE["courses"].items():
    print(k, v)

print("PROFESSORS:")
for k,v in STATE["professors"].items():
    print(k, v)

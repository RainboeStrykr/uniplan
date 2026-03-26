import urllib.request
import json
import traceback

def post_csv(rtype, filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/resources/upload', 
        data=json.dumps({"resource_type": rtype, "csv_content": content}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        print(f"Uploaded {rtype}:", res.read().decode('utf-8'))

def solve():
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/solve', 
        data=json.dumps(["mrv", "mcv", "lcv"]).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        print("Solve status:", res.read().decode('utf-8'))

def get_timetable():
    req = urllib.request.Request('http://127.0.0.1:8000/api/timetable/')
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("Timetable items:", len(data.get("timetable", [])))
        for i in data.get("timetable", []):
            print(" -", i["course"]["name"], i["professor"]["name"], i["room"]["name"])

try:
    post_csv("courses", "demo_courses.csv")
    post_csv("professors", "demo_professors.csv")
    post_csv("rooms", "demo_rooms.csv")
    post_csv("student_groups", "demo_student_groups.csv")
    post_csv("time_slots", "demo_time_slots.csv")
    solve()
    get_timetable()
except Exception as e:
    traceback.print_exc()

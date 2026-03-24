import urllib.request
import json
from engine.constraints import HARD_CONSTRAINTS
from engine.solver import TimetableSolver
from engine.csp import CSPEngine
from models.resources import CourseSession, Course, Professor, Room, TimeSlot, StudentGroup

def post_csv(rtype, filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/resources/upload', 
        data=json.dumps({"resource_type": rtype, "csv_content": content}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as res:
        print(f"Uploaded {rtype}:", res.status)

post_csv("courses", "demo_courses.csv")
post_csv("professors", "demo_professors.csv")
post_csv("rooms", "demo_rooms.csv")

req = urllib.request.Request("http://127.0.0.1:8000/api/resources/resources")
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))

courses = {c["id"]: c for c in data["courses"]}
professors = {p["id"]: p for p in data["professors"]}
rooms = {r["id"]: r for r in data["rooms"]}
time_slots = {t["id"]: t for t in data["time_slots"]}
student_groups = {g["id"]: g for g in data["student_groups"]}

sessions = {}
for c_id, course_data in courses.items():
    s_id = f"{c_id}_s1"
    cs = CourseSession(id=s_id, course_id=c_id, session_index=1)
    sessions[s_id] = cs

domains = {}
domain_values = [f"{ts_id}::{r_id}" for ts_id in time_slots.keys() for r_id in rooms.keys()]
for s_id in sessions.keys():
    domains[s_id] = list(domain_values)

csp = CSPEngine(list(sessions.values()), domains)
for hc in HARD_CONSTRAINTS:
    csp.add_constraint(hc)

context = {
    "sessions": sessions,
    "courses": {k: Course(**v) for k, v in courses.items()},
    "professors": {k: Professor(**v) for k, v in professors.items()},
    "rooms": {k: Room(**v) for k, v in rooms.items()},
    "student_groups": {k: StudentGroup(**v) for k, v in student_groups.items()},
    "time_slots": {k: TimeSlot(**v) for k, v in time_slots.items()},
}

solver = TimetableSolver(csp, context)

original_backtrack = solver.backtrack
def traced_backtrack(assignment):
    res = original_backtrack(assignment)
    if not res:
        pass
    return res
solver.backtrack = traced_backtrack

# Check initial domains
print("VAR INITIAL DOMAIN SIZES:")
for var, d in csp.domains.items():
    valid = [v for v in d if csp.is_consistent(var, v, {}, context)]
    print(var, len(valid), "valid options:", valid)

sol, met, steps = solver.solve(["mrv", "mcv", "lcv"])
if sol:
    print("SUCCESS")
else:
    print("FAILED")

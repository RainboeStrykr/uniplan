from api.store import STATE
from engine.csp import CSPEngine
from engine.solver import TimetableSolver
from engine.constraints import HARD_CONSTRAINTS
from models.resources import CourseSession, Course, Professor, Room, TimeSlot, StudentGroup

courses = STATE["courses"]
professors = STATE["professors"]
rooms = STATE["rooms"]
time_slots = STATE["time_slots"]
student_groups = STATE["student_groups"]

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

# Manually test the "perfect" solution
assignment = {
    "PHY101_s1": "T1::R3",
    "CS201_s1": "T1::R1",
    "CS101_s1": "T2::R4",
    "BIO204_s1": "T2::R2"
}
valid = True
for var, val in assignment.items():
    for hc in HARD_CONSTRAINTS:
        if not hc(var, val, assignment, context):
            print(f"FAILED CONSTRAINT: {hc.__name__} for {var} = {val}")
            valid = False

if valid:
    print("Manual assignment is VALID!")
else:
    print("Manual assignment FAILED!")

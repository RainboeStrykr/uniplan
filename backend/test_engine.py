import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from engine.csp import CSPEngine
from engine.solver import TimetableSolver
from engine.constraints import HARD_CONSTRAINTS
from models.resources import CourseSession, Course, Professor, Room, TimeSlot, StudentGroup

def test_solver():
    courses = {
        "c1": Course(id="c1", name="Math", duration=1, type="Lecture", professor_id="p1", student_group_ids=["g1"]),
        "c2": Course(id="c2", name="Physics", duration=1, type="Lecture", professor_id="p2", student_group_ids=["g1"])
    }
    professors = {
        "p1": Professor(id="p1", name="Dr. Smith"),
        "p2": Professor(id="p2", name="Dr. Jones")
    }
    rooms = {
        "r1": Room(id="r1", name="101", capacity=30, type="Lecture Hall")
    }
    time_slots = {
        "t1": TimeSlot(id="t1", day="Monday", start_time="09:00", end_time="10:00"),
        "t2": TimeSlot(id="t2", day="Monday", start_time="10:00", end_time="11:00")
    }
    student_groups = {
        "g1": StudentGroup(id="g1", name="Group A", size=20, course_ids=["c1", "c2"])
    }
    
    sessions = {
        "c1_s1": CourseSession(id="c1_s1", course_id="c1", session_index=1),
        "c2_s1": CourseSession(id="c2_s1", course_id="c2", session_index=1)
    }
    
    domains = {
        "c1_s1": ["t1::r1", "t2::r1"],
        "c2_s1": ["t1::r1", "t2::r1"]
    }
    
    csp = CSPEngine(list(sessions.values()), domains)
    for hc in HARD_CONSTRAINTS:
        csp.add_constraint(hc)
        
    context = {
        "sessions": sessions,
        "courses": courses,
        "professors": professors,
        "rooms": rooms,
        "student_groups": student_groups,
        "time_slots": time_slots,
    }
    
    solver = TimetableSolver(csp, context)
    sol, metrics, steps = solver.solve(["mrv", "mcv", "lcv"])
    
    print("Solution found:", sol is not None)
    if sol:
        print("Assignment:", sol)
    print("Nodes expanded:", metrics.nodes_expanded)
    print("Steps visualization count:", len(steps))

if __name__ == "__main__":
    test_solver()

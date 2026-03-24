from typing import Dict, List, Any
from models.resources import CourseSession

class CSPEngine:
    def __init__(self, course_sessions: List[CourseSession], domains: Dict[str, List[str]]):
        self.variables = [session.id for session in course_sessions]
        self.domains = domains # var_id -> list of value_ids (e.g. "timeslot_id::room_id")
        self.constraints = []
        self.initial_domains = {v: list(d) for v, d in domains.items()}

    def add_constraint(self, constraint_func):
        self.constraints.append(constraint_func)

    def is_consistent(self, variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
        """Check if assigning value to variable is consistent with current assignment"""
        # Create a temporary assignment to check
        temp_assignment = assignment.copy()
        temp_assignment[variable] = value
        
        for constraint in self.constraints:
            if not constraint(variable, value, temp_assignment, context):
                return False
        return True

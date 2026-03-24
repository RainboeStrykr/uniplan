import time
import copy
from typing import Dict, List, Any, Optional, Tuple
from .csp import CSPEngine
from models.responses import TimetableState, PerformanceMetrics

class TimetableSolver:
    def __init__(self, csp: CSPEngine, context: Dict[str, Any]):
        self.csp = csp
        self.context = context
        self.steps: List[TimetableState] = []
        self.nodes_expanded = 0
        self.backtrack_count = 0
        self.start_time = 0.0
        self.heuristics = []

    def solve(self, heuristics: List[str] = ["mrv", "mcv", "lcv"]) -> Tuple[Optional[Dict[str, str]], PerformanceMetrics, List[TimetableState]]:
        self.steps = []
        self.nodes_expanded = 0
        self.backtrack_count = 0
        self.heuristics = heuristics
        self.start_time = time.time()
        
        # Reset domains to initial state
        self.csp.domains = copy.deepcopy(self.csp.initial_domains)
        
        assignment = {}
        result = self.backtrack(assignment)
        
        time_taken = (time.time() - self.start_time) * 1000 # in ms
        
        metrics = PerformanceMetrics(
            nodes_expanded=self.nodes_expanded,
            time_taken_ms=time_taken,
            backtrack_count=self.backtrack_count,
            heuristic_used=",".join(heuristics)
        )
        
        # Add final complete state
        if result:
            self.record_state(None, None, "complete", result, is_complete=True)
        else:
            self.record_state(None, None, "failed", assignment, is_complete=True)
            
        return result, metrics, self.steps

    def record_state(self, variable: Optional[str], value: Optional[str], action: str, assignment: Dict[str, str], is_complete: bool = False):
        state = TimetableState(
            step=len(self.steps) + 1,
            current_variable=variable,
            assigned_value=value,
            action=action,
            is_complete=is_complete,
            assignment=assignment.copy(),
            conflict_set={k: list(v) for k, v in self.csp.domains.items() if k not in assignment} # Show remaining domains for unassigned
        )
        self.steps.append(state)

    def backtrack(self, assignment: Dict[str, str]) -> Optional[Dict[str, str]]:
        if len(assignment) == len(self.csp.variables):
            return assignment

        self.nodes_expanded += 1
        var = self.select_unassigned_variable(assignment)
        
        for value in self.order_domain_values(var, assignment):
            if self.csp.is_consistent(var, value, assignment, self.context):
                assignment[var] = value
                self.record_state(var, value, "assign", assignment)
                
                # Forward Checking
                inferences = self.forward_check(var, value, assignment)
                if inferences is not False: # Forward check didn't immediately fail
                    result = self.backtrack(assignment)
                    if result is not None:
                        return result
                    
                    # Undo inferences (restore domains)
                    for inf_var, inf_vals in inferences.items():
                        self.csp.domains[inf_var].extend(inf_vals)
                
                # Backtrack
                del assignment[var]
                self.backtrack_count += 1
                self.record_state(var, value, "backtrack", assignment)
                
        return None

    def forward_check(self, assigned_var: str, assigned_value: str, assignment: Dict[str, str]):
        """Remove values from unassigned variables' domains that conflict with the new assignment.
           Returns a dict of removed values to restore them later on backtrack, or False if a domain becomes empty."""
        inferences = {}
        for unassigned_var in self.csp.variables:
            if unassigned_var not in assignment:
                removed_values = []
                for val in list(self.csp.domains[unassigned_var]):
                    # Check consistency. If assigning this val to unassigned_var conflicts with current assignment
                    # (which now includes assigned_var = assigned_value), then we remove it.
                    if not self.csp.is_consistent(unassigned_var, val, assignment, self.context):
                        self.csp.domains[unassigned_var].remove(val)
                        removed_values.append(val)
                
                if removed_values:
                    inferences[unassigned_var] = removed_values
                
                if len(self.csp.domains[unassigned_var]) == 0:
                    # Domain wipeout. Restore what we just removed and return False immediately
                    for k, v in inferences.items():
                        self.csp.domains[k].extend(v)
                    return False
                    
        if inferences:
            self.record_state(assigned_var, assigned_value, "forward_check_prune", assignment)
            
        return inferences

    def select_unassigned_variable(self, assignment: Dict[str, str]) -> str:
        unassigned = [v for v in self.csp.variables if v not in assignment]
        
        if "mrv" in self.heuristics:
            # Minimum Remaining Values
            mrv_vars = []
            min_len = float('inf')
            for v in unassigned:
                d_len = len(self.csp.domains[v])
                if d_len < min_len:
                    min_len = d_len
                    mrv_vars = [v]
                elif d_len == min_len:
                    mrv_vars.append(v)
            
            if len(mrv_vars) == 1 or "mcv" not in self.heuristics:
                return mrv_vars[0]
            
            unassigned = mrv_vars # Tie-breaker with MCV
            
        if "mcv" in self.heuristics:
            # Most Constraining Variable (Degree heuristic)
            # We estimate degree by counting how many other unassigned variables exist (in full CSP, it might be structural graph)
            # In our case, constraints are global, so every unassigned variable constraints every other unassigned variable.
            # To simulate degree heuristic meaningfully, we could count how many student groups/professors it shares.
            # For simplicity, if degree is uniformly dense, we just pick the first.
            max_degree = -1
            mcv_var = unassigned[0]
            for v in unassigned:
                degree = self.calculate_degree(v, unassigned)
                if degree > max_degree:
                    max_degree = degree
                    mcv_var = v
            return mcv_var

        return unassigned[0]

    def calculate_degree(self, var: str, unassigned: List[str]) -> int:
        """Calculate how many other unassigned variables share professors or student groups."""
        degree = 0
        sessions = self.context["sessions"]
        courses = self.context["courses"]
        
        my_session = sessions[var]
        my_course = courses[my_session.course_id]
        my_prof = my_course.professor_id
        my_groups = set(my_course.student_group_ids)
        
        for other_var in unassigned:
            if other_var != var:
                other_session = sessions[other_var]
                other_course = courses[other_session.course_id]
                if other_course.professor_id == my_prof or my_groups.intersection(set(other_course.student_group_ids)):
                    degree += 1
        return degree

    def order_domain_values(self, var: str, assignment: Dict[str, str]) -> List[str]:
        values = list(self.csp.domains[var])
        if "lcv" in self.heuristics:
            # Least Constraining Value
            # Count how many choices are eliminated for all unassigned variables
            def count_conflicts(val):
                conflicts = 0
                temp_assignment = assignment.copy()
                temp_assignment[var] = val
                for unassigned_var in self.csp.variables:
                    if unassigned_var not in temp_assignment:
                        for other_val in self.csp.domains[unassigned_var]:
                            if not self.csp.is_consistent(unassigned_var, other_val, temp_assignment, self.context):
                                conflicts += 1
                return conflicts
            
            values.sort(key=count_conflicts)
            
        return values

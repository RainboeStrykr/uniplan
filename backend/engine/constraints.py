from typing import Dict, Any

def get_slot_and_room(value: str):
    parts = value.split("::")
    return parts[0], parts[1]

def constraint_lecturer_overlap(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """A professor cannot be scheduled in two rooms at the same time."""
    time_slot_id, _ = get_slot_and_room(value)
    
    sessions = context["sessions"] # dict: session_id -> CourseSession
    courses = context["courses"] # dict: course_id -> Course
    
    current_session = sessions[variable]
    current_course = courses[current_session.course_id]
    prof_id = current_course.professor_id
    
    # Check against all assigned sessions
    for assigned_var, assigned_val in assignment.items():
        if assigned_var == variable:
            continue
        assigned_slot_id, _ = get_slot_and_room(assigned_val)
        
        if assigned_slot_id == time_slot_id:
            other_session = sessions[assigned_var]
            other_course = courses[other_session.course_id]
            if other_course.professor_id == prof_id:
                return False # Overlap!
    return True

def constraint_room_overlap(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """A room cannot host two classes at the same time."""
    time_slot_id, room_id = get_slot_and_room(value)
    
    for assigned_var, assigned_val in assignment.items():
        if assigned_var == variable:
            continue
        assigned_slot_id, assigned_room_id = get_slot_and_room(assigned_val)
        
        if assigned_slot_id == time_slot_id and assigned_room_id == room_id:
            return False # Overlap!
    return True

def constraint_student_group_overlap(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """A student group cannot attend two classes at the same time."""
    time_slot_id, _ = get_slot_and_room(value)
    
    sessions = context["sessions"]
    courses = context["courses"]
    
    current_session = sessions[variable]
    current_course = courses[current_session.course_id]
    current_groups = set(current_course.student_group_ids)
    
    for assigned_var, assigned_val in assignment.items():
        if assigned_var == variable:
            continue
        assigned_slot_id, _ = get_slot_and_room(assigned_val)
        
        if assigned_slot_id == time_slot_id:
            other_session = sessions[assigned_var]
            other_course = courses[other_session.course_id]
            other_groups = set(other_course.student_group_ids)
            
            # If there is any intersection in student groups
            if current_groups.intersection(other_groups):
                return False # Overlap!
    return True

def constraint_room_capacity(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """The room must have enough capacity for all student groups attending."""
    _, room_id = get_slot_and_room(value)
    
    sessions = context["sessions"]
    courses = context["courses"]
    rooms = context["rooms"] # dict: room_id -> Room
    student_groups = context["student_groups"] # dict: group_id -> StudentGroup
    
    current_session = sessions[variable]
    current_course = courses[current_session.course_id]
    
    total_students = sum(student_groups[g_id].size for g_id in current_course.student_group_ids if g_id in student_groups)
    
    # If room is somehow missing, fail safe by allowing it if capacity not checked
    if room_id not in rooms:
        return True
        
    room_capacity = rooms[room_id].capacity
    
    return total_students <= room_capacity

def constraint_professor_availability(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """The professor must be available during the time slot."""
    time_slot_id, _ = get_slot_and_room(value)
    
    sessions = context["sessions"]
    courses = context["courses"]
    professors = context["professors"] # dict: prof_id -> Professor
    
    current_session = sessions[variable]
    current_course = courses[current_session.course_id]
    prof_id = current_course.professor_id
    
    if prof_id in professors:
        unavail = professors[prof_id].unavailable_slots
        if time_slot_id in unavail:
            return False
            
    return True

HARD_CONSTRAINTS = [
    constraint_lecturer_overlap,
    constraint_room_overlap,
    constraint_student_group_overlap,
    constraint_room_capacity,
    constraint_professor_availability
]

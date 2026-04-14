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

def constraint_student_group_time_gap(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """Student groups should have at least 1 hour gap between consecutive classes."""
    time_slot_id, _ = get_slot_and_room(value)
    
    sessions = context["sessions"]
    courses = context["courses"]
    time_slots = context["time_slots"]
    
    current_session = sessions[variable]
    current_course = courses[current_session.course_id]
    current_groups = set(current_course.student_group_ids)
    
    # Get current time slot details
    current_slot = time_slots.get(time_slot_id)
    if not current_slot:
        return True
    
    # Parse current time
    current_start = current_slot.start_time
    current_day = current_slot.day
    
    for assigned_var, assigned_val in assignment.items():
        if assigned_var == variable:
            continue
        assigned_slot_id, _ = get_slot_and_room(assigned_val)
        assigned_slot = time_slots.get(assigned_slot_id)
        
        if not assigned_slot:
            continue
            
        # Check if same day and same student groups
        if (assigned_slot.day == current_day and 
            current_groups.intersection(set(courses[sessions[assigned_var].course_id].student_group_ids))):
            
            # Parse times to check gap
            current_hour = int(current_start.split(':')[0])
            assigned_hour = int(assigned_slot.start_time.split(':')[0])
            
            # If classes are consecutive (1 hour apart), reject
            if abs(current_hour - assigned_hour) == 1:
                return False
    
    return True

def constraint_lunch_break(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """No classes should be scheduled during lunch hours (12:00-13:00)."""
    time_slot_id, _ = get_slot_and_room(value)
    
    time_slots = context["time_slots"]
    current_slot = time_slots.get(time_slot_id)
    
    if not current_slot:
        return True
    
    # Check if time slot falls during lunch break
    start_hour = int(current_slot.start_time.split(':')[0])
    end_hour = int(current_slot.end_time.split(':')[0])
    
    # Block 12:00-13:00 slot
    if start_hour >= 12 and end_hour <= 13:
        return False
    
    return True

def constraint_professor_workload_balance(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """Professors should not have more than 3 consecutive classes without a break."""
    time_slot_id, _ = get_slot_and_room(value)
    
    sessions = context["sessions"]
    courses = context["courses"]
    time_slots = context["time_slots"]
    
    current_session = sessions[variable]
    current_course = courses[current_session.course_id]
    prof_id = current_course.professor_id
    
    current_slot = time_slots.get(time_slot_id)
    if not current_slot:
        return True
    
    current_hour = int(current_slot.start_time.split(':')[0])
    current_day = current_slot.day
    
    # Count consecutive classes for this professor
    consecutive_count = 0
    
    # Check surrounding time slots on same day
    for hour_offset in range(-2, 3):  # Check 2 hours before and after
        check_hour = current_hour + hour_offset
        if 8 <= check_hour <= 17:  # Within valid hours
            # Find time slot ID for this hour
            for slot_id, slot in time_slots.items():
                if (slot.day == current_day and 
                    int(slot.start_time.split(':')[0]) == check_hour):
                    
                    # Check if this slot has the same professor
                    for assigned_var, assigned_val in assignment.items():
                        if assigned_var == variable:
                            continue
                        assigned_slot_id, _ = get_slot_and_room(assigned_val)
                        if assigned_slot_id == slot_id:
                            assigned_course = courses[sessions[assigned_var].course_id]
                            if assigned_course.professor_id == prof_id:
                                consecutive_count += 1
                    break
    
    # Allow maximum 3 consecutive classes
    return consecutive_count < 3

def constraint_prefer_time_spread(variable: str, value: str, assignment: Dict[str, str], context: Dict[str, Any]) -> bool:
    """Soft constraint: Prefer spreading classes throughout the day rather than clustering."""
    time_slot_id, _ = get_slot_and_room(value)
    
    sessions = context["sessions"]
    courses = context["courses"]
    time_slots = context["time_slots"]
    
    current_session = sessions[variable]
    current_course = courses[current_session.course_id]
    current_groups = set(current_course.student_group_ids)
    
    current_slot = time_slots.get(time_slot_id)
    if not current_slot:
        return True
    
    current_hour = int(current_slot.start_time.split(':')[0])
    current_day = current_slot.day
    
    # Count how many classes this group already has on this day
    daily_count = 0
    for assigned_var, assigned_val in assignment.items():
        if assigned_var == variable:
            continue
        assigned_slot_id, _ = get_slot_and_room(assigned_val)
        assigned_slot = time_slots.get(assigned_slot_id)
        
        if (assigned_slot and assigned_slot.day == current_day and
            current_groups.intersection(set(courses[sessions[assigned_var].course_id].student_group_ids))):
            daily_count += 1
    
    # Prefer not to exceed 4 classes per day for any group
    return daily_count < 4

HARD_CONSTRAINTS = [
    constraint_lecturer_overlap,
    constraint_room_overlap,
    constraint_student_group_overlap,
    constraint_room_capacity,
    constraint_professor_availability,
    constraint_student_group_time_gap,
    constraint_lunch_break,
    constraint_professor_workload_balance,
    constraint_prefer_time_spread
]

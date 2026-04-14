import requests
import json

def test_realistic_timetable():
    print("Testing Realistic Timetable Constraints")
    print("=" * 50)
    
    # Clear all data first
    requests.delete('http://127.0.0.1:8000/api/resources/resources?resource_type=all')
    print("Cleared all existing data")
    
    # Upload realistic data
    files = [
        ('realistic_courses.csv', 'courses'),
        ('realistic_professors.csv', 'professors'), 
        ('realistic_rooms.csv', 'rooms'),
        ('realistic_time_slots.csv', 'time_slots'),
        ('realistic_student_groups.csv', 'student_groups')
    ]
    
    for filename, resource_type in files:
        try:
            with open(filename, 'r') as f:
                csv_content = f.read()
            response = requests.post('http://127.0.0.1:8000/api/resources/upload', 
                json={'resource_type': resource_type, 'csv_content': csv_content})
            print(f'Uploaded {filename}: {response.json()}')
        except FileNotFoundError:
            print(f'File {filename} not found, skipping...')
    
    # Use existing time slots
    print("Using existing time slots...")
    
    # Solve with new constraints
    print("\nSolving with realistic constraints...")
    solve_response = requests.post('http://127.0.0.1:8000/api/solve', json=['mrv', 'mcv', 'lcv'])
    result = solve_response.json()
    
    if 'error' in result:
        print(f'Error: {result["error"]}')
        return
    
    print(f'Solve status: {result.get("status")}')
    print(f'Nodes expanded: {result.get("nodes_expanded")}')
    print(f'Time taken: {result.get("time_taken_ms", 0):.2f}ms')
    
    # Get timetable
    timetable_response = requests.get('http://127.0.0.1:8000/api/timetable/')
    timetable = timetable_response.json().get('timetable', [])
    
    print(f'\nGenerated timetable with {len(timetable)} classes:')
    
    # Group by day for better visualization
    days = {}
    for item in timetable:
        day = item['time_slot']['day']
        if day not in days:
            days[day] = []
        days[day].append(item)
    
    # Print schedule by day
    for day in ['M', 'T', 'W', 'R', 'F']:
        if day in days:
            print(f'\n{day} Day:')
            # Sort by time
            day_classes = sorted(days[day], key=lambda x: x['time_slot']['start_time'])
            for cls in day_classes:
                course = cls['course']
                time = cls['time_slot']
                prof = cls['professor']
                room = cls['room']
                print(f'  {time["start_time"]}-{time["end_time"]}: {course["id"]} ({course["name"][:30]}...)')
                print(f'    Professor: {prof["name"]}, Room: {room["name"]}')
    
    # Check constraint violations
    print(f'\nConstraint Analysis:')
    
    # Check lunch break violations
    lunch_violations = []
    for item in timetable:
        start_hour = int(item['time_slot']['start_time'].split(':')[0])
        if start_hour >= 12 and start_hour < 13:
            lunch_violations.append(item['course']['id'])
    
    if lunch_violations:
        print(f'  Lunch break violations: {lunch_violations}')
    else:
        print('  No lunch break violations')
    
    # Check consecutive classes for student groups
    consecutive_violations = []
    for day, classes in days.items():
        sorted_classes = sorted(classes, key=lambda x: x['time_slot']['start_time'])
        for i in range(len(sorted_classes) - 1):
            current = sorted_classes[i]
            next_class = sorted_classes[i + 1]
            
            current_groups = set(current['course']['student_group_ids'])
            next_groups = set(next_class['course']['student_group_ids'])
            
            if current_groups.intersection(next_groups):
                current_hour = int(current['time_slot']['start_time'].split(':')[0])
                next_hour = int(next_class['time_slot']['start_time'].split(':')[0])
                
                if next_hour - current_hour == 1:
                    consecutive_violations.append(f"{day}: {current['course']['id']} -> {next_class['course']['id']}")
    
    if consecutive_violations:
        print(f'  Consecutive class violations: {consecutive_violations}')
    else:
        print('  No consecutive class violations')
    
    print('\nRealistic timetable test completed!')

if __name__ == "__main__":
    test_realistic_timetable()

import requests
import json

def test_conflicts():
    # Clear and reload data to test fresh
    requests.delete('http://127.0.0.1:8000/api/resources/resources?resource_type=all')

    # Upload data
    files = ['demo_courses.csv', 'demo_professors.csv', 'demo_rooms.csv', 'demo_time_slots.csv', 'demo_student_groups.csv']
    for f in files:
        with open(f, 'r') as file:
            response = requests.post('http://127.0.0.1:8000/api/resources/upload', 
                json={'resource_type': f.replace('demo_', '').replace('.csv', ''), 'csv_content': file.read()})
        print(f'Uploaded {f}: {response.json()}')

    # Solve
    solve_response = requests.post('http://127.0.0.1:8000/api/solve', json=['mrv', 'mcv', 'lcv'])
    print('Solve:', solve_response.json())

    # Check for conflicts
    timetable_response = requests.get('http://127.0.0.1:8000/api/timetable/')
    timetable = timetable_response.json()['timetable']

    # Check for room-time conflicts
    conflicts = []
    for i, item1 in enumerate(timetable):
        for j, item2 in enumerate(timetable[i+1:], i+1):
            if (item1['time_slot']['day'] == item2['time_slot']['day'] and 
                item1['time_slot']['start_time'] == item2['time_slot']['start_time'] and
                item1['room']['id'] == item2['room']['id']):
                conflicts.append({
                    'item1': item1['course']['id'],
                    'item2': item2['course']['id'],
                    'room': item1['room']['id'],
                    'time': f"{item1['time_slot']['day']} {item1['time_slot']['start_time']}"
                })

    print('Conflicts found:', len(conflicts))
    for c in conflicts:
        print(f'  {c["item1"]} & {c["item2"]} in {c["room"]} at {c["time"]}')

if __name__ == "__main__":
    test_conflicts()

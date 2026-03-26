import requests
import json

def check_system_health():
    print("🔍 UniPlan CSP Solver Diagnostic")
    print("=" * 50)
    
    # Check if backend is running
    try:
        response = requests.get('http://127.0.0.1:8000/api/resources/resources')
        print("✅ Backend API is running")
    except:
        print("❌ Backend API is not running - start with: uvicorn main:app --reload")
        return
    
    # Check current resources
    data = response.json()
    print(f"📊 Current Resources:")
    print(f"   Courses: {len(data['courses'])}")
    print(f"   Professors: {len(data['professors'])}")
    print(f"   Rooms: {len(data['rooms'])}")
    print(f"   Time Slots: {len(data['time_slots'])}")
    print(f"   Student Groups: {len(data['student_groups'])}")
    
    # Check if all resources exist
    missing = []
    if len(data['courses']) == 0: missing.append("courses")
    if len(data['professors']) == 0: missing.append("professors")
    if len(data['rooms']) == 0: missing.append("rooms")
    if len(data['time_slots']) == 0: missing.append("time_slots")
    if len(data['student_groups']) == 0: missing.append("student_groups")
    
    if missing:
        print(f"❌ Missing resources: {', '.join(missing)}")
        print("💡 Upload the missing CSV files via the frontend or run: python test_flow.py")
        return
    
    print("✅ All resources present")
    
    # Test solver
    try:
        solve_response = requests.post('http://127.0.0.1:8000/api/solve', json=['mrv', 'mcv', 'lcv'])
        result = solve_response.json()
        
        if 'error' in result:
            print(f"❌ Solver failed: {result['error']}")
        elif result.get('status') == 'success':
            print("✅ Solver found a solution!")
            print(f"   Nodes expanded: {result.get('nodes_expanded', 0)}")
            print(f"   Time taken: {result.get('time_taken_ms', 0):.2f}ms")
        else:
            print(f"⚠️ Solver status: {result.get('status', 'unknown')}")
            
    except Exception as e:
        print(f"❌ Solver error: {e}")
    
    # Check visualization data
    try:
        viz_response = requests.get('http://127.0.0.1:8000/api/visualization/state')
        viz_data = viz_response.json()
        steps = viz_data.get('steps', [])
        print(f"📈 Visualization data: {len(steps)} steps available")
    except:
        print("❌ No visualization data available")

if __name__ == "__main__":
    check_system_health()

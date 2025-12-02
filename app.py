from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# In-memory storage for tasks
tasks = []
task_id_counter = 1

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Add a new task"""
    global task_id_counter
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Task title is required'}), 400
    
    task = {
        'id': task_id_counter,
        'title': data['title'],
        'completed': False,
        'created_at': datetime.now().isoformat()
    }
    
    tasks.append(task)
    task_id_counter += 1
    
    return jsonify(task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task's completion status"""
    data = request.get_json()
    
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = data.get('completed', task['completed'])
            return jsonify(task)
    
    return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

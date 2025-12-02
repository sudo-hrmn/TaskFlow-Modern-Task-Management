import pytest
from app import app

@pytest.fixture
def client():
    """Create a test client for the Flask application"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_route(client):
    """Test that the index route returns 200"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'TaskFlow' in response.data

def test_get_tasks(client):
    """Test getting all tasks"""
    response = client.get('/api/tasks')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_add_task(client):
    """Test adding a new task"""
    response = client.post('/api/tasks', 
                          json={'title': 'Test Task'},
                          content_type='application/json')
    assert response.status_code == 201
    assert response.json['title'] == 'Test Task'
    assert response.json['completed'] == False

def test_add_task_without_title(client):
    """Test adding a task without a title returns error"""
    response = client.post('/api/tasks', 
                          json={},
                          content_type='application/json')
    assert response.status_code == 400

def test_update_task(client):
    """Test updating a task"""
    # First create a task
    response = client.post('/api/tasks',
                          json={'title': 'Task to Update'},
                          content_type='application/json')
    task_id = response.json['id']
    
    # Update the task
    response = client.put(f'/api/tasks/{task_id}',
                         json={'completed': True},
                         content_type='application/json')
    assert response.status_code == 200
    assert response.json['completed'] == True

def test_update_nonexistent_task(client):
    """Test updating a task that doesn't exist"""
    response = client.put('/api/tasks/999',
                         json={'completed': True},
                         content_type='application/json')
    assert response.status_code == 404

def test_delete_task(client):
    """Test deleting a task"""
    # First create a task
    response = client.post('/api/tasks',
                          json={'title': 'Task to Delete'},
                          content_type='application/json')
    task_id = response.json['id']
    
    # Delete the task
    response = client.delete(f'/api/tasks/{task_id}')
    assert response.status_code == 200
    assert response.json['success'] == True
    
    # Verify it's deleted
    response = client.get('/api/tasks')
    task_ids = [task['id'] for task in response.json]
    assert task_id not in task_ids

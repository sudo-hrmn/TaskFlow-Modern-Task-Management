# TaskFlow - Modern Task Management

> A beautiful task management application with Apple-style animations, localStorage persistence, and enterprise-grade features built with Flask

[![CI/CD Pipeline](https://github.com/sudo-hrmn/TaskFlow-Modern-Task-Management/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/sudo-hrmn/TaskFlow-Modern-Task-Management/actions/workflows/ci-cd.yml)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 Modern glassmorphic UI with dark/light theme
- 📝 Complete task CRUD operations
- 🎯 Smart filtering (All, Active, Completed)
- � localStorage persistence
- ⌨️ Keyboard shortcuts (Ctrl+Enter, Esc, Ctrl+/)
- 🎭 Apple-style animations (custom cursor, magnetic buttons, parallax)
- 🎯 Drag-and-drop task reordering
- 🔔 Toast notifications
- 📱 Fully responsive design

## 🚀 Quick Start

```bash
# Clone and navigate
git clone https://github.com/sudo-hrmn/TaskFlow-Modern-Task-Management.git
cd TaskFlow-Modern-Task-Management

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install and run
pip install -r requirements.txt
python app.py
```

Open `http://localhost:5000` in your browser

## 🧪 Testing

```bash
# Run tests
pytest tests/ -v

# With coverage
pytest tests/ -v --cov=. --cov-report=html

# Linting
flake8 .
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Flask 3.0 |
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| Testing | pytest, pytest-flask |
| CI/CD | GitHub Actions |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/<id>` | Update task status |
| DELETE | `/api/tasks/<id>` | Delete task |

## 🎯 CI/CD Pipeline

Automated testing on Python 3.9, 3.10, and 3.11 with flake8 linting and code coverage tracking.

See [CI/CD Documentation](docs/GITHUB_ACTIONS.md) for details.

# TaskFlow - Modern Task Management

> A beautiful task management application with Apple-style animations, localStorage persistence, and enterprise-grade features built with Flask

[![CI/CD Pipeline](https://github.com/sudo-hrmn/TaskFlow-Modern-Task-Management/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/sudo-hrmn/TaskFlow-Modern-Task-Management/actions/workflows/ci-cd.yml)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautiful, modern task management application built with Flask and featuring Apple-style animations.

## ✨ Features

- 🎨 Modern, glassmorphic UI design
- 📝 Add, complete, and delete tasks
- 🎯 Filter tasks (All, Active, Completed)
- 📊 Real-time statistics
- ✨ Smooth animations and transitions
- 📱 Fully responsive design
- 🖱️ Custom cursor with smooth tracking
- 🧲 Magnetic button interactions
- 🎭 Apple-style animations
- 💾 localStorage persistence (tasks saved locally)
- 🔔 Toast notifications
- ⌨️ Keyboard shortcuts
- 🌓 Dark/Light theme toggle
- 🎯 Drag-and-drop task reordering

## ⌨️ Keyboard Shortcuts

- **Ctrl+Enter** - Add new task
- **Esc** - Clear input field
- **Ctrl+/** - Focus input field
- **Space/Enter** - Toggle task completion (when focused)
- **Drag** - Reorder tasks

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- pip
- Virtual environment (recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sudo-hrmn/TaskFlow-Modern-Task-Management.git
   cd TaskFlow-Modern-Task-Management
   ```

2. **Create and activate virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Access the app**:
   Open your browser and navigate to `http://localhost:5000`

## 🧪 Testing

Run the test suite:
```bash
pytest tests/ -v
```

Run tests with coverage:
```bash
pytest tests/ -v --cov=. --cov-report=html
```

Lint the code:
```bash
flake8 .
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Flask 3.0 |
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| Testing | pytest, pytest-flask |
| CI/CD | GitHub Actions |
| Linting | flake8 |

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # GitHub Actions pipeline
├── app.py                    # Flask backend with RESTful API
├── requirements.txt          # Python dependencies
├── setup.cfg                 # pytest & flake8 configuration
├── templates/
│   └── index.html           # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css        # Styling with modern design
│   └── js/
│       └── app.js           # Frontend JavaScript
└── tests/
    └── test_app.py          # Test suite
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/<id>` | Update task completion status |
| DELETE | `/api/tasks/<id>` | Delete a task |

## 🎯 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- ✅ **Automated Testing**: Runs on Python 3.9, 3.10, and 3.11
- ✅ **Code Quality**: Linting with flake8
- ✅ **Coverage Reports**: Automated code coverage tracking
- ✅ **Build Verification**: Ensures application starts correctly
- ✅ **Email Notifications**: Success/failure notifications
- ✅ **Multi-environment**: Tests across multiple Python versions

See [CI/CD Documentation](docs/GITHUB_ACTIONS.md) for setup details.

## 🎨 Design Highlights

### Animation Features
- Custom cursor with smooth lerp tracking
- Magnetic button interactions
- Scroll-triggered animations
- Parallax effects
- Ripple animations
- 3D transforms on cards
- Physics-based easing functions

### Color Palette
- **Primary**: Purple to blue gradient (`#667eea → #764ba2`)
- **Secondary**: Pink to red gradient (`#f093fb → #f5576c`)
- **Success**: Blue to cyan gradient (`#4facfe → #00f2fe`)
- **Background**: Deep dark theme (`#0f0f23`)

## 📸 Screenshots

The application features:
- Dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations
- Interactive statistics
- Responsive design

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## 👨‍💻 Author

**Harman Singh** ([@sudo-hrmn](https://github.com/sudo-hrmn))

---

Built with ❤️ using Flask & Vanilla JavaScript

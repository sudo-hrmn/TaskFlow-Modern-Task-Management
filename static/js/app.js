// ===== Enhanced State Management =====
let tasks = [];
let currentFilter = 'all';
let theme = localStorage.getItem('theme') || 'dark';
let draggedTaskId = null;

// Custom cursor
let cursor, cursorDot;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let cursorDotX = 0, cursorDotY = 0;

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollAnimations();
    initMagneticButtons();
    initParallax();
    initKeyboardShortcuts();
    initTheme();
    loadTasks();
    setupEventListeners();
});

// ===== Local Storage Persistence =====
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
        updateStats();
    }
}

// ===== Toast Notification System =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${getToastIcon(type)}</div>
        <div class="toast-message">${message}</div>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// ===== Keyboard Shortcuts =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter: Add task
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (taskInput.value.trim()) {
                taskForm.dispatchEvent(new Event('submit'));
            }
        }

        // Escape: Clear input
        if (e.key === 'Escape') {
            taskInput.value = '';
            taskInput.blur();
        }

        // Ctrl/Cmd + /: Focus input
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            taskInput.focus();
        }
    });
}

// ===== Theme Toggle =====
function initTheme() {
    document.documentElement.setAttribute('data-theme', theme);

    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.addEventListener('click', toggleTheme);
    document.body.appendChild(themeToggle);
}

function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';

    showToast(`Switched to ${theme} mode`, 'success');
}

// ===== Apple-style Animations =====

// Custom Cursor
function initCustomCursor() {
    // Create cursor elements
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with lerp for smooth following
    function animateCursor() {
        // Smooth lerping (linear interpolation)
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursorDotX += (mouseX - cursorDotX) * 0.25;
        cursorDotY += (mouseY - cursorDotY) * 0.25;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorDot.style.left = cursorDotX + 'px';
        cursorDot.style.top = cursorDotY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effects
    const interactiveElements = document.querySelectorAll('button, input, a, .task-checkbox, .filter-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}

// Magnetic button effect
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.add-button, .delete-button');

    magneticElements.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 30;

            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;

                button.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-2px)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Parallax effect on scroll
function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.header-content');

                parallaxElements.forEach(el => {
                    const speed = 0.5;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

// Load tasks from server with localStorage fallback
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
            tasks = await response.json();
            saveTasks();
            renderTasks();
            updateStats();
        } else {
            // Fallback to localStorage
            loadTasksFromStorage();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        loadTasksFromStorage();
        showToast('Loaded tasks from local storage', 'warning');
    }
}

// Add new task with optimistic UI
async function handleAddTask(e) {
    e.preventDefault();

    const title = taskInput.value.trim();
    if (!title) return;

    // Optimistic UI update
    const tempId = Date.now();
    const tempTask = {
        id: tempId,
        title: title,
        completed: false,
        created_at: new Date().toISOString()
    };

    tasks.push(tempTask);
    taskInput.value = '';
    renderTasks();
    updateStats();
    saveTasks();

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            const newTask = await response.json();
            // Replace temp task with real one
            const index = tasks.findIndex(t => t.id === tempId);
            if (index !== -1) {
                tasks[index] = newTask;
                saveTasks();
                renderTasks();
            }
            showToast('Task added successfully', 'success');
            addTaskAnimation();
        } else {
            throw new Error('Failed to add task');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        // Keep the optimistic task on error
        showToast('Task saved locally', 'warning');
    }
}

// Toggle task completion with optimistic UI
async function handleToggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic UI update
    task.completed = !task.completed;
    renderTasks();
    updateStats();
    saveTasks();

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: task.completed })
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        showToast(task.completed ? 'Task completed!' : 'Task reopened', 'success');
    } catch (error) {
        console.error('Error updating task:', error);
        // Revert on error
        task.completed = !task.completed;
        renderTasks();
        updateStats();
        saveTasks();
        showToast('Failed to update task', 'error');
    }
}

// Delete task with confirmation
async function handleDeleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    const deletedTask = tasks[taskIndex];

    // Optimistic UI update
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
    updateStats();
    saveTasks();

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        showToast('Task deleted', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        // Revert on error
        tasks.splice(taskIndex, 0, deletedTask);
        renderTasks();
        updateStats();
        saveTasks();
        showToast('Failed to delete task', 'error');
    }
}

// Handle filter change
function handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    currentFilter = filter;

    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    renderTasks();
}

// Render tasks with drag-and-drop
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    tasksList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" 
            data-task-id="${task.id}"
            draggable="true"
            role="listitem"
            aria-label="${task.title}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="handleToggleTask(${task.id})"
                 role="checkbox"
                 aria-checked="${task.completed}"
                 tabindex="0">
            </div>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-time">${formatDate(task.created_at)}</div>
            </div>
            <button class="delete-button" 
                    onclick="handleDeleteTask(${task.id})"
                    aria-label="Delete task: ${escapeHtml(task.title)}"
                    tabindex="0">
                ×
            </button>
        </li>
    `).join('');

    // Initialize drag and drop
    initDragAndDrop();

    // Reinitialize magnetic effects for new delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 30;

            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;

                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });

        // Cursor hover effect
        button.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        button.addEventListener('mouse leave', () => cursor?.classList.remove('hover'));
    });

    // Add cursor effects to checkboxes
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        checkbox.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));

        // Keyboard support
        checkbox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                checkbox.click();
            }
        });
    });
}

// Drag and Drop
function initDragAndDrop() {
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedTaskId = parseInt(e.target.dataset.taskId);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(tasksList, e.clientY);
    const draggable = document.querySelector('.dragging');

    if (afterElement == null) {
        tasksList.appendChild(draggable);
    } else {
        tasksList.insertBefore(draggable, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    // Reorder tasks array based on DOM order
    const taskElements = Array.from(document.querySelectorAll('.task-item'));
    const newOrder = taskElements.map(el => parseInt(el.dataset.taskId));

    tasks.sort((a, b) => {
        return newOrder.indexOf(a.id) - newOrder.indexOf(b.id);
    });

    saveTasks();
    showToast('Tasks reordered', 'success');
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Get filtered tasks
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    animateNumber(totalTasksEl, total);
    animateNumber(completedTasksEl, completed);
    animateNumber(pendingTasksEl, pending);
}

// Animate number changes
function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const duration = 300;
    const steps = Math.abs(target - current);
    const stepDuration = steps > 0 ? duration / steps : 0;

    let currentNum = current;

    const timer = setInterval(() => {
        if (currentNum === target) {
            clearInterval(timer);
            return;
        }
        currentNum += increment;
        element.textContent = currentNum;
    }, stepDuration);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add task animation
function addTaskAnimation() {
    const button = document.getElementById('addButton');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

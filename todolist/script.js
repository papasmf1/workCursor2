// Today's Todo - Complete Functionality Implementation
// shadcn/ui New York Style Todo Application

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.currentTheme = 'light';
        this.editingTodoId = null;
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.loadTheme();
        this.bindEvents();
        this.renderTodos();
        this.updateStats();
    }
    
    // Event Binding
    bindEvents() {
        // Form submission
        const addForm = document.getElementById('add-todo-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTodo();
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // Modal events
        this.bindModalEvents();
        
        // Footer buttons
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.triggerImport();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Auto-save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveToStorage();
        });
        
        // Auto-save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveToStorage();
            }
        });
    }
    
    // Modal event binding
    bindModalEvents() {
        const modal = document.getElementById('edit-modal');
        const modalClose = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('cancel-edit');
        const editForm = document.getElementById('edit-form');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateTodo();
            });
        }
        
        // Close modal on background click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    // Add new todo
    addTodo() {
        const input = document.getElementById('todo-input');
        const priorityRadios = document.querySelectorAll('input[name="priority"]');
        
        const text = input.value.trim();
        if (!text) return;
        
        let priority = 'medium';
        priorityRadios.forEach(radio => {
            if (radio.checked) {
                priority = radio.value;
            }
        });
        
        const todo = {
            id: this.generateId(),
            text: text,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        this.todos.unshift(todo); // Add to beginning
        input.value = '';
        
        this.renderTodos();
        this.updateStats();
        this.saveToStorage();
        
        // Show success animation
        this.showNotification('Todo added successfully!', 'success');
    }
    
    // Toggle todo completion
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date().toISOString() : null;
            
            this.renderTodos();
            this.updateStats();
            this.saveToStorage();
            
            const message = todo.completed ? 'Todo completed!' : 'Todo marked as pending';
            this.showNotification(message, 'info');
        }
    }
    
    // Delete todo
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this todo?')) {
            const index = this.todos.findIndex(t => t.id === id);
            if (index > -1) {
                this.todos.splice(index, 1);
                
                this.renderTodos();
                this.updateStats();
                this.saveToStorage();
                
                this.showNotification('Todo deleted successfully!', 'success');
            }
        }
    }
    
    // Edit todo
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingTodoId = id;
            this.openModal(todo);
        }
    }
    
    // Update todo
    updateTodo() {
        if (!this.editingTodoId) return;
        
        const input = document.getElementById('edit-input');
        const priorityRadios = document.querySelectorAll('input[name="edit-priority"]');
        
        const text = input.value.trim();
        if (!text) return;
        
        let priority = 'medium';
        priorityRadios.forEach(radio => {
            if (radio.checked) {
                priority = radio.value;
            }
        });
        
        const todo = this.todos.find(t => t.id === this.editingTodoId);
        if (todo) {
            todo.text = text;
            todo.priority = priority;
            
            this.renderTodos();
            this.saveToStorage();
            this.closeModal();
            
            this.showNotification('Todo updated successfully!', 'success');
        }
    }
    
    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update filter button states
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        this.renderTodos();
    }
    
    // Get filtered todos
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos;
        }
    }
    
    // Render todos
    renderTodos() {
        const todoList = document.getElementById('todo-list');
        const emptyState = document.getElementById('empty-state');
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            todoList.appendChild(emptyState);
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            todoList.appendChild(todoElement);
        });
    }
    
    // Create todo element
    createTodoElement(todo) {
        const todoDiv = document.createElement('div');
        todoDiv.className = `todo-item ${todo.priority}-priority`;
        todoDiv.setAttribute('data-id', todo.id);
        
        const priorityText = this.getPriorityText(todo.priority);
        const formattedDate = this.formatDate(todo.createdAt);
        
        todoDiv.innerHTML = `
            <div class="todo-content">
                <input type="checkbox" class="todo-checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}>
                <label for="todo-${todo.id}" class="todo-text ${todo.completed ? 'completed' : ''}">
                    ${this.escapeHtml(todo.text)}
                </label>
                <div class="todo-meta">
                    <span class="priority-badge ${todo.priority}">${priorityText}</span>
                    <span class="todo-date">${formattedDate}</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="action-btn edit-btn" aria-label="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" aria-label="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Bind events for this todo
        const checkbox = todoDiv.querySelector('.todo-checkbox');
        const editBtn = todoDiv.querySelector('.edit-btn');
        const deleteBtn = todoDiv.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => {
            this.toggleTodo(todo.id);
        });
        
        editBtn.addEventListener('click', () => {
            this.editTodo(todo.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            this.deleteTodo(todo.id);
        });
        
        return todoDiv;
    }
    
    // Update statistics
    updateStats() {
        const totalElement = document.getElementById('total-todos');
        const completedElement = document.getElementById('completed-todos');
        
        if (totalElement) {
            totalElement.textContent = this.todos.length;
        }
        
        if (completedElement) {
            const completedCount = this.todos.filter(todo => todo.completed).length;
            completedElement.textContent = completedCount;
        }
    }
    
    // Theme management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('todo-theme', this.currentTheme);
        
        // Update theme toggle button icon
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        this.showNotification(`Switched to ${this.currentTheme} theme`, 'info');
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('todo-theme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Set theme toggle button icon
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    // Modal management
    openModal(todo = null) {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.add('show');
            this.editingTodoId = todo ? todo.id : null;
            
            if (todo) {
                // Populate form with todo data
                const editInput = document.getElementById('edit-input');
                const priorityRadios = document.querySelectorAll('input[name="edit-priority"]');
                
                editInput.value = todo.text;
                
                priorityRadios.forEach(radio => {
                    radio.checked = radio.value === todo.priority;
                });
            }
            
            // Focus on input
            const editInput = document.getElementById('edit-input');
            if (editInput) {
                setTimeout(() => editInput.focus(), 100);
            }
        }
    }
    
    closeModal() {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.remove('show');
            this.editingTodoId = null;
            
            // Reset form
            const editForm = document.getElementById('edit-form');
            if (editForm) {
                editForm.reset();
            }
        }
    }
    
    // Data persistence
    saveToStorage() {
        try {
            localStorage.setItem('todo-app-data', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Failed to save data:', error);
            this.showNotification('Failed to save data', 'error');
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('todo-app-data');
            if (saved) {
                this.todos = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            this.todos = [];
            this.showNotification('Failed to load saved data', 'error');
        }
    }
    
    // Export/Import functionality
    exportData() {
        const data = {
            todos: this.todos,
            exportDate: new Date().toISOString(),
            version: '1.0',
            appName: "Today's Todo"
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }
    
    triggerImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importData(file);
            }
        };
        input.click();
    }
    
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.todos && Array.isArray(data.todos)) {
                    if (confirm('This will replace all your current todos. Are you sure?')) {
                        this.todos = data.todos;
                        this.renderTodos();
                        this.updateStats();
                        this.saveToStorage();
                        this.showNotification('Data imported successfully!', 'success');
                    }
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                console.error('Import failed:', error);
                this.showNotification('Failed to import data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    // Keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter: Focus on add todo input
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const todoInput = document.getElementById('todo-input');
            if (todoInput && document.activeElement !== todoInput) {
                todoInput.focus();
            }
        }
        
        // Escape: Close modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('edit-modal');
            if (modal && modal.classList.contains('show')) {
                this.closeModal();
            }
        }
        
        // Ctrl/Cmd + S: Save data
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveToStorage();
            this.showNotification('Data saved!', 'success');
        }
    }
    
    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            font-size: 14px;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // Utility functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    
    getPriorityText(priority) {
        const priorityMap = {
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low'
        };
        return priorityMap[priority] || 'Medium';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Today's Todo app initializing...");
    
    // Create global app instance
    window.todoApp = new TodoApp();
    
    console.log('App initialized successfully!');
    console.log('Available keyboard shortcuts:');
    console.log('- Ctrl/Cmd + Enter: Focus add todo input');
    console.log('- Escape: Close modal');
    console.log('- Ctrl/Cmd + S: Save data');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment the following lines if you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}
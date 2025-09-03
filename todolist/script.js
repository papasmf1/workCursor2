// Today's Todo - JavaScript Structure
// 디자인 구현을 위한 기본 구조 (기능은 나중에 구현)

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.currentTheme = 'light';
        this.editingTodoId = null;
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.bindEvents();
        this.updateStats();
        this.showEmptyState();
    }
    
    // 이벤트 바인딩
    bindEvents() {
        // 폼 제출
        const addForm = document.getElementById('add-todo-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('할일 추가 폼 제출됨 (기능 미구현)');
            });
        }
        
        // 테마 토글
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // 필터 버튼들
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // 할일 체크박스들
        const checkboxes = document.querySelectorAll('.todo-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                console.log('할일 완료 상태 변경됨 (기능 미구현)');
            });
        });
        
        // 편집 버튼들
        const editBtns = document.querySelectorAll('.edit-btn');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('할일 편집 버튼 클릭됨 (기능 미구현)');
            });
        });
        
        // 삭제 버튼들
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('할일 삭제 버튼 클릭됨 (기능 미구현)');
            });
        });
        
        // 모달 관련 이벤트
        this.bindModalEvents();
        
        // 푸터 버튼들
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                console.log('데이터 내보내기 (기능 미구현)');
            });
        }
        
        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                console.log('데이터 가져오기 (기능 미구현)');
            });
        }
    }
    
    // 모달 이벤트 바인딩
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
                console.log('할일 수정 폼 제출됨 (기능 미구현)');
                this.closeModal();
            });
        }
        
        // 모달 배경 클릭 시 닫기
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
    
    // 테마 토글
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('todo-theme', this.currentTheme);
        
        // 테마 토글 버튼 아이콘 변경
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    // 테마 로드
    loadTheme() {
        const savedTheme = localStorage.getItem('todo-theme') || 'light';
        this.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // 테마 토글 버튼 아이콘 설정
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    // 필터 설정
    setFilter(filter) {
        this.currentFilter = filter;
        
        // 필터 버튼 활성화 상태 업데이트
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
        
        console.log(`필터 변경됨: ${filter} (기능 미구현)`);
    }
    
    // 통계 업데이트
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
    
    // 빈 상태 표시/숨김
    showEmptyState() {
        const emptyState = document.getElementById('empty-state');
        const todoList = document.getElementById('todo-list');
        
        if (emptyState && todoList) {
            // 샘플 할일이 있으면 빈 상태 숨김
            const sampleTodos = todoList.querySelectorAll('.todo-item[data-id^="sample"]');
            if (sampleTodos.length > 0) {
                emptyState.style.display = 'none';
            } else {
                emptyState.style.display = 'block';
            }
        }
    }
    
    // 모달 열기
    openModal(todoId = null) {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.add('show');
            this.editingTodoId = todoId;
            
            // 포커스 관리
            const editInput = document.getElementById('edit-input');
            if (editInput) {
                setTimeout(() => editInput.focus(), 100);
            }
        }
    }
    
    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.remove('show');
            this.editingTodoId = null;
            
            // 폼 리셋
            const editForm = document.getElementById('edit-form');
            if (editForm) {
                editForm.reset();
            }
        }
    }
    
    // 할일 추가 (구조만)
    addTodo(text, priority = 'medium') {
        const todo = {
            id: Date.now().toString(),
            text: text,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        this.todos.push(todo);
        console.log('할일 추가됨:', todo);
        return todo;
    }
    
    // 할일 완료 토글 (구조만)
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date().toISOString() : null;
            console.log('할일 상태 변경됨:', todo);
        }
    }
    
    // 할일 삭제 (구조만)
    deleteTodo(id) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index > -1) {
            const deletedTodo = this.todos.splice(index, 1)[0];
            console.log('할일 삭제됨:', deletedTodo);
        }
    }
    
    // 할일 수정 (구조만)
    updateTodo(id, text, priority) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            todo.priority = priority;
            console.log('할일 수정됨:', todo);
        }
    }
    
    // 데이터 저장 (구조만)
    saveToStorage() {
        localStorage.setItem('todo-app-data', JSON.stringify(this.todos));
        console.log('데이터 저장됨');
    }
    
    // 데이터 로드 (구조만)
    loadFromStorage() {
        const saved = localStorage.getItem('todo-app-data');
        if (saved) {
            this.todos = JSON.parse(saved);
            console.log('데이터 로드됨:', this.todos);
        }
    }
    
    // 데이터 내보내기 (구조만)
    exportData() {
        const data = {
            todos: this.todos,
            exportDate: new Date().toISOString(),
            version: '1.0'
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
        
        console.log('데이터 내보내기 완료');
    }
    
    // 데이터 가져오기 (구조만)
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.todos && Array.isArray(data.todos)) {
                    this.todos = data.todos;
                    console.log('데이터 가져오기 완료:', this.todos);
                } else {
                    throw new Error('잘못된 파일 형식입니다.');
                }
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
                alert('파일을 읽을 수 없습니다. 올바른 백업 파일인지 확인해주세요.');
            }
        };
        reader.readAsText(file);
    }
}

// 유틸리티 함수들
const Utils = {
    // 날짜 포맷팅
    formatDate(date) {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },
    
    // 우선순위 한글 변환
    getPriorityText(priority) {
        const priorityMap = {
            'high': '높음',
            'medium': '보통',
            'low': '낮음'
        };
        return priorityMap[priority] || '보통';
    },
    
    // 우선순위 색상 클래스
    getPriorityClass(priority) {
        return `${priority}-priority`;
    },
    
    // 고유 ID 생성
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // 디바운스 함수
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 로컬 스토리지 안전하게 사용
    safeLocalStorage: {
        getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('로컬 스토리지 접근 실패:', e);
                return null;
            }
        },
        
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn('로컬 스토리지 저장 실패:', e);
                return false;
            }
        }
    }
};

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('Today\'s Todo 앱이 시작됩니다.');
    console.log('현재는 디자인 구현 단계입니다. 기능은 추후 구현 예정입니다.');
    
    // 전역 앱 인스턴스 생성
    window.todoApp = new TodoApp();
    
    // 개발자 도구에서 앱 인스턴스 접근 가능
    console.log('앱 인스턴스:', window.todoApp);
    console.log('유틸리티 함수들:', Utils);
});

// 키보드 단축키 (기본 구조)
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter: 새 할일 추가
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const todoInput = document.getElementById('todo-input');
        if (todoInput && document.activeElement !== todoInput) {
            todoInput.focus();
        }
    }
    
    // Escape: 모달 닫기
    if (e.key === 'Escape') {
        const modal = document.getElementById('edit-modal');
        if (modal && modal.classList.contains('show')) {
            window.todoApp.closeModal();
        }
    }
});

// 페이지 가시성 변경 시 데이터 저장
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.todoApp) {
        window.todoApp.saveToStorage();
    }
});

// 페이지 언로드 시 데이터 저장
window.addEventListener('beforeunload', () => {
    if (window.todoApp) {
        window.todoApp.saveToStorage();
    }
});

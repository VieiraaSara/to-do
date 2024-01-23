document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const searchForm = document.getElementById('search');
    const searchInput = document.getElementById('search-input');
    const filterForm = document.getElementById('filter');
    const filterSelect = document.getElementById('filter-select');

    // Adiciona um evento de envio para o formulário de adicionar tarefa
    todoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });

    // Adiciona um evento de clique para o botão de pesquisa
    document.getElementById('erase-button').addEventListener('click', function (event) {
        event.preventDefault();
        searchTodos();
    });

    // Adiciona um evento de mudança para o filtro select
    filterSelect.addEventListener('change', function () {
        filterTodos();
    });

    // Função para adicionar uma nova tarefa
    function addTodo() {
        const todoInput = document.getElementById('todo-input').value;
        if (todoInput.trim() !== '') {
            const newTodo = createTodoElement(todoInput);
            todoList.appendChild(newTodo);
            document.getElementById('todo-input').value = ''; // Limpa o campo de entrada
        }
    }


todoList.addEventListener('click', function (event) {
    const targetButton = event.target.closest('button');
    
    if (targetButton && targetButton.classList.contains('finish-todo')) {
        const todoElement = targetButton.closest('.todo');
        finishTodo(todoElement);
    } else if (targetButton && targetButton.classList.contains('remove-todo')) {
        const todoElement = targetButton.closest('.todo');
        removeTodo(todoElement);
    }
});



    // Função para criar um novo elemento de tarefa
    function createTodoElement(todoText) {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo');
        todoElement.innerHTML = `
            <h3>${todoText}</h3>
            <button class="finish-todo">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="edit-todo">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="remove-todo">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        // Adiciona eventos de clique aos botões
        todoElement.querySelector('.finish-todo').addEventListener('click', function () {
            finishTodo(todoElement);
        });

        todoElement.querySelector('.edit-todo').addEventListener('click', function () {
            editTodo(todoElement);
        });

        todoElement.querySelector('.remove-todo').addEventListener('click', function () {
            removeTodo(todoElement);
        });

        return todoElement;
    }


   // Função para marcar uma tarefa como concluída
function finishTodo(todoElement) {
    todoElement.classList.toggle('done');
    saveToLocalStorage(); // Salva as alterações no armazenamento local (temporário)
}


    // Função para remover uma tarefa
function removeTodo(todoElement) {
    todoElement.remove();
    saveToLocalStorage(); // Salva as alterações no armazenamento local (temporário)
}



// Função para editar uma tarefa
function editTodo(todoElement) {
    const todoTextElement = todoElement.querySelector('h3');
    const todoText = todoTextElement.innerText;

    document.getElementById('edit-input').value = todoText;
    showEditForm();

    // Adiciona um evento de envio para o formulário de edição
    document.getElementById('edit-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const editedText = document.getElementById('edit-input').value;
        todoTextElement.innerText = editedText;

        // Salva as alterações no armazenamento local (temporário)
        saveToLocalStorage();

        hideEditForm();
    });

    // Adiciona um evento de clique ao botão de cancelar
    document.getElementById('calcel-edit-btn').addEventListener('click', function () {
        hideEditForm();
    });
}

// Função para salvar as tarefas no armazenamento local(temporário)
function saveToLocalStorage() {
    const todos = document.querySelectorAll('.todo');
    const todoData = [];

    todos.forEach(function (todo) {
        const todoText = todo.querySelector('h3').innerText;
        const isDone = todo.classList.contains('done');
        todoData.push({ text: todoText, done: isDone });
    });

    localStorage.setItem('todos', JSON.stringify(todoData));
}

// Função para carregar as tarefas do armazenamento local(temporário)
function loadFromLocalStorage() {
    const todoData = JSON.parse(localStorage.getItem('todos')) || [];

    todoData.forEach(function (data) {
        const newTodo = createTodoElement(data.text);
        if (data.done) {
            newTodo.classList.add('done');
        }
        todoList.appendChild(newTodo);
    });
}

// Carrega as tarefas salvas ao carregar a página (temporário)
loadFromLocalStorage();



// Adiciona eventos de clique aos botões de edição em todas as tarefas
const editButtons = document.querySelectorAll('.edit-todo');
editButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        const todoElement = event.target.closest('.todo');
        editTodo(todoElement);
    });
});



    // Função para exibir o formulário de edição
    function showEditForm() {
        document.getElementById('edit-form').classList.remove('hide');
    }

    // Função para ocultar o formulário de edição
    function hideEditForm() {
        document.getElementById('edit-form').classList.add('hide');
    }

    // Função para pesquisar tarefas com o filtro com "todas as tarefas"
    function searchTodos() {
        const searchTerm = searchInput.value.toLowerCase();
        const todos = document.querySelectorAll('.todo');

        todos.forEach(function (todo) {
            const todoText = todo.querySelector('h3').innerText.toLowerCase();
            if (todoText.includes(searchTerm)) {
                todo.style.display = 'flex';
            } else {
                todo.style.display = 'none';
            }
        });
    }

    // Função que filtra as tarefas por: todas,concluídas, não concluídas e em progresso
    function filterTodos() {
        const filterValue = filterSelect.value;
        const todos = document.querySelectorAll('.todo');

        todos.forEach(function (todo) {
            switch (filterValue) {
                case 'all':
                    todo.style.display = 'flex';
                    break;
                case 'done':
                    todo.classList.contains('done') ? todo.style.display = 'flex' : todo.style.display = 'none';
                    break;
                case 'notdone':
                    !todo.classList.contains('done') ? todo.style.display = 'flex' : todo.style.display = 'none';
                    break;
                case 'progress':
                    todo.classList.contains('done') ? todo.style.display = 'none' : todo.style.display = 'flex';
                    break;
            }
        });
    }
});

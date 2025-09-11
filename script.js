// Elemente aus der HTML-Datei
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// Funktion zum Speichern der Aufgaben im Local Storage
function saveTodos() {
    console.log('Speichere die Todos...'); // Zeigt in der Konsole an ob diese Funktion ausgeführt wird
    const todos = [];
    document.querySelectorAll('todo-item').forEach(item => {
        todos.push({
            text: item.querySelector('span:not(.strikes)').textContent,
            strikes: parseInt(item.dataset.strikes)
        })
    })
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Funktion zum Laden der Aufgaben aus dem Local Storage
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    const todos = storedTodos ? JSON.parse(storedTodos) : [];
    
    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.dataset.strikes = todo.strikes;
        todoItem.innerHTML = `
            <span>${todo.text}</span>
            span class="strikes">${todo.strikes} Strikes</span>
        `;
        todoList.appendChild(todoItem);
    });
}

// Funktion zum hinzufügen neuer Aufgaben
function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText !== '') {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.dataset.strikes = 0;

        todoItem.innerHTML = `
        <span>${todoText}</span>
        <span class="strikes">0 Strikes</span>
        `;

        todoList.appendChild(todoItem);
        todoInput.value = '';
        saveTodos(); // Speichert nach dem Hinzufügen
    }
}

    // //Hole den Text aus dem Eingabefeld und entferne Leerzeichen am Anfang und Ende
    // const todoText = todoInput.value.trim();

    // //Überprüft, ob der Text nicht leer ist
    // if (todoText !== '') {
    //     // Erstellt ein neues Listenelement (<li>) für den ToDo
    //     const todoItem = document.createElement('li');
    //     todoItem.classList.add('todo-item');

    //     // data-Attribut für das zählen der Strikes
    //     todoItem.dataset.strikes = 0;
        
    //     // Fügt den Text und die Strike-Anzeige hinzu
    //     todoItem.innerHTML = `
    //     <span>${todoText}</span>
    //     <span class="strikes">0 Strikes</span>
    //     `;

    //     // Fügt das neue Element zur Liste hinzu
    //     todoList.appendChild(todoItem);

    //     // Setzt das Eingabefeld zurück
    //     todoInput.value = '';
    // }

// Fügt einen Event-Listener zum Button hinzu
addButton.addEventListener('click', addTodo);

// Event Listener für die gesamte Liste (Event Delegation)
todoList.addEventListener('click', function(event) {
    // Überprüft, ob das geklickte Element ein todo-item ist
    const clickedItem = event.target.closest('li.todo-item');

    if (clickedItem) {
        // Strike-Zähler um 1 erhöhen
        let currentStrikes = parseInt(clickedItem.dataset.strikes);
        currentStrikes++;
        clickedItem.dataset.strikes = currentStrikes;

        // Text im HTML aktualisieren
        const strikeSpan = clickedItem.querySelector('.strikes');
        strikeSpan.textContent = `${currentStrikes} Strikes`;
        saveTodos(); // Speichert nach dem Klick
    }
});

// Lädt die Todos, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', loadTodos);

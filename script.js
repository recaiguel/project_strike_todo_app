// Elemente aus der HTML-Datei
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// Funktion zum Speichern der Aufgaben im Local Storage
function saveTodos() {
    console.log('Speichere die Todos...'); // Zeigt in der Konsole an ob diese Funktion ausgeführt wird
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
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
    const oneDayInMs = 86400000

    todos.forEach(todo => {
        // Neu: Überprüft, ob die Aufgabe einen Zeitstempel hat und ob ein Tag vergangen ist
        if (todo.lastclicked && (new Date().getTime() - todo.lastclicked > oneDayInMs)) {
            // Wenn die Bedingung wahr ist, setzen wir die Strikes i Objekt zurück
            todo.strikes = 0;
            // Da wir die Strikes zurückgesetzt haben, setzen wir auch den Zeitstempel zurück
            todo.lastclicked = new Date().getTime();
        }

        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.dataset.strikes = todo.strikes;

        // Fügt den neuen Zeitstempel als data-attribut hinzu
        if (todo.lastclicked) {
            todoItem.dataset.lastclicked = todos.strikes;
        }
        todoItem.innerHTML = `
            <span>${todo.text}</span>
            <span class="strikes">${todo.strikes} Strikes</span>
            <button class="delete-button">X</button>

        `;
        todoList.appendChild(todoItem);
    });
    // Neu: Jetzt speichern wir die gesamte, aktualisierte Liste
    localStorage.setItem('todos', JSON.stringify(todos));
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
        <button class="delete-button">X</button>
        `;

        todoList.appendChild(todoItem);
        todoInput.value = '';
        saveTodos(); // Speichert nach dem Hinzufügen
    }
}

// Fügt einen Event-Listener zum Button hinzu
addButton.addEventListener('click', addTodo);

// Event Listener für die gesamte Liste (Event Delegation)
todoList.addEventListener('click', function(event) {
    
    // Überprüft, ob das geklickte Element der delete-button ist
    if (event.target.classList.contains('delete-button')) {
        const itemToRemove = event.target.closest('li.todo-item');
        if (itemToRemove) {
            itemToRemove.remove();
            saveTodos(); // Speichert die Änderung bzw. das Löschen der Todos
        }
    }
    
    // Überprüft, ob das geklickte Element ein todo-item ist
    const clickedItem = event.target.closest('li.todo-item');

    if (clickedItem) {
        // Strike-Zähler um 1 erhöhen
        let currentStrikes = parseInt(clickedItem.dataset.strikes);
        currentStrikes++;
        clickedItem.dataset.strikes = currentStrikes;

        // Speichert den letzten Klick-Zeitstempel
        clickedItem.dataset.lastclicked = new Date().getTime();

        // Text im HTML aktualisieren
        const strikeSpan = clickedItem.querySelector('.strikes');
        strikeSpan.textContent = `${currentStrikes} Strikes`;
        saveTodos(); // Speichert nach dem Klick
    }
});

// Lädt die Todos, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', loadTodos);

const FIREBASE_URL = 'https://laba7-acca3-default-rtdb.firebaseio.com/todos.json';
const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

// Створюємо елементи для Завдання 6 (Умовний рендеринг завантаження та помилок)
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'alert alert-info text-center';
loadingIndicator.textContent = 'Завантаження даних з БД...';
loadingIndicator.style.display = 'none';
list.parentNode.insertBefore(loadingIndicator, list);

const errorIndicator = document.createElement('div');
errorIndicator.className = 'alert alert-danger text-center';
errorIndicator.style.display = 'none';
list.parentNode.insertBefore(errorIndicator, list);

// Порожній масив, дані завантажуватимуться з Firebase
let todos = [];

// ЗАВДАННЯ 3. Читання з БД (GET-запит)
async function fetchTodos() {
  loadingIndicator.style.display = 'block';
  errorIndicator.style.display = 'none';
  try {
    const response = await fetch(FIREBASE_URL);
    if (!response.ok) throw new Error('Не вдалося завантажити дані з сервера!');
    
    const data = await response.json();
    
    todos = [];
    if (data) {
      // Трансформуємо отриманий об'єкт у масив (Завдання 3)
      for (const key in data) {
        todos.push({
          id: key,              // унікальний ключ Firebase стає нашим id
          text: data[key].text,
          checked: data[key].checked
        });
      }
    }
    
    render(todos);
    updateCounter(todos);
  } catch (error) {
    errorIndicator.textContent = `Помилка читання: ${error.message}`;
    errorIndicator.style.display = 'block';
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

// ЗАВДАННЯ 2. Функція addTodo (POST-запит)
async function newTodo() {
  const text = prompt('Введіть нове завдання:');
  if (text && text.trim()) {
    loadingIndicator.style.display = 'block';
    errorIndicator.style.display = 'none';
    
    try {
      // Відправляємо дані БЕЗ id (Завдання 2)
      const response = await fetch(FIREBASE_URL, {
        method: 'POST',
        body: JSON.stringify({
          text: text.trim(),
          checked: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Не вдалося зберегти завдання!');

      const data = await response.json();
      
      // Використовуємо поле name відповіді як id для нової справи (Завдання 2)
      const todo = { id: data.name, text: text.trim(), checked: false };
      
      todos.push(todo);
      render(todos);
      updateCounter(todos);
    } catch (error) {
      errorIndicator.textContent = `Помилка додавання: ${error.message}`;
      errorIndicator.style.display = 'block';
    } finally {
      loadingIndicator.style.display = 'none';
    }
  }
}

function renderTodo(todo) {
  const checkedAttr = todo.checked ? 'checked' : '';
  const spanClass = todo.checked ? 'text-success text-decoration-line-through' : '';
  
  // ЗВЕРНИ УВАГУ: id тепер рядок Firebase, тому передаємо його у функціях як рядок в одинарних лапках '${todo.id}'
  return `<li class="list-group-item">
    <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${checkedAttr} onChange="checkTodo('${todo.id}')" />
    <label for="${todo.id}"><span class="${spanClass}">${todo.text}</span></label>
    <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo('${todo.id}')">delete</button>
  </li>`;
}

function render(todos) {
  list.innerHTML = todos.map(renderTodo).join('');
}

function updateCounter(todos) {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.checked).length;
}

// ЗАВДАННЯ 4. Видалення даних (DELETE-запит)
async function deleteTodo(id) {
  loadingIndicator.style.display = 'block';
  errorIndicator.style.display = 'none';
  
  // Шлях до конкретного елемента у Firebase (Завдання 4)
  const ITEM_URL = `https://lab7-3d88d-default-rtdb.firebaseio.com/todos/${id}.json`;

  try {
    const response = await fetch(ITEM_URL, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Не вдалося видалити завдання з БД!');

    // Оновлюємо локальний масив тільки після успішного видалення з БД
    todos = todos.filter(todo => todo.id !== id);
    render(todos);
    updateCounter(todos);
  } catch (error) {
    errorIndicator.textContent = `Помилка видалення: ${error.message}`;
    errorIndicator.style.display = 'block';
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

// ЗАВДАННЯ 5. Оновлення даних (PATCH-запит)
async function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;

  loadingIndicator.style.display = 'block';
  errorIndicator.style.display = 'none';
  
  // Шлях до конкретного елемента у Firebase (Завдання 5)
  const ITEM_URL = `https://lab7-3d88d-default-rtdb.firebaseio.com/todos/${id}.json`;

  try {
    // Змінюємо статус на протилежний
    const nextCheckedState = !todo.checked;

    const response = await fetch(ITEM_URL, {
      method: 'PATCH',
      body: JSON.stringify({
        checked: nextCheckedState // Оновлюємо тільки поле checked (Завдання 5)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Не вдалося оновити статус у БД!');

    todo.checked = nextCheckedState;
    render(todos);
    updateCounter(todos);
  } catch (error) {
    errorIndicator.textContent = `Помилка оновлення: ${error.message}`;
    errorIndicator.style.display = 'block';
    render(todos); // перемальовуємо назад чекбокс, якщо виникла помилка
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

// Запускаємо первинне читання даних при завантаженні сторінки
fetchTodos();
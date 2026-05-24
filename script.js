const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

// Масив об'єктів: { id, text, checked }
let todos = [
  { id: 1, text: 'Вивчити HTML', checked: true },
  { id: 2, text: 'Вивчити CSS', checked: true },
  { id: 3, text: 'Вивчити JavaScript', checked: false },
]

let nextId = 4

function newTodo() {
  const text = prompt('Введіть нове завдання:')
  if (text && text.trim()) {
    const todo = { id: nextId++, text: text.trim(), checked: false }
    todos.push(todo)
    console.log('Додано нове завдання:', todo)
    console.log('Всі завдання:', todos)
    render(todos)
    updateCounter(todos)
  }
}

function renderTodo(todo) {
  const checkedAttr = todo.checked ? 'checked' : ''
  const spanClass = todo.checked ? 'text-success text-decoration-line-through' : ''
  return `<li class="list-group-item">
    <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${checkedAttr} onChange="checkTodo(${todo.id})" />
    <label for="${todo.id}"><span class="${spanClass}">${todo.text}</span></label>
    <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo(${todo.id})">delete</button>
  </li>`
}

function render(todos) {
  list.innerHTML = todos.map(renderTodo).join('')
}

function updateCounter(todos) {
  itemCountSpan.textContent = todos.length
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.checked).length
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id)
  render(todos)
  updateCounter(todos)
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id)
  if (todo) todo.checked = !todo.checked
  render(todos)
  updateCounter(todos)
}

render(todos)
updateCounter(todos)

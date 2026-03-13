let tasks = [];
let filter = 'all';
let nextId = 1;

const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const emptyMsg = document.getElementById('emptyMsg');
const counter = document.getElementById('counter');

function render() {
  const visible = tasks.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  taskList.innerHTML = '';
  visible.forEach(t => {
    const item = document.createElement('div');
    item.className = 'task-item' + (t.done ? ' done' : '');
    item.innerHTML = `
      <button class="check-btn ${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})" title="Marquer comme ${t.done ? 'à faire' : 'terminée'}">
        <svg class="check-icon" viewBox="0 0 10 8"><polyline points="1,4 4,7 9,1"/></svg>
      </button>
      <span class="task-text">${escapeHtml(t.text)}</span>
      <button class="del-btn" onclick="removeTask(${t.id})" title="Supprimer">×</button>
    `;
    taskList.appendChild(item);
  });

  const remaining = tasks.filter(t => !t.done).length;
  counter.textContent = `${remaining} tâche${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}`;
  emptyMsg.style.display = visible.length === 0 ? 'block' : 'none';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: nextId++, text, done: false });
  taskInput.value = '';
  taskInput.focus();
  render();
}

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  render();
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

document.getElementById('addBtn').addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

document.getElementById('clearBtn').addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  render();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

render();

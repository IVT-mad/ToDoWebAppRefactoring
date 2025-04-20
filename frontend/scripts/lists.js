import { API_URL, authHeaders } from './config.js'
import { setCurrentGroupId, setCurrentListId } from './state.js'
import { loadTasks } from './tasks.js'

export async function loadLists() {
  try {
    const res = await fetch(`${API_URL}/lists/read.php`, {
      headers: authHeaders(),
    });
    const data = await res.json();

    const container = document.querySelector('.lists-container');
    container.innerHTML = '';

    const totalTasks = data.total_tasks || 0;

    const allLi = document.createElement('li');
    allLi.classList.add('list-item');
    allLi.innerHTML = `
      <span>📋</span>
      <span>Home</span>
      <span>${totalTasks}</span>
    `;
    allLi.addEventListener('click', () => {
      setCurrentListId(null);
      loadTasks();
      document.querySelectorAll('.list-item').forEach(item => item.classList.remove('active'));
      allLi.classList.add('active');
    });
    container.appendChild(allLi);

    data.lists.sort((a, b) => b.task_count - a.task_count);

    const maxVisible = 6;
    const showAll = data.lists.length > maxVisible;
    const visibleLists = showAll ? data.lists.slice(0, maxVisible) : data.lists;

    visibleLists.forEach(list => {
      const li = createListItem(list);
      container.appendChild(li);
    });

    if (showAll) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'show-more-lists';
      toggleBtn.textContent = 'More...';
      toggleBtn.addEventListener('click', () => {
        container.innerHTML = '';
        loadAllLists(data.lists, totalTasks);
      });
      container.appendChild(toggleBtn);
    }
  } catch (err) {
    console.error('Error loading lists', err);
  }
}

function loadAllLists(allLists, totalTasks) {
  const container = document.querySelector('.lists-container');
  container.innerHTML = '';

  const allLi = document.createElement('li');
  allLi.classList.add('list-item');
  allLi.innerHTML = `
    <span>📋</span>
    <span>Home</span>
    <span>${totalTasks}</span>
  `;
  allLi.addEventListener('click', () => {
    setCurrentListId(null);
    loadTasks();
    document.querySelectorAll('.list-item').forEach(item => item.classList.remove('active'));
    allLi.classList.add('active');
  });
  container.appendChild(allLi);

  allLists.forEach(list => {
    const li = createListItem(list);
    container.appendChild(li);
  });
}

function createListItem(list) {
  const li = document.createElement('li');
  li.classList.add('list-item');
  li.innerHTML = `
    <span>${list.icon || '📁'}</span>
    <span>${list.name}</span>
    <span>${list.task_count}</span>
  `;
  li.addEventListener('click', () => {
    setCurrentListId(list.id);
    setCurrentGroupId(null);
    document.querySelectorAll('.list-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.group-card').forEach(card => card.classList.remove('active'));
    li.classList.add('active');
    loadTasks(list.id);
  });
  return li;
}

export async function getLists() {
  const res = await fetch(`${API_URL}/lists/read.php`, {
    headers: authHeaders()
  });
  const data = await res.json();
  return data.lists || [];
}

export async function createList(listData) {
  try {
    const res = await fetch(`${API_URL}/lists/create.php`, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listData),
    });
    const result = await res.json();
    if (result.success) {
      loadLists();
    } else {
      alert(result.message || 'Failed to create list');
    }
  } catch (err) {
    console.error('Error creating list', err);
  }
}

export async function editList(listId, newName) {
  try {
    const res = await fetch(`${API_URL}/lists/update.php`, {
      method: 'PUT',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: listId, name: newName }),
    });

    const result = await res.json();
    if (result.success) {
      loadLists();
    } else {
      alert(result.message || 'Failed to update list');
    }
  } catch (err) {
    console.error('Error updating list', err);
  }
}

export async function deleteList(listId) {
  try {
    const res = await fetch(`${API_URL}/lists/delete.php`, {
      method: 'DELETE',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: listId }),
    });

    const result = await res.json();
    if (result.success) {
      loadLists();
    } else {
      alert(result.message || 'Failed to delete list');
    }
  } catch (err) {
    console.error('Error deleting list', err);
  }
}
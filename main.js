document.addEventListener('DOMContentLoaded', fetchData);

let users = [];
let currentPage = 1;
const itemsPerPage = 10;

async function fetchData() {
  try {
    const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    users = await response.json();
    renderTable();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderTable() {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedUsers = users.slice(startIdx, endIdx);

  displayedUsers.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" onclick="toggleSelect(${user.id})"></td>
      <td>${user.id}</td>
      <td contenteditable="true">${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="action-btn edit" onclick="editRow(${user.id})">✏️</button>
        <button class="action-btn delete" onclick="deleteRow(${user.id})">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  renderPagination();
  updateSelectedInfo();
}

function renderPagination() {
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  // Add Previous button
  const previousButton = document.createElement('button');
  previousButton.innerText = 'Previous';
  previousButton.onclick = () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderTable();
    }
  };
  pagination.appendChild(previousButton);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.onclick = () => {
      currentPage = i;
      renderTable();
    };
    pagination.appendChild(button);
  }

  // Add Next button
  const nextButton = document.createElement('button');
  nextButton.innerText = 'Next';
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderTable();
    }
  };
  pagination.appendChild(nextButton);
}

function search() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();

  const filteredUsers = users.filter(user => {
    return Object.values(user).some(value => value.toLowerCase().includes(searchTerm));
  });

  currentPage = 1;
  users = filteredUsers;
  renderTable();
}

function editRow(userId) {
  const editedUser = users.find(user => user.id === userId);
  const newName = prompt('Enter new name:', editedUser.name);
  if (newName !== null) {
    editedUser.name = newName;
    renderTable();
  }
}

function deleteRow(userId) {
  const confirmed = confirm('Are you sure you want to delete this row?');
  if (confirmed) {
    users = users.filter(user => user.id !== userId);
    renderTable();
  }
}

function toggleSelect(userId) {
  const user = users.find(user => user.id === userId);
  user.selected = !user.selected;
  renderTable();
}

function toggleSelectAll() {
  const allSelected = users.every(user => user.selected);
  users.forEach(user => (user.selected = !allSelected));
  renderTable();
}


function deleteSelected() {
  const selectedUsers = users.filter(user => user.selected);
  if (selectedUsers.length === 0) {
      alert('No rows selected for deletion.');
      return;
  }

  const confirmed = confirm('Are you sure you want to delete selected rows?');
  if (confirmed) {
      users = users.filter(user => !user.selected);
      renderTable();
  }
}


function updateSelectedInfo() {
  const selectedColumnsInfo = document.getElementById('selectedColumns');
  const selectedRowsInfo = document.getElementById('selectedRows');
  
  const selectedColumnsCount = users.filter(user => user.selected).length;
  const selectedRowsCount = users.filter(user => user.selected).length;

  selectedColumnsInfo.innerText = `${selectedColumnsCount} Columns Selected`;
  selectedRowsInfo.innerText = `${selectedRowsCount} Row(s) Selected`;
}

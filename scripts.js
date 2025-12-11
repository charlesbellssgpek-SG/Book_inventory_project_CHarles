// Load books from server (inventory.json via API)
let books = [];
let nextId = 1; // assign nextId based on existing data after load

// debounce helper
function debounce(fn, delay) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
}
// Load books from server 
function loadBooks() {
    axios.get('/api/books')
        .then(resp => {
            books = resp.data || [];
            nextId = books.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
            renderTable();
        })
        .catch(err => {
            console.error('Failed to load books:', err);
            // avoid alert spamming if server is down; log and show minimal notice
            const tbody = document.getElementById('booksTableBody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="5">Unable to load books. Ensure the server is running.</td></tr>';
        });
}
// Render books table with current filters and sorting 
function renderTable() {
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Read current filter values (if controls exist)
    const searchEl = document.getElementById('searchInput');
    const filterEl = document.getElementById('filterStatus');
    const sortEl = document.getElementById('sortBy');
    const filterText = searchEl ? (searchEl.value || '').trim().toLowerCase() : '';
    const filterStatus = filterEl ? (filterEl.value || '') : '';
    const sortBy = sortEl ? (sortEl.value || 'id') : 'id';

    // Apply filtering search and status
    const filtered = books.filter(book => {
        const matchesStatus = !filterStatus || book.status === filterStatus;
        const text = ((book.title || '') + ' ' + (book.author || '')).toLowerCase();
        const matchesText = !filterText || text.indexOf(filterText) !== -1;
        return matchesStatus && matchesText;
    });

    // Sorting
    filtered.sort((a, b) => {
        if (sortBy === 'id') return (a.id || 0) - (b.id || 0);
        const va = ((a[sortBy] || '') + '').toString().toLowerCase();
        const vb = ((b[sortBy] || '') + '').toString().toLowerCase();
        if (va < vb) return -1;
        if (va > vb) return 1;
        return 0;
    });
// Render rows or show no data message or file  json not found
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No books found.</td></tr>';
        return;
    }
// Loop through filtered books and create table rows and show status;
    filtered.forEach(book => {
        const row = document.createElement('tr');
        const statusClass = `status ${book.status || ''}`.trim();
        const statusText = ((book.status || '').charAt(0).toUpperCase() + (book.status || '').slice(1)) || '';
// Build action options based on status
// Render table row
// Display option to edit, borrow, return, sell, delete based on status

        row.innerHTML = `
            <td>${book.id || ''}</td>
            <td>${book.title || ''}</td>
            <td>${book.author || ''}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>
                <div class="actions">
                    <select class="action-select" onchange="handleAction(this, ${book.id})">
                        <option value="">Actions</option>
                        <option value="edit">Edit</option>
                        ${book.status === 'available' ? '<option value="borrow">Borrow</option>' : ''}
                        ${book.status === 'borrowed' ? '<option value="return">Return</option>' : ''}
                        ${book.status !== 'sold' ? '<option value="sell">Sell</option>' : ''}
                        ${book.status !== 'sold' ? '<option value="delete">Delete</option>' : ''}
                    </select>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}
// Add new book 

function addBook() {
    const titleInput = document.getElementById('titleInput');
    const authorInput = document.getElementById('authorInput');
    const statusInput = document.getElementById('statusInput');

    if (!titleInput || !authorInput) return;
// Validate inputs if user forgot to fill

    if (titleInput.value.trim() === '' || authorInput.value.trim() === '') {
        alert('Please fill in both title and author.');
        return;
    }
// Prepare new book data
    const newBook = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        status: statusInput ? statusInput.value : 'available'
    };
// Send POST request to server
    axios.post('/api/books', newBook)
        .then(() => {
            loadBooks();
            titleInput.value = '';
            authorInput.value = '';
            if (statusInput) statusInput.value = 'available';
        })
        .catch(err => {
            console.error('Failed to add book:', err);
            alert('Failed to add book.');
        });
}
// Change book status (borrow, return, sell)

function changeStatus(bookId, newStatus) {
    axios.patch(`/api/books/${bookId}`, { status: newStatus })
        .then(() => loadBooks())
        .catch(err => {
            console.error('Failed to update status:', err);
            alert('Failed to update book status.');
        });
}
// Delete book function
function deleteBook(bookId) {
    const confirmed = window.confirm('Are you sure you want to delete this book? This action cannot be undone.');
    if (!confirmed) return;
// Send DELETE request to server;
    axios.delete(`/api/books/${bookId}`)
        .then(() => loadBooks())
        .catch(err => {
            console.error('Failed to delete book:', err);
            alert('Failed to delete book.');
        });
}

let currentEditBookId = null;

// open edit modal;
function openEditModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    currentEditBookId = bookId;
    const titleEl = document.getElementById('editTitle');
    const authorEl = document.getElementById('editAuthor');
    const statusEl = document.getElementById('editStatus');
    if (titleEl) titleEl.value = book.title || '';
    if (authorEl) authorEl.value = book.author || '';
    if (statusEl) statusEl.value = book.status || 'available';
    const modal = document.getElementById('editModal');
    if (modal) modal.style.display = 'block';
}
// close edit modal when user clicks outside or on close button

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.style.display = 'none';
    currentEditBookId = null;
}
// Save edited book details, if any details not entered it will dispplay error message;
function saveEdit() {
    if (!currentEditBookId) return;
    const title = (document.getElementById('editTitle') || {}).value || '';
    const author = (document.getElementById('editAuthor') || {}).value || '';
    const status = (document.getElementById('editStatus') || {}).value || 'available';
    if (title.trim() === '' || author.trim() === '') {
        alert('Please fill in both title and author.');
        return;
    }
// function to send PATCH request to server, if success reload books and close modal ekse show error message;
    axios.patch(`/api/books/${currentEditBookId}`, { title: title.trim(), author: author.trim(), status })
        .then(() => {
            loadBooks();
            closeEditModal();
        })
        .catch(err => {
            console.error('Failed to update book:', err);
            alert('Failed to update book.');
        });
}
// Handle action selection from dropdown check status and call respective functions;
function handleAction(selectEl, bookId) {
    const action = selectEl.value;
    selectEl.value = '';
    if (!action) return;
    switch (action) {
        case 'edit':
            openEditModal(bookId);
            break;
        case 'borrow':
            if (confirm('Mark this book as borrowed?')) changeStatus(bookId, 'borrowed');
            break;
        case 'return':
            changeStatus(bookId, 'available');
            break;
        case 'sell':
            if (confirm('Mark this book as sold? This cannot be undone.')) changeStatus(bookId, 'sold');
            break;
        case 'delete':
            deleteBook(bookId);
            break;
        default:
            console.warn('Unknown action', action);
    }
}
// Clear all filters and reset table;
function clearFilters() {
    const searchEl = document.getElementById('searchInput');
    const filterEl = document.getElementById('filterStatus');
    const sortEl = document.getElementById('sortBy');
    if (searchEl) searchEl.value = '';
    if (filterEl) filterEl.value = '';
    if (sortEl) sortEl.value = 'id';
    renderTable();
}
// Initialize event listeners for controls on search, filter, sort with debounce for search input;
function initControls() {
    const searchEl = document.getElementById('searchInput');
    const filterEl = document.getElementById('filterStatus');
    const sortEl = document.getElementById('sortBy');
    const debouncedRender = debounce(renderTable, 250);
    if (searchEl) searchEl.addEventListener('input', debouncedRender);
    if (filterEl) filterEl.addEventListener('change', renderTable);
    if (sortEl) sortEl.addEventListener('change', renderTable);
}

// Initialize controls and load data
initControls();
loadBooks();

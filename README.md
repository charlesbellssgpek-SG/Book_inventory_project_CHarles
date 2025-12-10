# Book Shop Inventory App

A simple web-based inventory management system for a bookshop built with Node.js, Express, and vanilla JavaScript.

## Features

- **Add Books**: Add new books with title, author, and status
- **Edit Books**: Modify book details (title, author, status) anytime
- **Borrow/Return**: Track book availability with borrow and return actions
- **Sell Books**: Mark books as sold
- **Persistent Storage**: All changes automatically saved to `inventory.json`
- **REST API**: Full CRUD API endpoints for programmatic access

## Project Structure

```
Book Shop Inventory Agile Charles/
├── index.html          # Main HTML markup
├── style.css           # All styling (moved from inline)
├── scripts.js          # Client-side JavaScript (moved from inline)
├── server.js           # Express.js server with API endpoints
├── inventory.json      # Book inventory data storage
├── package.json        # Node.js dependencies
├── .gitignore          # Git ignore configuration
└── README.md           # This file
```

## Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - Download from https://nodejs.org/
- **Git** - Download from https://git-scm.com/download/win

### 1. Install Git (if not already installed)
- Download from https://git-scm.com/download/win
- Run the installer with default settings
- Restart PowerShell/Command Prompt after installation

### 2. Install Dependencies
```powershell
cd "c:\Users\Lepet\Desktop\Bells\Book Shop Inventory Agile Charles"
npm install
```

### 3. Start the Server
```powershell
npm start
```

The server will start on `http://localhost:3000`

### 4. Open in Browser
```powershell
Start-Process "http://localhost:3000/index.html"
```

## Git Setup & Push to GitHub

### 1. Initialize Git Repository
```powershell
cd "c:\Users\Lepet\Desktop\Bells\Book Shop Inventory Agile Charles"
git init
git config user.email "your-email@example.com"
git config user.name "Charles"
```

### 2. Add and Commit Files
```powershell
git add .
git commit -m "Add book inventory app: Axios API, edit/borrow/return/sell features, persistent JSON storage"
```

### 3. Add GitHub Remote
```powershell
git remote add origin https://github.com/charlesbellssgpek-SG/Aglie_Frontend_With_JavaScript.git
```

### 4. Push to GitHub
```powershell
git branch -m main
git push -u origin main
```

If prompted for authentication, use your GitHub credentials or a Personal Access Token.

## API Endpoints

### GET /api/books
Fetch all books
```bash
curl http://localhost:3000/api/books
```

### GET /api/books/:id
Fetch a specific book by ID
```bash
curl http://localhost:3000/api/books/1
```

### POST /api/books
Add a new book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"New Book","author":"Author Name","status":"available"}'
```

### PATCH /api/books/:id
Update book details (title, author, status)
```bash
curl -X PATCH http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","status":"borrowed"}'
```

### DELETE /api/books/:id
Delete a book
```bash
curl -X DELETE http://localhost:3000/api/books/1
```

## Usage

1. **Add a Book**: Enter title, author, and select status, then click "Add Book"
2. **Edit a Book**: Click the "Edit" button on any book row to modify details
3. **Manage Status**: Use Borrow, Return, and Sell buttons to track inventory
4. All changes persist automatically to `inventory.json`

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Axios (for API calls)
- **Backend**: Node.js, Express.js
- **Storage**: JSON file (inventory.json)
- **Port**: 3000 (customizable via PORT environment variable)

## Troubleshooting

### Server won't start
- Ensure port 3000 is available (check `netstat -ano | findstr :3000`)
- Kill process if needed: `Stop-Process -Id <PID> -Force`

### Git commands not recognized
- Restart PowerShell after Git installation
- Or use Git Bash (installed with Git) instead

### Changes not persisting
- Ensure the server is running
- Check browser console for API errors
- Verify `inventory.json` exists in the project folder

## License

Open source, feel free to modify and use as needed.

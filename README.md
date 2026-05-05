# LostIt — Campus Lost & Found Portal

A full-stack campus lost-and-found system built with **Node.js**, **Express**, and **MongoDB**. The project includes role-based access (admin/user), JWT authentication, and a responsive UI to report, browse, and manage items.

## Features
- JWT-based login (admin/user)
- Admin-only user creation after initial bootstrap
- Users can only update/delete their own reports
- Admin can update/delete any report
- Filter and search listings by status and category
- Responsive UI for desktop and mobile

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Auth: JSON Web Tokens (JWT), bcryptjs

## Project Structure
```
Lost-and-found-portal/
├── index.html
├── styles.css
├── README.md
└── lost-and-found-backend/
	├── server.js
	├── .env
	├── package.json
	├── models/
	│   ├── Item.js
	│   └── User.js
	├── middleware/
	│   └── auth.js
	└── routes/
		├── auth.js
		└── items.js
```

## Setup

### 1) Backend Setup
```bash
cd lost-and-found-backend
npm install
```

Update [lost-and-found-backend/.env](lost-and-found-backend/.env):
```
MONGO_URI=mongodb://localhost:27017/lostandfound
PORT=3000
JWT_SECRET=change_this_secret
```

Start the server:
```bash
npm start
```

### 2) Create the First Admin (one-time)
The first admin is created without a token. After the first admin is created, only admins can create users.

**PowerShell:**
```powershell
$body = @{ username = 'admin1'; password = 'AdminPass123'; role = 'admin' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register -ContentType 'application/json' -Body $body
```

### 3) Frontend Setup
Open [index.html](index.html) in a browser or run a static server:

```bash
npx http-server .
```

Then visit `http://localhost:8080` (or the URL shown in the terminal).

## API Summary

### Auth
- `POST /api/auth/login` → returns JWT token
- `POST /api/auth/register` → creates user (admin only, except first admin bootstrap)

### Items
- `GET /api/items` → public list
- `POST /api/items` → authenticated user creates report
- `PUT /api/items/:id` → owner or admin updates
- `DELETE /api/items/:id` → owner or admin deletes

## Security Notes
- JWT tokens are stored in `sessionStorage` on the client.
- The server verifies tokens and enforces ownership checks on update/delete.

## Demo Workflow
1. Create the first admin using the PowerShell command above.
2. Log in as admin to access the Admin Panel.
3. Create new users from Admin Panel.
4. Log in as a user to report and manage your own items.

## Author
Prefinal Year Student Project — Campus Lost & Found Portal
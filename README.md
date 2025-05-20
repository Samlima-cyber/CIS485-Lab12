# Lab 12: Response Codes and Error Handling

**Course:** CIS 485 - Web Programming II  
**Student:** Sam Lima  

## 🧠 Objective

This lab builds on Lab 11 by introducing:

- Form validation and `400 Bad Request` handling
- Dynamic routing with URL parameters (`/candidate/:id`)
- Proper error responses: `400`, `404`, and `500`
- Global error handling middleware

---

## 🚀 Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node server.js
```

3. Test in browser:
- [http://localhost:3000/add-candidate](http://localhost:3000/add-candidate)
- [http://localhost:3000/candidates](http://localhost:3000/candidates)
- [http://localhost:3000/candidate/1](http://localhost:3000/candidate/1)

---

## 📌 Routes

### `GET /add-candidate`
Renders a form to submit a new candidate.

### `POST /add-candidate`
Validates inputs. If any field is missing, returns a `400 Bad Request`. Otherwise, stores candidate and redirects.

### `GET /candidates`
Displays all candidates in styled boxes.

### `GET /candidate/:id`
Displays details for a specific candidate. Returns:
- `400` for non-numeric ID
- `404` for not found

### Global Error Handler
Returns a `500 Internal Server Error` page for unhandled exceptions.

---

## ✅ Folder Structure

```
Lab12/
├── candidate-lab/
│   ├── server.js
│   ├── candidates.json
├── package.json
└── node_modules/
```

---

## 🧪 Sample curl Tests

**Valid ID:**
```bash
curl http://localhost:3000/candidate/1
```

**Invalid ID:**
```bash
curl http://localhost:3000/candidate/999
```

**Bad POST Request (missing fields):**
```bash
curl.exe --% -X POST http://localhost:3000/add-candidate -H "Content-Type: application/json" -d "{"name":"John Doe"}"
```

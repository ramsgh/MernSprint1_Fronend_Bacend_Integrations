# Day 31: Express.js Middleware Complete Guide

## 📌 What is Middleware?
In Express.js, **middleware** functions execute in sequence during the request-response cycle.

```
Request (req)  --->  [ Middleware 1 ]  --->  [ Middleware 2 ]  --->  [ Route Handler ]  --->  Response (res)
```

Each middleware receives 3 arguments: `req`, `res`, and `next`.

---

## 🛠️ Types of Middleware Covered in this Project

### 1. Built-in Middleware
* **`express.json()`**: Parses incoming JSON request bodies into `req.body`.
* **`express.static('public')`**: Serves static HTML, CSS, and JS files directly.

### 2. Custom Middleware
* **`customLogger`**: Attaches a `requestTime` timestamp to `req` and logs request details.
* **`authCheck`**: Validates the presence of `x-api-key: secret123` in headers. If missing, blocks access with `401 Unauthorized`.

### 3. Third-Party Middleware
* **`cors`**: Enables Cross-Origin Resource Sharing.
* **`morgan`**: Formats and logs HTTP request activity to terminal.
* **`helmet`**: Configures security headers for protection against common web attacks.

### 4. Error Handling Middleware
* Takes **4 parameters**: `(err, req, res, next)`.
* Placed at the **very end** of the middleware pipeline to catch errors passed via `next(err)`.

---

## 🚀 How to Run in VS Code

1. Extract this zip file and open the folder in **VS Code**.
2. Open terminal and run:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

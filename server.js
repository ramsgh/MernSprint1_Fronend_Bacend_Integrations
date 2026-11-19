/**
 * DAY 31: EXPRESS MIDDLEWARE COMPLETE DEMONSTRATION
 * 
 * CORE CONCEPT: What is Middleware?
 * Request (req) ---> [ Middleware 1 ] ---> [ Middleware 2 ] ---> [ Route Handler ] ---> Response (res)
 * 
 * Each middleware function receives (req, res, next):
 *  1. Performs task (logging, security, parsing)
 *  2. Can attach properties to req/res
 *  3. Calls next() to pass control to the next middleware in the chain!
 *  4. Or ends the response directly (res.send / res.json)
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// 1. THIRD-PARTY MIDDLEWARE (Runs for all requests)
// ============================================================================

// Helmet: Automatically adds security HTTP headers
app.use(helmet());

// CORS: Enables Cross-Origin Resource Sharing
app.use(cors());

// Morgan: Logs incoming HTTP request details to the terminal console
app.use(morgan('dev'));


// ============================================================================
// 2. BUILT-IN MIDDLEWARE
// ============================================================================

// express.json(): Parses JSON request body into req.body
app.use(express.json());

// express.static(): Serves static HTML/CSS/Images from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


// ============================================================================
// 3. CUSTOM MIDDLEWARE
// ============================================================================

// Custom Logger Middleware
const customLogger = (req, res, next) => {
  req.requestTime = new Date().toISOString(); // Attach custom data to req
  console.log(`[CUSTOM LOG] ${req.method} request to ${req.url} at ${req.requestTime}`);
  next(); // Pass control to the next middleware in the chain!
};

app.use(customLogger);

// Custom Auth Check Middleware (Guard)
const authCheck = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === 'secret123') {
    next(); // Valid API Key! Proceed to the route handler
  } else {
    // Stop the chain and return a 401 Unauthorized response
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid x-api-key header'
    });
  }
};


// ============================================================================
// 4. ROUTES (Demonstrating Pipeline Order)
// ============================================================================

// Public Route (No Auth required)
app.get('/api/public', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Public API Route!',
    requestedAt: req.requestTime
  });
});

// Protected Route (Applies authCheck specifically to this route)
app.get('/api/protected', authCheck, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Protected API Route! Your API key is valid.',
    requestedAt: req.requestTime
  });
});

// Test Route to Trigger Error Handling
app.get('/api/error-test', (req, res, next) => {
  const err = new Error('Database connection failed unexpectedly!');
  err.statusCode = 500;
  next(err); // Passing an error argument to next() jumps straight to Error Middleware!
});


// ============================================================================
// 5. ERROR HANDLING MIDDLEWARE (MUST BE PLACED AT THE VERY END)
// ============================================================================

// Error middleware requires 4 parameters: (err, req, res, next)
const globalErrorHandler = (err, req, res, next) => {
  console.error('🔥 Global Error Handler Caught:', err.message);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode
    }
  });
};

app.use(globalErrorHandler);


// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📄 Static Homepage: http://localhost:${PORT}`);
  console.log(`🌐 Public API: http://localhost:${PORT}/api/public`);
  console.log(`🔐 Protected API: http://localhost:${PORT}/api/protected (Header x-api-key: secret123)`);
  console.log(`💥 Error Test: http://localhost:${PORT}/api/error-test\n`);
});

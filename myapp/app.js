const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.json());

// Setting up session middleware
app.use(session({
  secret: 'yourSecretKey', // Replace 'yourSecretKey' with a real secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.status(401).send('Not authenticated');
}

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Here, you should validate the username and password against your user store
  // This is just a simple example
  if (username === 'user' && password === 'pass') {
    req.session.isAuthenticated = true;
    res.send('Logged in successfully');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Protected route example
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('Welcome to your dashboard');
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(400).send('Unable to log out');
    }
    res.send('Logout successful');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

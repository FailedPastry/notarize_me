const express = require('express');
const session = require('express-session');

const app = express();
const PORT = process.env.Port || 3000;

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
  if (username === 'user' && password === 'pass') {
    req.session.isAuthenticated = true;
    res.send('Logged in successfully');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Protected route that requires authentication
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

const sequelize = require('./sequelize'); // Adjust the path as necessary
const User = require('./user'); // Adjust the path to your User model

// Sync all models with the database
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch((error) => {
  console.error('Failed to synchronize database:', error);
});

const bcrypt = require('bcrypt');
const User = require('./user'); // Adjust the path to your User model

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Error creating user');
  }
});

const bcrypt = require('bcrypt');
const User = require('./user'); // Adjust the path to your User model

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    // Authentication successful
    req.session.isAuthenticated = true;
    res.send('Logged in successfully');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error logging in');
  }
});

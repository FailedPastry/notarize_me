
const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SESSION_SECRET || 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

app.use(session(sess));

const hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views', 'partials'),
  views: path.join(__dirname, 'views') // Specify the views directory
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

// Check if the user is authenticated
function isAuthenticated(req) {
  return req.session.authenticated;
}

// Route to render the main HTML page
app.get('/', (req, res) => {
  if (isAuthenticated(req)) {
    res.render('editdraft'); // Render the editdraft partial if authenticated
  } else {
    res.render('home'); // Render the home view if not authenticated
  }
});


// Route for user login
app.post('/login', (req, res) => {
  // Perform authentication logic here
  // For example, check credentials and set session variables
  req.session.authenticated = true;
  res.redirect('/');
});

// Route for user logout
app.get('/logout', (req, res) => {
  req.session.authenticated = false;
  res.redirect('/');
});

// Route to render the create account page
app.get('/create', (req, res) => {
  res.render('create'); // Render the create account partial
});

app.get('/', (req, res) => {
  

  res.render('partials/editdraft'); // Render the main Handlebars template
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

// Express route for user signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Save user data to MongoDB using Mongoose
  const newUser = new User({ username, email, password });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});



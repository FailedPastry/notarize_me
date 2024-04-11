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
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('handlebars', hbs.engine); // Use hbs.engine as the callback function

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

// Check if the user is authenticated
function isAuthenticated(req) {
  return req.session.authenticated;
}

// Define a route for rendering the 'editdraft' page

//Route to render the main HTML page
app.get('/', (req, res) => {
  if (isAuthenticated(req)) {
    res.render('home'); // Render the main section if authenticated
  } else {
    res.render('login'); // Render the login partial if not authenticated
  }
});

// Handle login POST request
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Find user by email in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  // Validate password
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  // Generate and return a JWT token for authentication
  const token = generateToken(user); // You need to implement this function
  res.json({ token });
});
// Route for user login
app.post('/login', (req, res) => {
  req.session.authenticated = true;
  res.redirect('/');
});

// Route for user logout
app.get('/logout', (req, res) => {
  req.session.authenticated = false;
  res.redirect('/');
});

// Route to render the create account page
app.get('/create',  (req, res) => {
 console.log('Create Account')
  res.render('create'); // Render the create account partial
});
app.post('/signup', (req, res) => {
  // Logic for handling signup (saving user data, etc.)

  // Redirect to the 'editdraft' page after successful signup
  res.redirect('/editdraft');
});
// Define a route for '/editdraft'
app.get('/editdraft', (req, res) => {
  // Logic for rendering the 'editdraft' page
  res.render('editdraft'); // Render the 'editdraft' view using your template engine
});

app.post('/submitForm', async (req, res) => {
  try {
    const { documentName, firstName, lastName, email, signatureData } = req.body;

    // Save form data to the database using Sequelize
    await FormData.create({ documentName, firstName, lastName, email, signatureData });

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving form data' });
  }
});






app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

//Express route for user signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Save user data to MongoDB using Mongoose
  const newUser = new User({ username, email, password });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});
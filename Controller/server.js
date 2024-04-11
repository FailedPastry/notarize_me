const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const User = require('../models/User');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Handlebars setup
const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
// Include your controllers
app.use('/auth', authController);
app.use('/user', userController);

/ Check if the user is authenticated
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






//Express route for user signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Save user data to MongoDB using Mongoose
  const newUser = new User({ username, email, password });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT} and create an account!`
    )
  );
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
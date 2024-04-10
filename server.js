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

// Create an instance of express-handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views', 'partials') // Define the partials directory
});

// Set Handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Check if the user is authenticated
function isAuthenticated(req) {
  return req.session.authenticated;
}

// Route to render the main HTML page
// app.get('/', (req, res) => {
//   if (isAuthenticated(req)) {
//     res.render('layouts/main'); // Render the main section if authenticated
//   } else {
//     res.render('login'); // Render the login page if not authenticated
//   }
// });

// // Route for user login
// app.post('/login', (req, res) => {
//   // Perform authentication logic here
//   // For example, check credentials and set session variables
//   req.session.authenticated = true;
//   res.redirect('/');
// });

// // Route for user logout
// app.get('/logout', (req, res) => {
//   req.session.authenticated = false;
//   res.redirect('/');
// });
//Route to render the main HTML page
app.get('/', (req, res) => {
  res.render('layouts/main'); // Update the path to match your actual file structure
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
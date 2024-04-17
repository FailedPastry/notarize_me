
const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views', 'partials'),
  views: path.join(__dirname, 'views') // Specify the views directory
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
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
    res.render('login'); // Render the login view if not authenticated
  }
});
// Route for user login
app.post('/login', async (req, res) => {
  // Your login code here
});

// Route to render the login page
app.get('/login', (req, res) => {
  // Render the login page
  res.render('login');
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

// Route for user signup
app.post('/signup', async (req, res) => {
  // Implement user signup logic here
  // After successful signup, redirect the user to the main page
  res.redirect('/editdraft');
});

// Route to render the main HTML page
// app.get('/', (req, res) => {
//   res.render('editdraft'); // Render the editdraft partial
// });

// Route to render the editdraft page
app.get('/editdraft', (req, res) => {
  // Check if the user is authenticated
  if (isAuthenticated(req)) {
    // If authenticated, render the editdraft page
    res.render('editdraft');
  } else {
    // If not authenticated, redirect to the login page
    res.redirect('/login');
  }
});





 // Allow CORS requests from localhost for development purposes
 const allowedOrigins = ['http://localhost:*'];

 app.use(cors({
   origin: allowedOrigins,
 }));

app.options('*', cors());

/*app.get('/upload', (req, res) => {
  res.json(repos);
});
*/

app.get('/upload', (req, res) => {
  res.send('This is the upload endpoint');
});


// app.get('/upload', (req, res) => {
// res.sendFile(path.join(__dirname, 'index.html'));
// }); 


app.post('/upload',
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(['.png', '.jpg', '.jpeg']),
  fileSizeLimiter,
  async (req, res) => {
  try {
    const files = req.files;

    const movePromises = [];
    Object.keys(files).forEach(key => {
      if (files[key]) {
        const filepath = path.join(__dirname, 'files', files[key].name);
        movePromises.push(files[key].mv(filepath));
        console.log(files[key].name);
        console.log(files[key].size);
      }
    });

    await Promise.all(movePromises);

    return res.json({ status: 'success', message: Object.keys(files).toString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: err });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
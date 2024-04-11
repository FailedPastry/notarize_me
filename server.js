
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

app.use(express.static(path.join(__dirname, 'public')));

// Check if the user is authenticated
function isAuthenticated(req) {
  return req.session.authenticated;
}

// Route to render the main HTML page
app.get('/', (req, res) => {
  res.render('editdraft'); // Render the editdraft partial
});

// app.get('/', (req, res) => {
//    {
//     res.render('editdraft'); // Render the editdraft partial if authenticated
//   } else {
//     res.render('home'); // Render the home view if not authenticated
//   }
// });


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



// Express route for user signup
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Save user data to MongoDB using Mongoose
  const newUser = new User({ username, email, password });
  await newUser.save();
  
  res.status(201).json({ message: 'User registered successfully' });
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
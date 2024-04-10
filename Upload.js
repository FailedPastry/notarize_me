const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/filesSizeLimiter');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

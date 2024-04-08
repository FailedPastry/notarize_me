const express = require('express');
const path = require('path');
const cors = require('cors'); 
const fileUpload = require('express-fileupload'); 

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/filesSizeLimiter');

const PORT = process.env.PORT || 8000;
const app = express();

const allowedOrigins = ['http://localhost:8000'];

app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['POST'] 
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', 
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(['.png', '.jpg', '.jpeg']),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files
    console.log(files)

    Object.keys(files).forEach(key => {
      const filepath = path.join(__dirname, 'files', files[key].name)
      files[key].mv(filepath, (err) => {
        if (err) return res.status(500).json({ status: "error", message: err })
    })
})

return res.json({ status: 'success', message: Object.keys(files).toString() })
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


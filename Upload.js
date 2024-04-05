const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ storage });

  app.post('/upload-document', upload.single('document'), (req, res) => {
    if (req.file) {
      console.log("Document uploaded:", req.file.filename);
      res.json({ message: "Document uploaded successfully!" });
    } else {
      res.status(400).json({ message: "Error uploading document!" });
    }
  });
  const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Server listening on port ${port}`));
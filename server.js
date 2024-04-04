// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notarizeme', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for user information
const userSchema = new mongoose.Schema({
  documentName: String,
  firstName: String,
  lastName: String,
  email: String,
  signature: String
});
const User = mongoose.model('User', userSchema);

// Handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    const { documentName, firstName, lastName, email, signature } = req.body;
    const user = new User({ documentName, firstName, lastName, email, signature });
    await user.save();
    res.status(200).send('Form submitted successfully!');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

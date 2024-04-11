// controllers/userController.js

const User = require('../models/User'); // Import your User model

const userController = {
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add more controller functions as needed
};

module.exports = userController;

// controllers/postController.js

const Post = require('../models/Post'); // Import your Post model

const postController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add more controller functions as needed
};

module.exports = postController;

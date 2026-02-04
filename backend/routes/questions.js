// backend/routes/questions.js

const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// GET single question by ID
// Using '/single/:id' to avoid conflict with '/:categoryId'
router.get('/single/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('user', 'username');
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (err) {
    console.error('Error fetching single question:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all questions in a specific category (chronological order, newest first)
router.get('/:categoryId', async (req, res) => {
  try {
    const questions = await Question.find({ category: req.params.categoryId })
      .sort({ createdAt: -1 })
      .populate('user', 'username');
    
    res.json(questions);
  } catch (err) {
    console.error('Error fetching category questions:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - Create a new question (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }
    
    const question = new Question({
      title,
      content,
      user: req.user.id,
      category,
    });
    
    await question.save();
    
    // Optionally populate user for the response
    await question.populate('user', 'username');
    
    res.status(201).json(question);
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
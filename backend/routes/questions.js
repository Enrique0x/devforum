const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:categoryId', async (req, res) => {
  const questions = await Question.find({ category: req.params.categoryId })
    .sort({ createdAt: -1 })
    .populate('user', 'username');
  res.json(questions);
});

router.post('/', auth, async (req, res) => {
  const { title, content, category } = req.body;
  const question = new Question({ title, content, user: req.user.id, category });
  await question.save();
  res.status(201).json(question);
});

module.exports = router;
const express = require('express');
const Answer = require('../models/Answer');
const auth = require('./authMiddleware');

const router = express.Router();

router.get('/:questionId', async (req, res) => {
  const answers = await Answer.find({ question: req.params.questionId })
    .sort({ createdAt: -1 })
    .populate('user', 'username');
  res.json(answers);
});

router.post('/', auth, async (req, res) => {
  const { content, question } = req.body;
  const answer = new Answer({ content, user: req.user.id, question });
  await answer.save();
  res.status(201).json(answer);
});

module.exports = router;
const express = require('express');
const Category = require('../models/Category');
const auth = require('./authMiddleware');  // See below for auth middleware

const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

module.exports = router;
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Question = require('./models/Question');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Question.deleteMany({});

  const user = new User({ username: 'testuser', password: 'password123', email: 'test@example.com' });
  await user.save();

  const categories = await Category.insertMany([
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'Node.js' },
  ]);

  await Question.insertMany([
    { title: 'What is closures?', content: 'Explain closures in JS.', user: user._id, category: categories[0]._id },
    { title: 'How to use hooks?', content: 'Best practices for React hooks.', user: user._id, category: categories[1]._id },
  ]);

  console.log('Seeded data');
  process.exit();
}

seed();
const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const User = require('../models/User');
const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return res.redirect('/codechef/login'); 
  }

  try {
    const decoded = jwt.verify(token, 'abcdefgh'); 
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next(); 
  } catch (err) {
    console.error('Error verifying token', err);
    return res.status(401).send('Unauthorized');
  }
};

router.get('/assigned', verifyToken, async (req, res) => {
  try {
    const user = (await User.findById(req.userId)).username;
    const tasks = await Task.find({assignedto: user});
    res.render('tasks/assigned_tasks', { tasks });
  } catch (err) {
    console.error('Error fetching tasks from MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/pending', verifyToken, async (req, res) => {
  try {
    const user = (await User.findById(req.userId)).username;
    const tasks = await Task.find({status: 'Pending', assignedto: user});
    res.render('tasks/pending_tasks', { tasks });
  } catch (err) {
    console.error('Error fetching tasks from MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/completed', verifyToken, async (req, res) => {
  try {
    const user = (await User.findById(req.userId)).username;
    const tasks = await Task.find({status: 'Completed', assignedto: user});
    res.render('tasks/completed_tasks', { tasks });
  } catch (err) {
    console.error('Error fetching tasks from MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/new', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render('tasks/new');
  } catch (err) {
    console.error('Error fetching tasks from MongoDB', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/new', async (req, res) => {
  const { title, description, dueDate, assignedto, status } = req.body;
  const currentDate = new Date();

  const newTask = new Task({
    title,
    description,
    dueDate,
    assignedto,
    currentDate,
    status,
  });

  try {
    await newTask.save();
    res.redirect('/codechef/tasks/new');
  } catch (err) {
    console.error('Error creating task', err);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;


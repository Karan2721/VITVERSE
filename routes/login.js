const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.get('/', (req, res) => {
  res.render('login');
});

router.get('/redirect', (req, res) => {
  res.redirect('/codechef/login');
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Account not found' });
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      const payload = {
        userId: user._id,
        accessLevel: user.role,
      };
      const token = jwt.sign(payload, 'abcdefgh');
      res.cookie('token', token, { httpOnly: true });
      const decoded = jwt.verify(token, 'abcdefgh');
      req.userRole = decoded; 
      if(req.userRole.accessLevel === '2'){
      return res.redirect('/codechef/tasks/assigned');
      }
      else if(req.userRole.accessLevel === '1'){
        return res.redirect('/codechef/tasks/new');
      }
    } 
    else 
    {
      return res.render('login', { error: 'Incorrect Password' });
    }
  } catch (err) {
    console.error('Error authenticating user', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

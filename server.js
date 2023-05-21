const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const middleware = require('./middleware');
const tasksRouter = require('./routes/tasks');
const loginRoute = require('./routes/login');
const cookieParser = require('cookie-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/codechef/login', loginRoute);
app.use('/codechef/tasks', tasksRouter);

mongoose.connect('mongodb://127.0.0.1:27017/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/codechef/register', (req,res) => {
  res.render('register');
});

app.post('/codechef/register', async (req, res) => {
  const {name, username, password, domain, mentor, role} = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.render('register', { error: 'Username already exists' });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      domain,
      mentor,
      role,
    });
    await newUser.save();

    res.redirect('/codechef/register');
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/codechef/register', (req, res) => {
  res.render('/codechef/register');
});

app.get("/codechef/events", (req,res) => {
  res.render("club_profile_events");
});

app.get("/codechef/announcements", (req,res) => {
  res.render("club_profile_announcements");
});

app.get("/codechef/members", (req,res) => {
  res.render("club_profile_members");
});

app.get('/codechef/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/codechef/login');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

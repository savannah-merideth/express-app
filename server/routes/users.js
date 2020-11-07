const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const { JwtService } = require('../services');
// const JwtService = require('../services/jwt.service');


// grab the User model from the models folder, the sequelize
// index.js file takes care of the exporting for us and the
// syntax below is called destructuring, its an es6 feature
const { User } = require('../models');
const { UsersManager } = require('../controllers');


async function get_token(user) {
  if (!user)
    throw new Error('User not found');

  if (typeof user === 'string') {
    user = await UsersManager.findOne(user);
    if (!user)
      throw new Error('User not found');
  } else if (typeof user === 'number') {
    user = await UsersManager.findById(user);
    if (!user)
      throw new Error('User not found');
  }

  var roles = user.roles;
  if (!roles || roles.length === 0)
    roles = await user.getRoles();

  var data = roles.map((role, index) => {
    return role.dataValues;
  });

  let payload = { user: user.username, roles: data };
  return { token: JwtService.sign(payload) };
};


router.get('/register', (req, res) => res.render('register', { user: req.user }));


/* Register Route
========================================================= */
router.post('/register', async (req, res) => {

  const { email, username, password } = req.body;
  // if the username / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!email || !password) {
    return res.status(400).send('Request missing username or password param'
    );
  }

  if (!username)
    username = email;

  try {
    let user = await User.create(req.body);
    if (!user)
      throw new Error('Can not create user');
    let data = await get_token(user);

    res.cookie('auth_token', data.token,
      {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours,
        // You can't access these tokens in the client's javascript
        httpOnly: true
      });

    // send back the new user and auth token to the
    // client { user, authToken }
    return res.json(data);

  } catch (err) {
    return res.status(400).send(err);
  }

});

/* Login Route
========================================================= */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // if the username / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!username || !password) {
    return res.status(400).send(
      'Request missing username or password param'
    );
  }

  try {
    let user = await UsersManager.authenticate(username, password);
    if (!user)
      throw new Error('User not found');
    let data = await get_token(user);

    res.cookie('auth_token', data.token,
      {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours,
        // You can't access these tokens in the client's javascript
        httpOnly: true
      });

    return res.json(data);

  } catch (err) {
    console.log('Error', err.message);
    return res.status(400).send('Invalid username or password');
  }

});

/* Logout Route
========================================================= */
router.get('/logout', async (req, res) => {

  const bearer = req.header('Authorization') || '';
  var token = bearer.split(' ')[1];
  if (!token)
    token = req.cookies.auth_token;
  const is_logout = JwtService.logout(token);
  if (is_logout)
    return res.status(204).send();

  // if the user missing, the user is not logged in, hence we
  // use status code 400 indicating a bad request was made
  // and send back a message
  return res.status(400).send({ errors: [{ message: 'Not authenticated' }] });
});

// export the router so we can pass the routes to our server
module.exports = router;
const express = require('express');
const path = require('path');
const router = express.Router();
var public = path.join(__dirname, './public');
const { JwtMiddleware } = require('../middleware');

/* GET home page. */
router.get('/', (req, res, next) => {
  // res.redirect('/books')
  res.sendFile(path.join(public, 'index.html'));
});

router.get('/contact', (req, res, next) => {
  res.send('Contact page');
});

/* Me Route - get the currently logged in user
========================================================= */
router.get('/me', JwtMiddleware.verify, async (req, res) => {
  if (req.user) {
    return res.send(req.user);
  }
  res.status(404).send(
    { errors: [{ message: 'missing auth token' }] }
  );
});


module.exports = router;

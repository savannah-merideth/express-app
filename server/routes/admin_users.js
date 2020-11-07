'use strict';

const express = require('express');
const router = express.Router();

const { UsersController } = require('../controllers');
const { JwtMiddleware } = require('../middleware');

router.route('/')
  .get(JwtMiddleware.hasRole('ADMIN'), UsersController.list)
  .post(JwtMiddleware.hasRole('ADMIN'), UsersController.create);

router.route('/:id')
  .head(JwtMiddleware.hasRole('ADMIN'), UsersController.exists)
  .get(JwtMiddleware.hasRole('ADMIN'), UsersController.find)
  .put(JwtMiddleware.hasRole('ADMIN'), UsersController.replace)
  .patch(JwtMiddleware.hasRole('ADMIN'), UsersController.update)
  .delete(JwtMiddleware.hasRole('ADMIN'), UsersController.delete);

module.exports = router;
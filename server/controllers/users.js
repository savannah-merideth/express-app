'use strict';

const { UsersManager } = require('./users_manager');

class UsersController {

  constructor() { }

  async list(req, res) {
    try {
      var users = await UsersManager.findAll();
      return res.status(200).send(users)
    } catch (error) {
      return res.status(400).send({ error: "Error get list users" })
    }
  }

  async create(req, res) {
    let user = req.body;

    try {
      user = await UsersManager.save(user);
      user = await UsersManager.findById(user.dataValues.id);
      if (user)
        return res.status(201).send(user)
      else throw err;
    } catch (error) {
      return res.status(400).send({ error: "Error creating new user" })
    }
  }

  async exists(req, res) {
    const id = req.params.id;

    try {
      var count = await UsersManager.exists(id);
      if (count > 0)
        return res.status(204).send();
      else
        throw err;
    } catch (error) {
      return res.status(404).send({ error: 'User id not found' })
    }
  }

  async find(req, res) {
    const id = req.params.id;
    try {
      var user = await UsersManager.findById(id);
      user = await UsersManager.findById(user.dataValues.id);
      if (user)
        return res.status(200).send(user)
      else throw err;
    } catch (error) {
      return res.status(404).send({ error: `User with id ${id} not found` })
    }
  }

  async replace(req, res) {
    const id = req.params.id;
    return res.status(200).send({ message: `Replaced user with id ${id}` });
  }

  async update(req, res) {
    const id = req.params.id;
    return res.status(200).send({ message: `Updated user with id ${id}` });
  }

  async delete(req, res) {
    const id = req.params.id;

    const user = await UsersManager.findById(id);
    await user.destroy();
    return res.status(200).send({ message: `Deleted user with id ${id}` });
  }
}

module.exports = new UsersController();
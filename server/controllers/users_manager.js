'use strict';

const { User, Role } = require('../models');

class UsersManager {

  constructor() {
  }

  async findAll() {
    return await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role'],
        through: { attributes: [] }
      }],
      attributes: {
        exclude: ['id', 'password']
      }
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role'],
        through: { attributes: [] }
      }],
      attributes: {
        exclude: ['id', 'password']
      }
    });
  }

  async findOne(username) {
    return await User.findOne({
      where: { username: username },
      include: [{
        model: Role, as: 'roles', attributes: ['role'],
        through: { attributes: [] }
      }]
    });
  }

  async save(data) {
    try {
      return await User.build(data).save();
    } catch(error) {
      throw (error);
    }
  }

  async exists(id) {
    return await User.count({
      where: { id: id }
    });
  }

  async authenticate(username, password) {
    var user = await this.findOne(username);
    if (!user)
      throw new Error('User not found');
    var is_valid = await user.validPassword(password);
    if (is_valid)
      return user;
    else
      throw new Error('Invalid password');
  }
}

module.exports = new UsersManager();
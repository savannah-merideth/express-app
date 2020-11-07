
const { UsersManager } = require('../controllers');
require('dotenv').config({ path: './dev.env' });
const { Role } = require('../models');

class SeedService {

  constructor() { }

  async create_data() {

    var user = null;
    try {
      user = await UsersManager.findOne('admin');
    } catch (e) {
      // Deal with the fact the chain failed
      console.log(e)
    }

    if (!user) {
      user = await UsersManager.save({ email: process.env.admin_email || 'admin@app.test.repl', username: 'admin', password: process.env.admin_pass || 'admin' })
    }

    var roles = user.roles;
    if (!roles || roles.length === 0)
      roles = await user.getRoles();

    if (!roles || roles.length === 0) {
      var role = null;
      try {
        role = await Role.admin_role();
      } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
      }

      var a = await user.addRoles([role]);
      // console.log('a', a);
      roles = await user.getRoles();
    }

    //console.log('roles', roles);
  }
}

module.exports = new SeedService();
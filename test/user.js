
var db = require('../models'); // import Sequelize

// const jwt = require('../services').JwtService;
const { JwtService } = require('../services');
const { UsersManager } = require('../controllers');


(async () => {
  await db.sequelize.sync({ logging: false });

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
      role = await db.Role.admin_role();
    } catch (e) {
      // Deal with the fact the chain failed
      console.log(e);
    }

    var a = await user.addRoles([role]);
    // console.log('a', a);
    roles = await user.getRoles();
  }

  //console.log(user);
  //console.log(user.roles);
  console.log(roles);

  
  var x = await UsersManager.get_token(user);
  console.log(x.token);
  
  var legit = JwtService.verify(x.token);
  console.log("\nJWT verification result: " + JSON.stringify(legit));

  var decoded = JwtService.decode(x.token);
  console.log("\nDecoded jwt: " + JSON.stringify(decoded));
  
})();

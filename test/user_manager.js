
var db = require('../models'); // import Sequelize
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

  var roles = user.roles.map((role, index) => {
    return role.dataValues;
  });
  console.log(roles);

  //console.log(user);
  //console.log(user.roles);
})();

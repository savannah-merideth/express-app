
var db = require('../models'); // import Sequelize

(async () => {
  await db.sequelize.sync({ logging: false });

  var role = null;
  try {
    role = await db.Role.admin_role('ADMIN');
  } catch (e) {
    // Deal with the fact the chain failed
    console.log(e)
  }

  console.log(role);
})();

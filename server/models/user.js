const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
      tableName: 'Users',
      hooks: {
        beforeCreate: async (user, options) => {
          /*const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);*/
          console.log('hash pass', user.password);
          user.password = await bcrypt.hash(user.password, saltRounds);
          console.log('hashed pass', user.password);
        }
      },
      instanceMethods: {
        //define more
      }
    });

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }

  User.prototype.logout = async function(token) {
  };


  // set up the associations so we can make queries that include
  // the related objects
  User.associate = function({ Book, Role }) {
    User.hasMany(Book);

    User.belongsToMany(Role, {
      through: 'UserRole',
      as: 'roles',
      foreignKey: 'userId'
    });
  };

  return User;
};
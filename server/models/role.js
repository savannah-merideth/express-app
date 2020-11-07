'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    role: {
      type: DataTypes.STRING,
      field: 'role',
      allowNull: false,
      unique: true
    },
    summary: DataTypes.STRING,
  }, {
      tableName: 'Roles',
      timestamps: false
    });

  Role.admin_role = async function(name) {
    var role = name || 'ADMIN';
    var existed = await Role.findOne({
      where: { role }
    });
    if (!existed)
      existed = await Role.create({ role, summary: 'Master role' });
    return existed
  };

  Role.associate = function({ User }) {
    Role.belongsToMany(User, {
      through: 'UserRole',
      as: 'users',
      foreignKey: 'roleId'
    });
  };


  return Role;
};
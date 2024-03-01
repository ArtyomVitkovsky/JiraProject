module.exports = (sequelize, Sequelize) => {
  const UsersUpdateRoleRequests = sequelize.define('UsersUpdateRoleRequests', {
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    target_role_type: {
      type: Sequelize.STRING(32)
    },
    message: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: true
  });

  UsersUpdateRoleRequests.associate = (models) => {
    UsersUpdateRoleRequests.belongsTo(models.Users, { foreignKey: 'user_id' })
  }

  return UsersUpdateRoleRequests;
};
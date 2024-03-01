module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define('Users', {
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING(32)
    },
    password: {
      type: Sequelize.STRING(32)
    },
  }, {
    timestamps: true
  });

  Users.associate = (models) => {
    Users.hasOne(models.Employees, { foreignKey: 'user_id' })
    Users.belongsTo(models.UserRoles, { foreignKey: 'user_role_id' })
    Users.hasMany(models.Projects, { foreignKey: 'project_manager_id' });
    Users.hasMany(models.UsersUpdateRoleRequests, { foreignKey: 'user_id' });
    Users.hasMany(models.Tasks, { foreignKey: 'project_manager_id' });

  }

  return Users;
};
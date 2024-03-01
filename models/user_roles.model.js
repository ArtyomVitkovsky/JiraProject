module.exports = (sequelize, Sequelize) => {
    const UserRoles = sequelize.define('UserRoles', {
      id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      role_type: {
        type: Sequelize.STRING(32)
      }
    }, {
      timestamps: true
    });
  
    UserRoles.associate = (models) => {
        UserRoles.hasMany(models.Users, { foreignKey: 'user_role_id' })
    }
  
    return UserRoles;
  };
module.exports = (sequelize, Sequelize) => {
  const Tasks = sequelize.define('Tasks', {
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    task_name: {
      type: Sequelize.STRING
    },
    task_description: {
      type: Sequelize.STRING
    },
    column_index: {
      type: Sequelize.INTEGER
    },
    estimated_hours: {
      type: Sequelize.INTEGER
    },
    logged_hours: {
      type: Sequelize.INTEGER
    }
  });

  Tasks.associate = (models) => {
    Tasks.hasMany(models.Timesheets, { foreignKey: 'task_id' });
    
    Tasks.belongsTo(models.Employees, { foreignKey: 'employee_id' });
    Tasks.belongsTo(models.Users, { foreignKey: 'project_manager_id' });
    Tasks.belongsTo(models.Projects, { foreignKey: 'project_id' });
    Tasks.belongsTo(models.TaskTypes, { foreignKey: 'task_type_id' });
  }

  return Tasks;
};


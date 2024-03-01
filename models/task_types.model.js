module.exports = (sequelize, Sequelize) => {
  const TaskTypes = sequelize.define('TaskTypes', {
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    task_type: {
      type: Sequelize.STRING
    },
  });

  TaskTypes.associate = (models) => {
    TaskTypes.hasMany(models.Tasks, { foreignKey: 'task_type_id' });
  }

  return TaskTypes;
};


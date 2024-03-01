module.exports = (sequelize, Sequelize) => {
  const EmployeeStates = sequelize.define("EmployeeStates", {
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    employee_state_type: {
      type: Sequelize.STRING
    },
  });

  EmployeeStates.associate = (models) => {
    EmployeeStates.hasMany(models.Employees, { foreignKey: 'employee_state_id' });
  }

  return EmployeeStates;
};


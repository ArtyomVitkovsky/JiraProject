module.exports = (sequelize, Sequelize) => {
  const Employees = sequelize.define('Employees', {
    id: {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
  });

  Employees.associate = (models) => {
    Employees.hasMany(models.Timesheets, { foreignKey: 'employee_id' });
    Employees.hasMany(models.Tasks, { foreignKey: 'employee_id' });
    Employees.hasMany(models.ProjectsEmployees, { foreignKey: 'employee_id' });
    
    Employees.hasOne(models.EmployeeSalaryRates, { foreignKey: 'employee_id' });

    Employees.belongsTo(models.Users, { foreignKey: 'user_id' });
    Employees.belongsTo(models.EmployeeStates, { foreignKey: 'employee_state_id' });
  }

  return Employees;
};
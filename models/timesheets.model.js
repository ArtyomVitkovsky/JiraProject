module.exports = (sequelize, Sequelize) => {
    const Timesheets = sequelize.define("Timesheets", {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        timesheet_date: {
            type: Sequelize.DATEONLY
        },
        hours: {
            type: Sequelize.INTEGER
        },
        minutes: {
            type: Sequelize.INTEGER
        }
    });

      Timesheets.associate = (models) => 
      {
        Timesheets.belongsTo(models.Employees, { foreignKey: 'employee_id' })
        Timesheets.belongsTo(models.Tasks, { foreignKey: 'task_id' })
      }

    return Timesheets;
};


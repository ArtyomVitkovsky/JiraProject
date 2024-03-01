module.exports = (sequelize, Sequelize) => {
    const EmployeeSalaryRates = sequelize.define("EmployeeSalaryRates", {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        salary_rate: {
            type: Sequelize.FLOAT
        }
    });

    EmployeeSalaryRates.associate = (models) => {
        EmployeeSalaryRates.belongsTo(models.Employees, { foreignKey: 'employee_id' });
    }

    return EmployeeSalaryRates;
};


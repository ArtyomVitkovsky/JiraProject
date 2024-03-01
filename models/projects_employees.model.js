module.exports = (sequelize, Sequelize) => {
    const ProjectsEmployees = sequelize.define('ProjectsEmployees', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
    }, {
        timestamps: true
    });

    ProjectsEmployees.associate = (models) => {
        ProjectsEmployees.belongsTo(models.Projects, { foreignKey: 'project_id' });
        ProjectsEmployees.belongsTo(models.Employees, { foreignKey: 'employee_id' });
    }

    return ProjectsEmployees;
};


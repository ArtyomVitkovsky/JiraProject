module.exports = (sequelize, Sequelize) => {
    const ProjectsCustomization = sequelize.define('ProjectsCustomization', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        columns_config: {
            type: Sequelize.TEXT
        }
    }, {
        timestamps: true
    });

    ProjectsCustomization.associate = (models) => {
        ProjectsCustomization.belongsTo(models.Projects, { foreignKey: 'project_id' })
    }

    return ProjectsCustomization;
};


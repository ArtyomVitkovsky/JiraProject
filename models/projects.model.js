module.exports = (sequelize, Sequelize) => {
    const Projects = sequelize.define('Projects', {
      id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    }, {
      timestamps: true
    });
  
    Projects.associate = (models) => {
      Projects.hasMany(models.ProjectsEmployees, { foreignKey: 'project_id' });
      Projects.hasMany(models.Tasks, { foreignKey: 'project_id' });
      
      Projects.hasOne(models.ProjectsCustomization, { foreignKey: 'project_id' });

      Projects.belongsTo(models.Users, { foreignKey: 'project_manager_id' });
    }
  
    return Projects;
  };
  
  
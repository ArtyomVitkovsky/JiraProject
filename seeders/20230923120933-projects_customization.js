const db = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {

    const projects = await db.Projects.findAll({ raw: true });
    
    await db.ProjectsCustomization.bulkCreate([
      {
        project_id: projects[0].id,
        columns_config: ''
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

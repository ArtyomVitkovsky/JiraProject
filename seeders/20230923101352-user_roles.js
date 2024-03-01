const db = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    await db.UserRoles.bulkCreate([
      { role_type: 'Admin' },
      { role_type: 'Project Manager' },
      { role_type: 'Employee' }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await db.UserRoles.destroy({
      cascade: true
    });
  }
};
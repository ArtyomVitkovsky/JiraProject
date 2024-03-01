const db = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    await db.TaskTypes.bulkCreate([
      { task_type: 'DEV' },
      { task_type: 'BUG' },
      { task_type: 'UI' }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await db.UserRoles.destroy({
      cascade: true
    });
  }
};
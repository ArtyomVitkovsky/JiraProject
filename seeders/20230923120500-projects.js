const db = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    const userRoles = await db.UserRoles.findAll({raw: true});

    const userRolePerId = userRoles.reduce((userRolePerId, type) => {
      userRolePerId[type.role_type] = type.id;
      return userRolePerId;
    }, {});

    const user = await db.Users.findOne({
      where: {
        user_role_id: userRolePerId['Project Manager']
      },
      raw: true
    });

    await db.Projects.bulkCreate([
      {
        name: 'Talking Slimy',
        project_manager_id: user.id
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

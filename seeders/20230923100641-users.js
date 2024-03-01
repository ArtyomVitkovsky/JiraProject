const db = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    const userRoles = await db.UserRoles.findAll({raw: true});

    const userRolePerId = userRoles.reduce((userRolePerId, type) => {
      userRolePerId[type.role_type] = type.id;
      return userRolePerId;
    }, {});

    await db.Users.bulkCreate([
      {
        email: 'admin_user@gmail.com',
        password: 'admin',
        firstName: 'Admin',
        lastName: 'Admin',
        user_role_id: userRolePerId.Admin
      },
      {
        email: 'project_manager_user@gmail.com',
        password: '12345',
        firstName: 'Manager',
        lastName: 'Manager',
        user_role_id: userRolePerId['Project Manager']
      },
      {
        email: 'employee_user@gmail.com',
        password: '12345',
        firstName: 'Employee-1-firstName',
        lastName: 'Employee-1-lastName',
        user_role_id: userRolePerId.Employee
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

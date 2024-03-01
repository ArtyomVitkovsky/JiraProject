'use strict';

const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Users                    = require('./users.model')(sequelize, Sequelize);
db.UserRoles                = require('./user_roles.model')(sequelize, Sequelize);
db.Employees                = require('./employees.model')(sequelize, Sequelize);
db.EmployeeStates           = require('./employee_states.model')(sequelize, Sequelize);
db.EmployeeSalaryRates      = require('./employee_salary_rate.model')(sequelize, Sequelize);
db.Timesheets               = require('./timesheets.model')(sequelize, Sequelize);
db.Tasks                    = require('./tasks.model')(sequelize, Sequelize);
db.TaskTypes                = require('./task_types.model')(sequelize, Sequelize);
db.Projects                 = require('./projects.model')(sequelize, Sequelize);
db.ProjectsCustomization    = require('./projects_customization.model')(sequelize, Sequelize);
db.ProjectsEmployees        = require('./projects_employees.model')(sequelize, Sequelize);
db.UsersUpdateRoleRequests  = require('./user_update_role_requests.model')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

const express = require('express')
const router = express.Router();
const db = require('../../models');

router.post('/createProject', async (req, res) => {
	try {

		await db.sequelize.query('CALL safeCreateProject(:name, :projectManagerId)', {
			replacements: {
				name: req.body.name,
				projectManagerId: req.body.projectManagerId
			}
		});

		console.log(req.body.name);

		return res.status(200).json({
			code: 200
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.post('/saveProjects', async (req, res) => {
	try {

		await db.sequelize.query('CALL saveProjectCustomizationConfig(:columnsConfig, :projectId)', {
			replacements: {
				columnsConfig: req.body.columnsConfig,
				projectId: req.body.projectId
			}
		});

		return res.status(200).json({
			code: 200
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getProjects', async (req, res) => {
	try {
		if (!req.query) {
			throw new Error('This user does not exist!')
		}

		const projectManager = req.query;

		const userRoleProjectManagerType = await db.UserRoles.findOne({
			where: {
				role_type: 'Project Manager'
			}
		});

		const existingUser = await db.Users.findOne({
			where: {
				email: projectManager.email,
				password: projectManager.password,
				user_role_id: userRoleProjectManagerType.id
			}
		});

		if (!existingUser) {
			throw new Error('This user does not exist!')
		}

		const projects = await db.Projects.findAll({
			where: {
				project_manager_id: existingUser.id
			}
		});

		return res.status(200).json({
			code: 200,
			projects: projects
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getEmployeesOnProject', async (req, res) => {
	try {

		console.log('/getEmployeesOnProject    ' + req);

		const employees = await db.sequelize.query(`SELECT employees.id, employees.first_name, employees.last_name 
					FROM employees JOIN projectsemployees
					ON employees.id = projectsemployees.employee_id
					WHERE projectsemployees.project_id = '${req.query.projectId}'`, {
						type: db.Sequelize.QueryTypes.SELECT,
						raw: true
					});


		return res.status(200).json({
			code: 200,
			employees: employees
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getEmployeesToSelect', async (req, res) => {
	try {

		let employees = await db.sequelize.query(`SELECT DISTINCT employees.id, employees.first_name, employees.last_name
				FROM employees JOIN projectsemployees
				ON employees.id = projectsemployees.employee_id
				WHERE projectsemployees.employee_id NOT IN 
					(SELECT employees.id 
					FROM employees JOIN projectsemployees
					ON employees.id = projectsemployees.employee_id
					WHERE projectsemployees.project_id = '${req.query.projectId}')`, {
			type: db.Sequelize.QueryTypes.SELECT,
			raw: true
		});

		if (!employees || employees.length == 0) {
			console.log('!employees || employees.length == 0');

			employees = await db.sequelize.query(`SELECT employees.id, employees.first_name, employees.last_name 
					FROM employees
					WHERE employees.id NOT IN
					(SELECT projectsemployees.employee_id FROM projectsemployees)`, {
						type: db.Sequelize.QueryTypes.SELECT,
						raw: true
					});
		}

		console.log(employees);

		return res.status(200).json({
			code: 200,
			employees: employees
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.post('/createProjectEmployeeRelation', async (req, res) => {
	try {

		await db.sequelize.query('CALL createProjectEmployeeRelation(:projectId, :employeeId)', {
			replacements: {
				projectId: req.body.projectId,
				employeeId: req.body.employeeId
			}
		});

		return res.status(200).json({
			code: 200
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.post('/removeProjectEmployeeRelation', async (req, res) => {
	try {

		await db.sequelize.query('CALL removeProjectEmployeeRelation(:projectId, :employeeId)', {
			replacements: {
				projectId: req.body.projectId,
				employeeId: req.body.employeeId
			}
		});

		return res.status(200).json({
			code: 200
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

module.exports = router;
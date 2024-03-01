const express = require('express')
const router = express.Router();
const db = require('../../models');

router.get('/getProjects', async (req, res) => {
	console.log('getProjects');

	try {
		if (!req.query) {
			throw new Error('This user does not exist!')
		}
		const userId = req.query.userId;

		const userRole = await db.sequelize.query(`SELECT userroles.role_type
			FROM userroles
			JOIN users ON userroles.id = users.user_role_id
			WHERE users.id = '${userId}'`, {
				type: db.Sequelize.QueryTypes.SELECT,
				raw: true,
				plain: true
		});

		let query = '';
		if (userRole.role_type === 'Employee') {

			const employee = await db.sequelize.query(`SELECT employees.id 
				FROM employees 
				WHERE employees.user_id = '${userId}'`, {
				type: db.Sequelize.QueryTypes.SELECT,
				raw: true,
				plain: true
			});

			query = `SELECT projects.id, projects.name, projects.project_manager_id, users.email
				FROM projectsemployees 
				JOIN projects ON projectsemployees.project_id = projects.id
				JOIN users ON users.id = projects.project_manager_id
				WHERE projectsemployees.employee_id = '${employee.id}'`;
		} 
		else if (userRole.role_type === 'Project Manager') 
		{
			console.log(`userRole === 'Project Manager'`)
			query = `SELECT projects.id, projects.name, projects.project_manager_id, users.email
				FROM projects
				JOIN users ON projects.project_manager_id = users.id
				WHERE projects.project_manager_id = '${userId}'`
		}

		const projects = await db.sequelize.query(query, {
			type: db.Sequelize.QueryTypes.SELECT,
			raw: true
		});

		console.log(projects);

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


module.exports = router;
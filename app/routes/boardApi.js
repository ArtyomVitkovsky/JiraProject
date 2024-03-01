const express = require('express')
const router = express.Router();
const db = require('../../models');

router.get('/getColumnsConfig', async (req, res) => {
	try {
		const projectId = req.query.projectId;
		console.log(projectId);

		const customization = await db.ProjectsCustomization.findOne({
			where: {
				project_id: projectId
			}
		})

		console.log(customization);

		return res.status(200).json({
			columnsConfig: customization.columns_config,
			code: 200
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getTasks', async (req, res) => {
	try {
		const projectId = req.query.projectId;

		const query = `SELECT * FROM tasksview WHERE project_id = '${projectId}'`;
		const tasksView = await db.sequelize.query(query, { raw: true, type: db.Sequelize.QueryTypes.SELECT })

		console.log(tasksView);

		return res.status(200).json({
			code: 200,
			tasks: tasksView
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getBoardView', async (req, res) => {
	try {
		const projectId = req.query.projectId;

		const query = `SELECT * FROM board_tasks_view WHERE project_id = '${projectId}'`;
		const boardView = await db.sequelize.query(query, { raw: true, type: db.Sequelize.QueryTypes.SELECT })

		return res.status(200).json({
			code: 200,
			boardView: boardView
		})
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getTaskTypes', async (req, res) => {
	try {
		const query = `SELECT * FROM tasktypes`;
		const taskTypes = await db.sequelize.query(query, { raw: true, type: db.Sequelize.QueryTypes.SELECT });

		console.log('taskTypes', taskTypes)

		return res.status(200).json({
			code: 200,
			taskTypes: taskTypes
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.post('/createTask', async (req, res) => {
	try {
		const projectId = req.body.projectId;
		const projectManagerId = req.body.projectManagerId;
		const columnIndex = req.body.columnIndex;

		await db.sequelize.query('CALL createTask(:projectId, :projectManagerId, :columnIndex)', {
			replacements: {
				projectId: projectId,
				projectManagerId: projectManagerId,
				columnIndex: columnIndex
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

router.post('/updateTaskColumnIndex', async (req, res) => {
	try {
		const taskId = req.body.taskId;
		const columnIndex = req.body.columnIndex;

		const query = `UPDATE tasks SET tasks.column_index = ${columnIndex} WHERE tasks.id = '${taskId}'`;
		await db.sequelize.query(query, { raw: true, type: db.Sequelize.QueryTypes.UPDATE });

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

router.post('/saveTaskChanges', async (req, res) => {
	try {
		const task = req.body.task;

		const query =
			`UPDATE tasks SET 
			task_description = '${task.task_description}',
			employee_id = '${task.employee_id}',
			task_type_id = '${task.task_type_id}',
			column_index = ${task.column_index},
			task_name = '${task.task_name}',
			estimated_hours = ${task.estimated_hours},
			logged_hours = ${task.logged_hours}
			WHERE tasks.id = '${task.id}'`;

		await db.sequelize.query(query, {
			type: db.Sequelize.QueryTypes.UPDATE,
			raw: true
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

router.get('/getUserRole', async (req, res) => {
	try {
		const userRoleId = req.query.userRoleId;

		const userRole = await db.UserRoles.findOne({
			where: {
				id: userRoleId
			}
		});

		return res.status(200).json({
			code: 200,
			userRole: userRole
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
})

module.exports = router;
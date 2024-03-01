const express = require('express')
const router = express.Router();
const db = require('../../models');
const writeXlsxFile = require('write-excel-file/node');
const dbControl = require('../../dataBaseControl');
const fs = require('fs');
const path = require('path');

router.post('/setUserRole', async (req, res) => {
	try {
		console.log('req.query', req.query);

		const setRoleQuery = `UPDATE users 
			SET users.user_role_id = '${req.body.userRoleId}'
			WHERE users.id = '${req.body.userId}'`;

		const updateRequestStatusQuery = `UPDATE usersupdaterolerequests 
			SET usersupdaterolerequests.state = 'Approved'
			WHERE usersupdaterolerequests.id = '${req.body.id}'
			AND usersupdaterolerequests.user_id = '${req.body.userId}'`;

		await db.sequelize.query(setRoleQuery, { raw: true, type: db.Sequelize.QueryTypes.UPDATE })
		await db.sequelize.query(updateRequestStatusQuery, { raw: true, type: db.Sequelize.QueryTypes.UPDATE })

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

router.post('/decelineRequest', async (req, res) => {
	try {
		console.log('req.query', req.query);

		const setRoleQuery = `UPDATE users 
			SET users.user_role_id = '${req.body.userRoleId}'
			WHERE users.id = '${req.body.userId}'`;

		const updateRequestStatusQuery = `UPDATE usersupdaterolerequests 
			SET usersupdaterolerequests.state = 'Decelined'
			WHERE usersupdaterolerequests.id = '${req.body.id}'
			AND usersupdaterolerequests.user_id = '${req.body.userId}'`;

		await db.sequelize.query(setRoleQuery, { raw: true, type: db.Sequelize.QueryTypes.UPDATE })
		await db.sequelize.query(updateRequestStatusQuery, { raw: true, type: db.Sequelize.QueryTypes.UPDATE })

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

router.get('/getUsersAndRoles', async (req, res) => {
	try {

		const usersAndRoles = await db.sequelize.query('SELECT * FROM users_and_roles', {
			type: db.Sequelize.QueryTypes.SELECT,
			raw: true
		});

		console.log(usersAndRoles);

		return res.status(200).json({
			code: 200,
			usersAndRoles: usersAndRoles
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/findUsersAndRoles', async (req, res) => {
	try {
		const email = req.query.email;

		const usersAndRoles = await db.sequelize.query(`SELECT * FROM users_and_roles WHERE email LIKE '%${email}%'`, {
			type: db.Sequelize.QueryTypes.SELECT,
			raw: true,
		});

		return res.status(200).json({
			code: 200,
			usersAndRoles: usersAndRoles
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getUserRoles', async (req, res) => {
	try {

		const userRoles = await db.sequelize.query('SELECT id, role_type FROM userroles', {
			type: db.Sequelize.QueryTypes.SELECT,
			raw: true
		});

		return res.status(200).json({
			code: 200,
			userRoles: userRoles
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getUserRequests', async (req, res) => {
	try {
		console.log('req.query', req.query);

		const query = `SELECT * FROM change_role_requests_view
		WHERE change_role_requests_view.user_id = '${req.query.userId}'
		AND change_role_requests_view.state = 'Awaiting'`;

		console.log('query', query);

		const userRequests = await db.sequelize.query(query, { raw: true, type: db.Sequelize.QueryTypes.SELECT })

		console.log('userRequests', userRequests);


		return res.status(200).json({
			code: 200,
			userRequests: userRequests
		});

	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
})

router.get('/getDatabaseTablesInformation', async (req, res) => {
	try {
		const query = `SELECT column_name as 'column', table_name as 'table' FROM information_schema.columns
		WHERE table_schema = 'jira_schema' AND table_name != 'sequelizemeta'`;

		const tablesInfo = await db.sequelize.query(query, { raw: true, type: db.Sequelize.QueryTypes.SELECT })

		const result = tablesInfo.reduce((result, tableInfo) => {
			if (!result[tableInfo.table]) {
				result[tableInfo.table] = [];
			}

			result[tableInfo.table].push(tableInfo.column);

			return result;
		}, {});

		return res.status(200).json({
			code: 200,
			tablesInfo: result
		});

	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
})

router.get('/getCustomSqlQueryResult', async (req, res) => {
	try {

		const result = await db.sequelize.query(req.query.sqlQuery, { raw: true, type: db.Sequelize.QueryTypes.SELECT })

		return res.status(200).json({
			code: 200,
			sqlQueryResult: result
		});

	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
})

router.get('/exportSqlQueryResult', async (req, res) => {
	try {
		const request = req.query.dbRequest;

		if (!request) {
			throw new Error('Not enough info provided!');
		}

		if (request.toLowerCase().includes('drop') || request.toLowerCase().includes('alter')) {
			throw new Error('You are not allowed to change DB tables!');
		}

		const requestResult = await db.sequelize.query(
			request,
			{
				type: db.Sequelize.QueryTypes.SELECT,
				raw: true
			}
		) || [];

		if (requestResult.length === 0) {
			res.status(200).json({
				code: 200
			});
		}

		console.log(requestResult);

		const headerRow = Object.keys(requestResult[0]).map(column => ({ value: column, fontWeight: 'bold' }));
		const bodyRows = [];

		requestResult.forEach(record => {
			const recordData = [];
			Object.keys(record).forEach(column => {
				const currentRecord = {
					type: String,
					value: record[column],
				};

				console.log(record[column], record[column] instanceof Number)

				if (record[column] !== null || record[column] !== '') {
					if (record[column] instanceof Date) {
						currentRecord.type = Date;
						currentRecord.format = 'YYYY-MM-DD';
					} else if (record[column] instanceof Number || !isNaN(record[column])) {
						currentRecord.type = Number;
						currentRecord.value = JSON.parse(record[column]);
					} else if (record[column] === 0 || record[column] === 1) {
						currentRecord.type = Boolean;
						currentRecord.value = !!record[column];
					}
				}

				recordData.push(currentRecord);
			});

			bodyRows.push(recordData);
		});

		const data = [
			headerRow,
			...bodyRows
		];

		const file = await writeXlsxFile(data, {
			sheet: 'SQL_QUERY_RESULT'
		});

		res.set('Content-Disposition', `attachment; filename=SQL_QUERY_RESULT_${new Date().toISOString()}.xlsx`);
		file.pipe(res);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			code: 400,
			message: error.message || error
		});
	}
});

router.get('/createDataBaseBackup', async (req, res) => {
	try {

		await dbControl.createDbBackup();

		return res.status(200).json({
			code: 200,
		});

	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
})

router.get('/getDataBaseBackups', async (req, res) => {
	try {
		const backups = fs.readdirSync(path.join(__dirname, '../../Backups'));

		res.status(200).json({
			code: 200,
			backups: backups
		});
	} catch (error) {
		res.status(400).json({
			code: 400,
			message: error.message || error
		});
	}
});

router.get('/downloadDatabaseBackupFile', async (req, res) => {
	try {
		const fileName = req.query.fileName;

		if (!fileName) {
			throw new Error('Not enough info provided!');
		}

		const file = fs.createReadStream(path.join(__dirname, `../../Backups/${ fileName }`));

		file.on('close', () => {
			res.end()
		});

		res.set('Content-Disposition', `attachment; filename = ${ fileName }`);
		file.pipe(res);
  } catch (error) {
	console.log(error);
	res.status(400).json({
		code: 400,
		message: error.message || error
	});
}
});

module.exports = router;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:4200");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const users = require('./app/routes/usersApi');
app.use('/users', users);

const projectManagerMenu = require('./app/routes/projectManagerMenuApi');
app.use('/projectManagerMenu', projectManagerMenu);

const adminMenu = require('./app/routes/adminMenuApi');
app.use('/adminMenu', adminMenu);

const userProjectsSelection = require('./app/routes/userProjectsSelectionApi');
app.use('/userProjectsSelection', userProjectsSelection);

const board = require('./app/routes/boardApi');
app.use('/board', board);

const userPage = require('./app/routes/userPageApi');
app.use('/userPage', userPage);


const dbControl = require('./dataBaseControl.js');
const events = [];
app.get('/DataBaseJournal/getEvents', (req, res) => {
	try {
		const result = events.map(event => {
			const affectedRows = event.affectedRows[0];
			console.log(affectedRows);

			const affectedRecords = [];
			event.affectedColumns.forEach(column => {
				const affectedRow = {
					column: column,
				};

				if (event.type !== 'INSERT') {
					affectedRow.valueBefore = affectedRows.before[column];
				}

				if (event.type !== 'DELETE') {
					affectedRow.valueAfter = affectedRows.after[column];
				}

				affectedRecords.push(affectedRow);
			});

			return {
				dml: event.type,
				table: event.table,
				time: event.timestamp,
				affectedRows: affectedRecords
			};
		});

		return res.status(200).json({
			code: 200,
			result: result
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		});
	}
});

app.listen(3000, () => {
	console.log('Server listening on port 3000');
	dbControl.getDbJournal(events);
	dbControl.scheduleDatabaseBackup();
});

const express = require('express')
const router = express.Router();
const db = require('../../models');

router.post('/createUser', async (req, res) => {
	try {
		const user = req.body;

		if (!user.email || !user.password) {
			throw new Error('Not enough info provided!');
		}

		const existingUsers = await db.Users.findAll({
			where: {
				email: user.email
			}
		});

		if (existingUsers.length > 0) {
			throw new Error('Such user already exists!');
		}

		await db.sequelize.query('CALL createUser(:email, :password)', {
			replacements:{
				email: user.email,
				password: user.password
			}
		});

		const newUser = await db.Users.findOne({
			where: {
				email: user.email,
				password: user.password
			}
		});

		await db.sequelize.query('CALL createEmployee(:userId, :firstName, :lastName)', {
			replacements:{
				userId: newUser.id,
				firstName: user.firstName,
				lastName: user.lastName,
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

router.get('/authorize', async (req, res) => {
	try {
		const user = req.query;
		console.log(user);

		if (!user.email || !user.password) {
			throw new Error('Not enough info provided!');
		}

		const existingUser = await db.Users.findOne({
			where: {
				email: user.email,
				password: user.password
			}
		});

		if (!existingUser) {
			throw new Error('Email or password is not valid!')
		}

		const userRole = await db.UserRoles.findOne({
			where: {
				id: existingUser.user_role_id
			}
		})

		const response = {
			user: existingUser,
			userRole: userRole
		}

		return res.status(200).json({
			code: 200,
			body: response
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

module.exports = router;

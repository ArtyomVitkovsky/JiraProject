const express = require('express')
const router = express.Router();
const db = require('../../models');

router.post('/createChangeUserRoleRequest', async (req, res) => {
	try {
		const targetRoleTypeId = req.body.targetRoleTypeId;
		const message = req.body.message;
		const userId = req.body.userId;

		await db.sequelize.query('CALL create_change_user_role_request(:targetRoleTypeId, :message, :userId)', {
			replacements: {
				targetRoleTypeId: targetRoleTypeId,
				message: message,
				userId: userId
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

router.post('/saveUserInfoChanges', async (req, res) => {
	try {
		const userId = req.body.userId;
		const newEmail = req.body.newEmail;
		const newPassword = req.body.newPassword;
		const newFirstName = req.body.newFirstName;
		const newLastName = req.body.newLastName;
		const newUserStateId = req.body.newUserStateId;

		await db.sequelize.query('CALL saveUserInfoChanges(:userId, :newEmail, :newPassword, :newFirstName, :newLastName, :newUserStateId)', {
			replacements: {
				userId: userId,
				newEmail: newEmail,
				newPassword: newPassword,
				newFirstName: newFirstName,
				newLastName: newLastName,
				newUserStateId: newUserStateId,
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

router.get('/getUserInfo', async (req, res) => {
	try {
		const userId = req.query.userId;

		const query = `SELECT * FROM user_info_view WHERE id = '${userId}'`;
		const userInfo = await db.sequelize.query(query, { raw: true, type: db.Sequelize.QueryTypes.SELECT })

		return res.status(200).json({
			code: 200,
			userInfo: userInfo
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

router.get('/getUserStates', async (req, res) => {
	try {
		const userStates = await db.EmployeeStates.findAll({ raw: true });

		return res.status(200).json({
			code: 200,
			userStates: userStates
		});
	} catch (error) {
		return res.status(400).json({
			code: 400,
			message: error.message || error
		})
	}
});

module.exports = router;
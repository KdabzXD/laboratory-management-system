const { poolPromise, sql } = require('../config/db');
const logActivity = require('../utils/logger');

exports.getAll = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				s.employee_id,
				s.scientist_name,
				s.scientist_age,
				s.scientist_email,
				s.phone_number,
				NULL AS created_at,
				d.department_id,
				d.department_name,
				sp.specialization_id,
				sp.specialization_name,
				g.gender_id,
				g.gender_name
			FROM scientist_details s
			JOIN departments d ON d.department_id = s.department_id
			JOIN department_specialization sp ON sp.specialization_id = s.specialization_id
			JOIN gender g ON g.gender_id = s.gender_id
			ORDER BY s.employee_id
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch scientists', error: err.message });
	}
};

exports.getMetadata = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const [departments, specializations, genders] = await Promise.all([
			pool.request().query('SELECT department_id, department_name FROM departments ORDER BY department_name'),
			pool.request().query('SELECT specialization_id, specialization_name, department_id FROM department_specialization ORDER BY specialization_name'),
			pool.request().query('SELECT gender_id, gender_name FROM gender ORDER BY gender_id'),
		]);

		return res.json({
			departments: departments.recordset,
			specializations: specializations.recordset,
			genders: genders.recordset,
		});
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch scientist metadata', error: err.message });
	}
};

exports.create = async (req, res) => {
	try {
		const {
			employee_id,
			scientist_name,
			scientist_age,
			scientist_email,
			phone_number,
			department_id,
			specialization_id,
			gender_id,
		} = req.body;

		const pool = await poolPromise;
		await pool
			.request()
			.input('employee_id', sql.VarChar(5), employee_id)
			.input('scientist_name', sql.VarChar(50), scientist_name)
			.input('scientist_age', sql.Int, scientist_age)
			.input('scientist_email', sql.VarChar(70), scientist_email)
			.input('phone_number', sql.VarChar(10), phone_number)
			.input('department_id', sql.Int, department_id)
			.input('specialization_id', sql.Int, specialization_id)
			.input('gender_id', sql.Int, gender_id)
			.query(`
				INSERT INTO scientist_details
				(employee_id, scientist_name, scientist_age, scientist_email, phone_number, department_id, specialization_id, gender_id)
				VALUES
				(@employee_id, @scientist_name, @scientist_age, @scientist_email, @phone_number, @department_id, @specialization_id, @gender_id)
			`);

		await logActivity({
			activityType: 'Scientist Created',
			description: `Scientist ${scientist_name} (${employee_id}) added`,
			performedBy: req.user?.username || 'system',
		});

		return res.status(201).json({ message: 'Scientist created successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create scientist', error: err.message });
	}
};

exports.update = async (req, res) => {
	try {
		const { employeeId } = req.params;
		const {
			scientist_name,
			scientist_age,
			scientist_email,
			phone_number,
			department_id,
			specialization_id,
			gender_id,
		} = req.body;

		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('employee_id', sql.VarChar(5), employeeId)
			.input('scientist_name', sql.VarChar(50), scientist_name)
			.input('scientist_age', sql.Int, scientist_age)
			.input('scientist_email', sql.VarChar(70), scientist_email)
			.input('phone_number', sql.VarChar(10), phone_number)
			.input('department_id', sql.Int, department_id)
			.input('specialization_id', sql.Int, specialization_id)
			.input('gender_id', sql.Int, gender_id)
			.query(`
				UPDATE scientist_details
				SET scientist_name = @scientist_name,
						scientist_age = @scientist_age,
						scientist_email = @scientist_email,
						phone_number = @phone_number,
						department_id = @department_id,
						specialization_id = @specialization_id,
						gender_id = @gender_id
				WHERE employee_id = @employee_id
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Scientist not found' });
		}

		await logActivity({
			activityType: 'Scientist Updated',
			description: `Scientist ${employeeId} updated`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Scientist updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update scientist', error: err.message });
	}
};

exports.remove = async (req, res) => {
	try {
		return res.status(409).json({ message: 'Deleting scientist records is disabled by the Oracle schema.' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to delete scientist', error: err.message });
	}
};

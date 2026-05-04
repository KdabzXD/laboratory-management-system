const { poolPromise, sql } = require('../config/db');
const logActivity = require('../utils/logger');

exports.getAll = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				e.serial_number,
				e.equipment_name,
				e.equipment_cost,
				e.department_id,
				d.department_name,
				e.supplier_id,
				s.supplier_name,
				s.supplier_email,
				NULL AS created_at
			FROM lab_equipment e
			JOIN departments d ON d.department_id = e.department_id
			JOIN supplier_details s ON s.supplier_id = e.supplier_id
			ORDER BY e.serial_number
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch equipment', error: err.message });
	}
};

exports.create = async (req, res) => {
	try {
		const { serial_number, equipment_name, equipment_cost, department_id, supplier_id } = req.body;
		const pool = await poolPromise;
		await pool
			.request()
			.input('serial_number', sql.VarChar(5), serial_number)
			.input('equipment_name', sql.VarChar(50), equipment_name)
			.input('equipment_cost', sql.Int, equipment_cost)
			.input('department_id', sql.Int, department_id)
			.input('supplier_id', sql.Int, supplier_id)
			.query(`
				INSERT INTO lab_equipment
				(serial_number, equipment_name, equipment_cost, department_id, supplier_id)
				VALUES (@serial_number, @equipment_name, @equipment_cost, @department_id, @supplier_id)
			`);

		await logActivity({
			activityType: 'Equipment Created',
			description: `Equipment ${equipment_name} (${serial_number}) added`,
			performedBy: req.user?.username || 'system',
		});

		return res.status(201).json({ message: 'Equipment created successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create equipment', error: err.message });
	}
};

exports.update = async (req, res) => {
	try {
		const { serialNumber } = req.params;
		const { equipment_name, equipment_cost, department_id, supplier_id } = req.body;

		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('serial_number', sql.VarChar(5), serialNumber)
			.input('equipment_name', sql.VarChar(50), equipment_name)
			.input('equipment_cost', sql.Int, equipment_cost)
			.input('department_id', sql.Int, department_id)
			.input('supplier_id', sql.Int, supplier_id)
			.query(`
				UPDATE lab_equipment
				SET equipment_name = @equipment_name,
						equipment_cost = @equipment_cost,
						department_id = @department_id,
						supplier_id = @supplier_id
				WHERE serial_number = @serial_number
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Equipment not found' });
		}

		await logActivity({
			activityType: 'Equipment Updated',
			description: `Equipment ${serialNumber} updated`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Equipment updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update equipment', error: err.message });
	}
};

exports.remove = async (req, res) => {
	try {
		const { serialNumber } = req.params;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('serial_number', sql.VarChar(5), serialNumber)
			.query('DELETE FROM lab_equipment WHERE serial_number = @serial_number');

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Equipment not found' });
		}

		await logActivity({
			activityType: 'Equipment Deleted',
			description: `Equipment ${serialNumber} deleted`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Equipment deleted successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to delete equipment', error: err.message });
	}
};

exports.getAssignments = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				ea.assignment_id,
				ea.serial_number,
				e.equipment_name,
				ea.employee_id,
				s.scientist_name,
				ea.assignment_date,
				NULL AS status_id,
				'Pending' AS status_name,
				ea.assignment_date AS created_at
			FROM equipment_assignment ea
			JOIN lab_equipment e ON e.serial_number = ea.serial_number
			JOIN scientist_details s ON s.employee_id = ea.employee_id
			ORDER BY ea.assignment_date DESC, ea.assignment_id DESC
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch equipment assignments', error: err.message });
	}
};

exports.createAssignment = async (req, res) => {
	try {
		const { serial_number, employee_id, assignment_date, status_id } = req.body;
		const pool = await poolPromise;
		await pool
			.request()
			.input('serial_number', sql.VarChar(5), serial_number)
			.input('employee_id', sql.VarChar(5), employee_id)
			.input('assignment_date', sql.Date, assignment_date || null)
			.input('status_id', sql.Int, status_id || null)
			.query(`
				INSERT INTO equipment_assignment
				(serial_number, employee_id, assignment_date)
				VALUES
				(@serial_number, @employee_id, COALESCE(TO_DATE(@assignment_date, 'YYYY-MM-DD'), SYSDATE))
			`);

		await logActivity({
			activityType: 'Assignment Created',
			description: `Equipment ${serial_number} assigned to ${employee_id}`,
			performedBy: req.user?.username || 'system',
		});

		return res.status(201).json({ message: 'Assignment created successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create assignment', error: err.message });
	}
};

exports.updateAssignment = async (req, res) => {
	try {
		const { assignmentId } = req.params;
		const { serial_number, employee_id, assignment_date, status_id } = req.body;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('assignment_id', sql.Int, Number(assignmentId))
			.input('serial_number', sql.VarChar(5), serial_number)
			.input('employee_id', sql.VarChar(5), employee_id)
			.input('assignment_date', sql.Date, assignment_date)
			.input('status_id', sql.Int, status_id || null)
			.query(`
				UPDATE equipment_assignment
				SET serial_number = @serial_number,
						employee_id = @employee_id,
						assignment_date = TO_DATE(@assignment_date, 'YYYY-MM-DD')
				WHERE assignment_id = @assignment_id
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Assignment not found' });
		}

		await logActivity({
			activityType: 'Assignment Updated',
			description: `Assignment ${assignmentId} updated`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Assignment updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update assignment', error: err.message });
	}
};

exports.deleteAssignment = async (req, res) => {
	try {
		const { assignmentId } = req.params;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('assignment_id', sql.Int, Number(assignmentId))
			.query('DELETE FROM equipment_assignment WHERE assignment_id = @assignment_id');

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Assignment not found' });
		}

		await logActivity({
			activityType: 'Assignment Deleted',
			description: `Assignment ${assignmentId} deleted`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Assignment deleted successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to delete assignment', error: err.message });
	}
};

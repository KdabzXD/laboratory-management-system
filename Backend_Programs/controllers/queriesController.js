const path = require('path');
const fs = require('fs');
const { poolPromise, sql } = require('../config/db');

const queriesPath = path.join(__dirname, '..', 'data', 'queries.json');

function loadQueries() {
	const raw = fs.readFileSync(queriesPath, 'utf-8');
	return JSON.parse(raw);
}

exports.getAllQueries = async (_req, res) => {
	try {
		const queries = loadQueries().map(({ id, name, category }) => ({ id, name, category }));
		return res.json(queries);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to load predefined queries', error: err.message });
	}
};

exports.runQueryById = async (req, res) => {
	try {
		const id = Number(req.params.id);
		const queries = loadQueries();
		const selected = queries.find((q) => q.id === id);

		if (!selected) {
			return res.status(404).json({ message: 'Query not found' });
		}

		const pool = await poolPromise;
		const result = await pool.request().query(selected.sql);
		return res.json({ id: selected.id, name: selected.name, category: selected.category, rows: result.recordset });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to run query', error: err.message });
	}
};

exports.runMaterialRequestReport = async (req, res) => {
	try {
		const {
			date_from,
			date_to,
			department_id,
			supplier_id,
			status_id,
			min_qty,
			max_qty,
		} = req.body || {};

		const pool = await poolPromise;
		const request = pool.request();

		request.input('date_from', sql.Date, date_from || null);
		request.input('date_to', sql.Date, date_to || null);
		request.input('department_id', sql.Int, department_id ? Number(department_id) : null);
		request.input('supplier_id', sql.Int, supplier_id ? Number(supplier_id) : null);
		request.input('status_id', sql.Int, status_id ? Number(status_id) : null);
		request.input('min_qty', sql.Int, min_qty ? Number(min_qty) : null);
		request.input('max_qty', sql.Int, max_qty ? Number(max_qty) : null);

		const result = await request.query(`
			SELECT
				mr.request_id,
				mr.request_date,
				mr.material_quantity,
				s.employee_id,
				s.scientist_name,
				d.department_name,
				m.reference_number,
				m.material_name,
				sp.supplier_name,
				'Pending' AS status_name
			FROM material_requests mr
			JOIN scientist_details s ON mr.employee_id = s.employee_id
			JOIN departments d ON d.department_id = s.department_id
			JOIN lab_materials m ON mr.reference_number = m.reference_number
			JOIN supplier_details sp ON sp.supplier_id = m.supplier_id
			WHERE (@date_from IS NULL OR mr.request_date >= TO_DATE(@date_from, 'YYYY-MM-DD'))
				AND (@date_to IS NULL OR mr.request_date <= TO_DATE(@date_to, 'YYYY-MM-DD'))
				AND (@department_id IS NULL OR s.department_id = @department_id)
				AND (@supplier_id IS NULL OR m.supplier_id = @supplier_id)
				AND (@status_id IS NULL OR @status_id = 1)
				AND (@min_qty IS NULL OR mr.material_quantity >= @min_qty)
				AND (@max_qty IS NULL OR mr.material_quantity <= @max_qty)
			ORDER BY mr.request_date DESC, mr.request_id DESC
		`);

		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to run report query', error: err.message });
	}
};

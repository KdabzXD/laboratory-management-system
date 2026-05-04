const oracledb = require('oracledb');
require('dotenv').config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const poolPromise = oracledb
	.createPool({
		user: process.env.ORACLE_USER || process.env.DB_USER,
		password: process.env.ORACLE_PASSWORD || process.env.DB_PASSWORD,
		connectString:
			process.env.ORACLE_CONNECT_STRING ||
			`${process.env.ORACLE_HOST || 'localhost'}:${process.env.ORACLE_PORT || 1521}/${process.env.ORACLE_SERVICE || 'XEPDB1'}`,
		poolMin: Number(process.env.ORACLE_POOL_MIN || 1),
		poolMax: Number(process.env.ORACLE_POOL_MAX || 5),
		poolIncrement: Number(process.env.ORACLE_POOL_INCREMENT || 1),
	})
	.then((pool) => {
		console.log('Oracle Database connected');
		return pool;
	})
	.catch((err) => {
		console.error('Oracle Database connection failed:', err);
		throw err;
	});

function normalizeRows(rows = []) {
	return rows.map((row) =>
		Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]))
	);
}

function normalizeSql(statement) {
	let normalized = statement
		.replace(/@([a-zA-Z_][a-zA-Z0-9_]*)/g, ':$1')
		.replace(/\bGETDATE\(\)/gi, 'SYSDATE')
		.replace(/\bISNULL\s*\(/gi, 'NVL(');

	normalized = normalized.replace(/^\s*SELECT\s+TOP\s+\(:([a-zA-Z_][a-zA-Z0-9_]*)\)\s+/i, 'SELECT ');
	if (/TOP\s+\(:([a-zA-Z_][a-zA-Z0-9_]*)\)/i.test(statement) && !/FETCH\s+FIRST/i.test(normalized)) {
		normalized += '\nFETCH FIRST :limit ROWS ONLY';
	}

	normalized = normalized.replace(/^\s*SELECT\s+TOP\s+1\s+/i, 'SELECT ');
	if (/^\s*SELECT\s+TOP\s+1\s+/i.test(statement) && !/FETCH\s+FIRST/i.test(normalized)) {
		normalized += '\nFETCH FIRST 1 ROWS ONLY';
	}

	return normalized;
}

async function execute(statement, binds = {}, options = {}) {
	const pool = await poolPromise;
	let connection;

	try {
		connection = await pool.getConnection();
		const normalized = normalizeSql(statement);
		const placeholders = new Set([...normalized.matchAll(/:([a-zA-Z_][a-zA-Z0-9_]*)/g)].map((match) => match[1]));
		const usedBinds = Object.fromEntries(Object.entries(binds).filter(([key]) => placeholders.has(key)));
		const result = await connection.execute(normalized, usedBinds, {
			autoCommit: options.autoCommit ?? true,
			...options,
		});

		return {
			...result,
			recordset: normalizeRows(result.rows),
			rowsAffected: [result.rowsAffected || 0],
		};
	} finally {
		if (connection) {
			await connection.close();
		}
	}
}

function request() {
	const binds = {};

	return {
		input(name, _type, value) {
			binds[name] = value === undefined ? null : value;
			return this;
		},
		async query(statement) {
			return execute(statement, binds);
		},
	};
}

const sql = {
	VarChar: () => undefined,
	NVarChar: () => undefined,
	Int: undefined,
	Number: undefined,
	Date: undefined,
};

module.exports = {
	execute,
	poolPromise: poolPromise.then((pool) => ({
		request,
		close: (...args) => pool.close(...args),
	})),
	request,
	sql,
	oracledb,
};

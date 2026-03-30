const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/authRoutes');
const scientistRoutes = require('./routes/scientistRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const materialRoutes = require('./routes/materialRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const activityRoutes = require('./routes/activityRoutes');
const queriesRoutes = require('./routes/queriesRoutes');
const dummyRoutes = require('./routes/dummyRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
	res.json({ ok: true, service: 'laboratory-management-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/scientists', scientistRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/queries', queriesRoutes);
app.use('/api/dummy', dummyRoutes);

app.use((err, _req, res, _next) => {
	console.error('Unhandled API error:', err);
	res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;
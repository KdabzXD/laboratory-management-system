require('dotenv').config();
const app = require('./app');

const DEFAULT_PORT = 3001;
const configuredPort = Number(process.env.PORT || DEFAULT_PORT);
const PORT = Number.isNaN(configuredPort) ? DEFAULT_PORT : configuredPort;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT} (pid: ${process.pid})`);
});

server.on('error', (err) => {
	console.error('Server failed to start:', err.message);
	process.exit(1);
});
const express = require('express');

const app = express();

// Health route
app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		uptime: process.uptime(),
		timestamp: Date.now(),
	});
});

// Start the server only when this file is run directly.
if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		// eslint-disable-next-line no-console
		console.log(`API listening on http://localhost:${port}`);
	});
}

module.exports = app;

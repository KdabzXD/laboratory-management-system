const express = require('express');
const app = express();
const dummyRoutes = require('./routes/dummyRoutes');

app.use(express.json());

// Mount dummy routes
app.use('/dummy', dummyRoutes); // ✅ pass router directly, do NOT call it

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import debug from 'debug';
import incidentRoutes from './routes/incidents.js';

// Initialize debuggers
const dbDebug = debug('app:db');
const appDebug = debug('app:startup');
const httpDebug = debug('app:http');

httpDebug.color = 5;
dbDebug.color = 2;
appDebug.color = 3;

const app = express();
const PORT = process.env.PORT || 3000;
const databaseUrl = process.env.MONGODB_SECURITY_INCIDENTS

app.use(express.json());
app.use('/api/v1/incidents', incidentRoutes);

mongoose.connect(databaseUrl)
.then(() => {
    dbDebug('Connected to MongoDB')})
.catch(err => {
    dbDebug('Error connecting to MongoDB:', err.message);
    process.exit(1);
});

app.listen(PORT, () => {
    appDebug(`Server is running on port ${PORT}`);
});

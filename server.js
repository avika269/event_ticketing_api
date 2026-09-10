import express from 'express';
import cors from 'cors';
import routes from './routes/event.routes.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
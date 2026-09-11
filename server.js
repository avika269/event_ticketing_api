import express from 'express';
import cors from 'cors';
import routes from './routes/event.routes.js';
import dotenv from 'dotenv';
import './config/db.js';
import errorMiddleware from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
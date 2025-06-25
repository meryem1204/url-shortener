import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import urlRoutes from './routes/urlRoutes.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', urlRoutes);
app.use('/', urlRoutes);

app.get('/', (req, res) => {
    res.send('URL Shortener API is up!');
});

export default app;

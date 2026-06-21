import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

export default app;

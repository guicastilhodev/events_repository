import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import authentication from './routes/authentication';
import events from './routes/events';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/auth', authentication);
app.use('/events', events);

// Rota raiz e healthcheck
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Event API' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Middleware de 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Middleware de erro
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' });
});

export default app;



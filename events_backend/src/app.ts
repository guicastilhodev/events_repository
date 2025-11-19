import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authentication from './routes/authentication';
import users from './routes/users';
import organizations from './routes/organizations';
import entities from './routes/entities';
import posts from './routes/posts';
import subscribers from './routes/subscribers';
import bills from './routes/bills';
import subscriptions from './routes/subscriptions';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/auth', authentication);
app.use('/users', users);
app.use('/organizations', organizations);
app.use('/entities', entities);
app.use('/posts', posts);
app.use('/subscribers', subscribers);
app.use('/subscriptions', subscriptions);
app.use('/bills', bills);

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



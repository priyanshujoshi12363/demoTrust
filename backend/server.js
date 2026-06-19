import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import trust from 'trust-ai';

import authRoutes      from './src/routes/auth.js';
import trustRoutes     from './src/routes/trust.js';
import logsRoutes      from './src/routes/logs.js';
import dashboardRoutes from './src/routes/dashboard.js';
import chatbotRoutes   from './src/routes/chatbot.js';
import verifyRoutes    from './src/routes/verify.js';
import aiRoutes        from './src/routes/ai.js';

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',      authRoutes);
app.use('/api/trust',     trustRoutes);
app.use('/api/logs',      logsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot',   chatbotRoutes);
app.use('/api/verify',    verifyRoutes);
app.use('/api/ai',        aiRoutes);

app.get('/', (req, res) => {
  res.json({
    name:    'TrustAI Backend',
    version: '1.0.0',
    status:  'running',
    routes: {
      auth:      '/api/auth/register  |  /api/auth/login',
      trust:     '/api/trust/evaluate',
      logs:      '/api/logs  |  /api/logs/:userId  |  /api/logs/stats',
      dashboard: '/api/dashboard/stats  |  /api/dashboard/query  |  /api/dashboard/incidents  |  /api/dashboard/users',
      chatbot:   '/api/chatbot/customer  |  /api/chatbot/analyst',
      verify:    '/api/verify/:userId',
      ai:        '/api/ai/initialize  |  /api/ai/status  |  /api/ai/memory',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

const start = async () => {
  await connectDB();
  await trust.AI(process.env.OLLAMA_API_KEY, {
    model:    process.env.OLLAMA_MODEL || 'minimax-m3',
    mockMode: !process.env.OLLAMA_API_KEY || process.env.OLLAMA_API_KEY === 'your_ollama_api_key_here',
  });
  app.listen(PORT, () => console.log(`[Server] http://localhost:${PORT}`));
};

start();

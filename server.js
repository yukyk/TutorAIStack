 // LOCAL DEVELOPMENT ONLY — this file is not used in production.
// For Vercel deployment, set Root Directory to "views/" and deploy the Next.js app directly.
// All API routes live in views/app/api/ and are handled by Next.js natively.
require('dotenv').config();

const express = require('express');
const next = require('next');
const cors = require('cors');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: './views' });
const handle = nextApp.getRequestHandler();

const apiRoutes = require('./routes/apiRoutes');
const { incrementPageVisit } = require('./controllers/api/adminController');

const PORT = process.env.PORT || 4000;

nextApp.prepare().then(() => {
  const app = express();

  app.use(cors());
  app.use(express.static(path.join(__dirname, 'public')));

  // NextAuth — pass through to Next.js with full path preserved
  app.use('/api/auth', (req, res) => {
    req.url = '/api/auth' + req.url;
    return handle(req, res);
  });

  app.use('/api', apiRoutes);

  app.get('/', (req, res) => {
    incrementPageVisit();
    return handle(req, res);
  });

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Server ready on http://localhost:${PORT}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
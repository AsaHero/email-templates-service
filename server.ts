// server.ts
import * as express from 'express';
import * as cors from 'cors';
import { emailRenderer } from './services/emailRenderer';
import { EmailRequest, EmailResponse } from './types/email';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Email rendering endpoint
app.post('/render', async (req, res) => {
  try {
    const emailData: EmailRequest = req.body;

    // Validate request
    if (!emailData.subject || !emailData.preview || !emailData.blocks) {
      return res.status(400).send('Missing required fields: subject, preview, blocks');
    }

    if (!Array.isArray(emailData.blocks) || emailData.blocks.length === 0) {
      return res.status(400).send('Blocks must be a non-empty array');
    }

    if (emailData.blocks.length > 3) {
      return res.status(400).send('Maximum 3 blocks supported');
    }

    // Render email
    const html = await emailRenderer.renderEmail(emailData);

    // Return raw HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Email rendering error:', error);
    res.status(500).json({
      error: 'Failed to render email',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
  });
});

app.listen(PORT, () => {
  console.log(`Email renderer server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Render endpoint: http://localhost:${PORT}/render-email`);
});

export default app;

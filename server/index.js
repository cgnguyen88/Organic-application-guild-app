import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load .env.local for dev
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Proxy to Anthropic API
app.post('/api/claude', async (req, res) => {
  const { messages, system, stream = false } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    process.env.VITE_ANTHROPIC_API_KEY ||
    process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not set. Add it to .env.local: ANTHROPIC_API_KEY=sk-ant-...'
    });
  }

  const modelCandidates = [
    'claude-sonnet-4-6',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-haiku-20240307',
  ];

  for (const model of modelCandidates) {
    try {
      const body = {
        model,
        max_tokens: 2048,
        messages,
        ...(system ? { system } : {}),
        ...(stream ? { stream: true } : {}),
      };

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      if (response.status === 404 || response.status === 400) {
        const err = await response.json().catch(() => ({}));
        if (err.error?.message?.includes('model')) continue;
      }

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Model-Used', model);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              try {
                const json = JSON.parse(data);
                // Anthropic SSE format
                const text = json.delta?.text || '';
                if (text) {
                  res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
                }
                if (json.type === 'message_stop' || json.type === 'message_delta') {
                  if (json.type === 'message_stop') {
                    res.write('data: [DONE]\n\n');
                    res.end();
                    return;
                  }
                }
              } catch {}
            }
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
        return;
      } else {
        const data = await response.json();
        res.setHeader('X-Model-Used', model);
        return res.status(response.status).json(data);
      }
    } catch (err) {
      console.error(`Model ${model} failed:`, err.message);
      if (model === modelCandidates[modelCandidates.length - 1]) {
        return res.status(500).json({ error: err.message });
      }
      continue;
    }
  }

  return res.status(503).json({ error: 'All Claude model variants unavailable.' });
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌿 OrganicPath CA API server running on http://localhost:${PORT}`);
  console.log(`   ANTHROPIC_API_KEY: ${process.env.ANTHROPIC_API_KEY ? '✅ set' : '❌ not set — add to .env.local'}`);
});

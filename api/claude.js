export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system, stream = false } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    process.env.VITE_ANTHROPIC_API_KEY ||
    process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
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

      if (response.status === 404) continue; // try next model

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
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
            if (line.startsWith('event: content_block_delta')) continue;

            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              try {
                const json = JSON.parse(data);
                const text = json.delta?.text || '';
                if (text) {
                  res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
                }
                if (json.type === 'message_stop') {
                  res.write('data: [DONE]\n\n');
                  res.end();
                  return;
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
      if (model === modelCandidates[modelCandidates.length - 1]) {
        return res.status(500).json({ error: err.message });
      }
      continue;
    }
  }

  return res.status(503).json({ error: 'All Claude model variants unavailable. Please try again.' });
}

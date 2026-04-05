import { Router } from 'express';

const router = Router();
const QUIVER_BASE_URL = 'https://api.quiver.ai/v1';

router.post('/quiver/svgs/generations', async (req, res) => {
  const apiKey = process.env.QUIVER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'QUIVER_API_KEY is not configured' });
  }

  try {
    const response = await fetch(`${QUIVER_BASE_URL}/svgs/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Quiver API error: ${response.status}`);
    }

    res.json({ data });
  } catch (error) {
    console.error('Quiver generations error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/quiver/svgs/vectorizations', async (req, res) => {
  const apiKey = process.env.QUIVER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'QUIVER_API_KEY is not configured' });
  }

  try {
    const response = await fetch(`${QUIVER_BASE_URL}/svgs/vectorizations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Quiver API error: ${response.status}`);
    }

    res.json({ data });
  } catch (error) {
    console.error('Quiver vectorizations error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

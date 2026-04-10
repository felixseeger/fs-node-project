import { Router } from 'express';

const router = Router();
const TRIPO_BASE_URL = 'https://api.tripo3d.ai/v2/openapi';

function getTripoApiKey() {
  return process.env.TRIPO3D_API_KEY || process.env.TRIPO_API_KEY;
}

router.post('/tripo/task', async (req, res) => {
  const apiKey = getTripoApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'TRIPO3D_API_KEY is not configured' });
  }

  try {
    const response = await fetch(`${TRIPO_BASE_URL}/task`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const data = await response.json();
    if (!response.ok || data?.code !== 0) {
      const message = data?.message || data?.msg || `Tripo3D API error: ${response.status}`;
      return res.status(response.ok ? 400 : response.status).json({ error: message, details: data });
    }

    res.json(data);
  } catch (error) {
    console.error('Tripo3D create task error:', error);
    res.status(500).json({ error: error.message || 'Failed to create Tripo3D task' });
  }
});

router.get('/tripo/task/:taskId', async (req, res) => {
  const apiKey = getTripoApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'TRIPO3D_API_KEY is not configured' });
  }

  try {
    const response = await fetch(`${TRIPO_BASE_URL}/task/${encodeURIComponent(req.params.taskId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok || data?.code !== 0) {
      const message = data?.message || data?.msg || `Tripo3D API error: ${response.status}`;
      return res.status(response.ok ? 400 : response.status).json({ error: message, details: data });
    }

    res.json(data);
  } catch (error) {
    console.error('Tripo3D task status error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch Tripo3D task status' });
  }
});

export default router;

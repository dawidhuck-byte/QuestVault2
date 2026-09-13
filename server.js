const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Real Roblox user search proxy
app.get('/api/search', async (req, res) => {
  const keyword = (req.query.q || '').trim();
  if (!keyword || keyword.length < 2) {
    return res.json({ data: [] });
  }

  try {
    const url = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(keyword)}&limit=12`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Froblok/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Roblox search status:', response.status);
      return res.status(502).json({ error: 'Roblox API error', status: response.status });
    }

    const json = await response.json();
    const users = (json.data || []).map(u => ({
      id: u.id,
      name: u.name,
      displayName: u.displayName || u.name,
      hasVerifiedBadge: !!u.hasVerifiedBadge
    }));

    res.json({ data: users });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed', message: err.message });
  }
});

// Avatar headshot proxy (avoids CORS + gives consistent size)
app.get('/api/avatar/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!/^\d+$/.test(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`;
    const response = await fetch(url);
    const json = await response.json();

    if (json.data && json.data[0] && json.data[0].imageUrl) {
      // Redirect to the actual image so <img> works cleanly
      return res.redirect(json.data[0].imageUrl);
    }

    // Fallback transparent 1x1
    res.status(404).send('No avatar');
  } catch (err) {
    console.error('Avatar error:', err.message);
    res.status(500).json({ error: 'Avatar failed' });
  }
});

// User details (optional extra info)
app.get('/api/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!/^\d+$/.test(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const url = `https://users.roblox.com/v1/users/${userId}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'User not found' });
    }
    const data = await response.json();
    res.json({
      id: data.id,
      name: data.name,
      displayName: data.displayName,
      description: data.description || '',
      created: data.created,
      isBanned: data.isBanned,
      hasVerifiedBadge: data.hasVerifiedBadge
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Froblok running at http://localhost:${PORT}`);
});

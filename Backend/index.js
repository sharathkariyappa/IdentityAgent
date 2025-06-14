// backend/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/api/github/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.redirect(
      `http://localhost:5173/github/callback?data=${encodeURIComponent(
        JSON.stringify(userRes.data)
      )}`
    );    
  } catch (err) {
    console.error('GitHub Auth Error:', err?.response?.data || err.message);
    res.status(500).send('GitHub auth failed');
  }
});

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});

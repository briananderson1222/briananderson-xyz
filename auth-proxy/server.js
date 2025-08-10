import express from 'express';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch';

const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8080;

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

function randomState(len = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

app.get('/auth', (req, res) => {
  const state = randomState();
  res.cookie('oauth_state', state, { httpOnly: true, sameSite: 'lax', secure: true });
  const redirectUri = `${BASE_URL}/callback`;
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'repo,user:email');
  url.searchParams.set('state', state);
  res.redirect(url.toString());
});

app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state || !req.cookies.oauth_state || state !== req.cookies.oauth_state) {
    return res.status(400).send('Invalid state');
  }
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: `${BASE_URL}/callback`,
        state
      })
    });
    const data = await tokenRes.json();
    const token = data.access_token;
    if (!token) return res.status(400).send('Token exchange failed');
    res.set('Content-Type', 'text/html');
    res.send(`<!doctype html><html><body>
<script>
  if (window.opener) {
    window.opener.postMessage('authorization:github:success:${token}', '*');
    window.close();
  } else { document.body.innerText = 'Token: ${token}'; }
</script>
</body></html>`);
  } catch (e) {
    res.status(500).send('OAuth error');
  }
});

app.get('/', (req, res) => res.send('Decap GitHub OAuth Proxy OK'));
app.listen(port, () => console.log(`Auth proxy on ${port}`));

export default function handler(req, res) {
  const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_HOST } = process.env;

  const url = new URL(req.url, OAUTH_HOST);
  const path = url.pathname;

  if (req.method === 'GET' && path === '/api/auth') {
    // Iniciar el flujo OAuth
    const redirectUri = `${OAUTH_HOST}/api/auth/callback`;
    const githubAuthUrl =
`https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo`;
    res.writeHead(302, { Location: githubAuthUrl });
    res.end();
    return;
  }

  if (req.method === 'GET' && path === '/api/auth/callback') {
    // Intercambiar el código por un token
    const code = url.searchParams.get('code');

    if (!code) {
      res.status(400).json({ error: 'Missing code' });
      return;
    }

    const tokenUrl =
`https://github.com/login/oauth/access_token?client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&code=${co
de}`;

    fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.access_token) {
        res.writeHead(302, {
          Location: `${OAUTH_HOST}/admin/#access_token=${data.access_token}&token_type=bearer`,
        });
        res.end();
      } else {
        res.status(400).json({ error: 'Failed to get access token', details: data });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    });
    return;
  }

  res.status(404).json({ error: 'Not found' });
}
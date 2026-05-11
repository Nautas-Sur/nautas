export default async function handler(req, res) {
  const { code } = req.query;

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  res.setHeader('Content-Type', 'text/html');

  if (data.error || !data.access_token) {
    const errMsg = JSON.stringify({ error: data.error_description || data.error || 'Unknown error' });
    res.send(`<!DOCTYPE html><html><body><script>
(function(){function r(e){window.opener.postMessage('authorization:github:error:${errMsg}',e.origin);}
window.addEventListener("message",r,false);window.opener.postMessage("authorizing:github","*");})();
<\/script></body></html>`);
    return;
  }

  const tokenJson = JSON.stringify(data.access_token);
  res.send(`<!DOCTYPE html><html><body><script>
(function(){
var t=${tokenJson};
var msg='authorization:github:success:'+JSON.stringify({token:t,provider:'github'});
function r(e){window.opener.postMessage(msg,e.origin);}
window.addEventListener("message",r,false);
window.opener.postMessage("authorizing:github","*");
})();
<\/script></body></html>`);
}

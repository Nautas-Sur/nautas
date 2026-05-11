import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'https://github.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '',
  },
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.method === 'POST' && req.url.includes('/access_token')) {
        proxyReq.setHeader('Accept', 'application/json');
      }
    },
  },
});

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
// Visitor counter. Mendukung Redis biasa (REDIS_URL, mis. Redis Cloud) dan Upstash REST.
const { createClient } = require('redis');
const KEY = 'hanzpiw:visits';
const pick = (...suffixes) => {
  for (const s of suffixes) {
    const k = Object.keys(process.env).find((n) => n === s || n.endsWith('_' + s));
    if (k && process.env[k]) return process.env[k];
  }
};
let client;
const getClient = async (url) => {
  if (client && client.isOpen) return client;
  client = createClient({ url, socket: { connectTimeout: 5000 } });
  client.on('error', () => {});
  await client.connect();
  return client;
};
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const incr = req.method === 'POST';
  try {
    const restUrl = pick('UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL');
    const restToken = pick('UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN');
    if (restUrl && restToken) {
      const r = await fetch(`${restUrl}/${incr ? 'incr' : 'get'}/${KEY}`, { headers: { Authorization: `Bearer ${restToken}` } });
      const j = await r.json();
      return res.status(200).json({ count: Number(j.result) || 0 });
    }
    const redisUrl = pick('REDIS_URL');
    if (!redisUrl) return res.status(503).json({ error: 'storage_not_configured' });
    const c = await getClient(redisUrl);
    const v = incr ? await c.incr(KEY) : await c.get(KEY);
    res.status(200).json({ count: Number(v) || 0 });
  } catch (e) {
    console.error('visit error:', e && e.message);
    res.status(500).json({ error: 'failed' });
  }
};

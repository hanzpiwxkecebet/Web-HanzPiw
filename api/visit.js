// Visitor counter via Upstash Redis REST (Vercel Marketplace / Vercel KV).
// Env: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (atau KV_REST_API_URL + KV_REST_API_TOKEN)
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(503).json({ error: 'storage_not_configured' });
  try {
    const cmd = req.method === 'POST' ? 'incr' : 'get';
    const r = await fetch(`${url}/${cmd}/hanzpiw:visits`, { headers: { Authorization: `Bearer ${token}` } });
    const j = await r.json();
    res.status(200).json({ count: Number(j.result) || 0 });
  } catch (e) {
    res.status(500).json({ error: 'failed' });
  }
};

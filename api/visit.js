// Visitor counter via Upstash Redis REST (Vercel Marketplace).
// Mendeteksi env var otomatis, termasuk yang memakai prefix custom (mis. STORAGE_KV_REST_API_URL).
const pick = (...suffixes) => {
  for (const s of suffixes) {
    const k = Object.keys(process.env).find((n) => n === s || n.endsWith('_' + s));
    if (k && process.env[k]) return process.env[k];
  }
};
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const url = pick('UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL');
  const token = pick('UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN');
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

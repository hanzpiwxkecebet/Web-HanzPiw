// Visitor counter via Upstash Redis REST (Vercel Marketplace).
// Mendeteksi env var otomatis: *_REST_API_URL/TOKEN, UPSTASH_REDIS_REST_*, atau fallback ke REDIS_URL.
const pick = (...suffixes) => {
  for (const s of suffixes) {
    const k = Object.keys(process.env).find((n) => n === s || n.endsWith('_' + s));
    if (k && process.env[k]) return process.env[k];
  }
};
const getConfig = () => {
  let url = pick('UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL');
  let token = pick('UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_TOKEN');
  if (url && token) return { url, token };
  const ru = pick('REDIS_URL', 'KV_URL'); // rediss://default:TOKEN@host:6379
  if (ru) {
    try {
      const u = new URL(ru);
      return { url: `https://${u.hostname}`, token: decodeURIComponent(u.password) };
    } catch (e) {}
  }
  return {};
};
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const { url, token } = getConfig();
  if (!url || !token) return res.status(503).json({ error: 'storage_not_configured' });
  try {
    const cmd = req.method === 'POST' ? 'incr' : 'get';
    const r = await fetch(`${url}/${cmd}/hanzpiw:visits`, { headers: { Authorization: `Bearer ${token}` } });
    const j = await r.json();
    if (j.error) return res.status(502).json({ error: 'redis_error' });
    res.status(200).json({ count: Number(j.result) || 0 });
  } catch (e) {
    res.status(500).json({ error: 'failed' });
  }
};

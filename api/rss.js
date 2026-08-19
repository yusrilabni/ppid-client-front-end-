export default async function handler(req, res) {
  try {
    const response = await fetch('https://humas.sinjaikab.go.id/v1/rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/rss+xml');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS' });
  }
}

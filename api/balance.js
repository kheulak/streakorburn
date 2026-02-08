import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress } = req.query;

  if (!userAddress) {
    return res.status(400).json({ error: 'Missing userAddress' });
  }

  try {
    // --- CONNECT USING YOUR SPECIFIC KEYS ---
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    // ----------------------------------------
    
    const balance = await redis.get(`balance:${userAddress}`);

    return res.status(200).json({ 
      success: true, 
      balance: balance ? parseFloat(balance) : 0 
    });

  } catch (error) {
    console.error("Balance Fetch Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

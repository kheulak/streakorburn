import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  const { userAddress } = req.query;

  // --- GET: Fetch All Streaks & Real Balance ---
  if (req.method === 'GET') {
    if (!userAddress) return res.status(400).json({ error: 'Missing address' });

    try {
      const history = await redis.get(`streaks:${userAddress}`) || [];
      const realBalance = await redis.get(`balance:${userAddress}`) || 0;

      return res.status(200).json({ 
        history, 
        realBalance: parseFloat(realBalance)
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // --- POST: Create New Streak (Lock Real Stake) ---
  if (req.method === 'POST') {
    const { userAddress, stake, picks } = req.body;

    try {
      // 1. Validate Inputs
      if (!stake || parseFloat(stake) < 1 || parseFloat(stake) > 50) {
          return res.status(400).json({ error: 'Invalid Stake. Must be 1-50 SOL.' });
      }
      if (!picks || picks.length !== 10) {
          return res.status(400).json({ error: 'Invalid Picks. Must be exactly 10.' });
      }

      // 2. Validate & Deduct Real Funds
      const currentBal = await redis.get(`balance:${userAddress}`);
      if (!currentBal || parseFloat(currentBal) < parseFloat(stake)) {
        return res.status(403).json({ error: 'Insufficient SOL Balance in Vault' });
      }
      
      // Deduct the stake immediately
      await redis.incrbyfloat(`balance:${userAddress}`, -parseFloat(stake));

      // 3. Create Streak Object
      const newStreak = {
        id: `STREAK-${Date.now()}`,
        date: new Date().toISOString(),
        mode: 'real',
        stake: parseFloat(stake),
        potentialPayout: parseFloat(stake) * 3, // 3x Multiplier Rule
        status: 'PENDING', // Always PENDING before event
        progress: '10/10',
        picks: picks
      };

      // 4. Save to History
      let history = await redis.get(`streaks:${userAddress}`) || [];
      history.unshift(newStreak); // Add to top
      await redis.set(`streaks:${userAddress}`, history);

      // 5. Return new data
      const newReal = await redis.get(`balance:${userAddress}`);

      return res.status(200).json({ 
        success: true, 
        streak: newStreak,
        realBalance: parseFloat(newReal || 0)
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

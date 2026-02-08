import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  const { userAddress } = req.query;

  // --- GET: Fetch All Streaks & Balances ---
  if (req.method === 'GET') {
    if (!userAddress) return res.status(400).json({ error: 'Missing address' });

    try {
      const history = await redis.get(`streaks:${userAddress}`) || [];
      const realBalance = await redis.get(`balance:${userAddress}`) || 0;
      const simBalance = await redis.get(`sim_balance:${userAddress}`) || 1000; // Default 1000 Sim SOL

      return res.status(200).json({ 
        history, 
        realBalance: parseFloat(realBalance), 
        simBalance: parseFloat(simBalance) 
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // --- POST: Create New Streak (Lock Stake) ---
  if (req.method === 'POST') {
    const { userAddress, mode, stake, picks } = req.body;

    try {
      // 1. Validate & Deduct Funds
      if (mode === 'real') {
        const currentBal = await redis.get(`balance:${userAddress}`);
        if (!currentBal || parseFloat(currentBal) < parseFloat(stake)) {
          return res.status(403).json({ error: 'Insufficient Real SOL' });
        }
        await redis.incrbyfloat(`balance:${userAddress}`, -parseFloat(stake));
      } else {
        // Sim Mode
        const currentSim = await redis.get(`sim_balance:${userAddress}`) || 1000;
        if (parseFloat(currentSim) < parseFloat(stake)) {
          return res.status(403).json({ error: 'Insufficient Sim SOL' });
        }
        await redis.incrbyfloat(`sim_balance:${userAddress}`, -parseFloat(stake));
      }

      // 2. Create Streak Object
      const newStreak = {
        id: `STREAK-${Date.now()}`,
        date: new Date().toISOString(),
        mode,
        stake: parseFloat(stake),
        potentialPayout: parseFloat(stake) * 3, // 3x Multiplier Rule
        status: 'PENDING', // Always PENDING before event
        progress: '10/10',
        picks: picks // Array of 10 predictions
      };

      // 3. Save to History
      let history = await redis.get(`streaks:${userAddress}`) || [];
      history.unshift(newStreak); // Add to top
      await redis.set(`streaks:${userAddress}`, history);

      // 4. Return new data
      const newReal = await redis.get(`balance:${userAddress}`);
      const newSim = await redis.get(`sim_balance:${userAddress}`) || 1000;

      return res.status(200).json({ 
        success: true, 
        streak: newStreak,
        realBalance: parseFloat(newReal || 0),
        simBalance: parseFloat(newSim)
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // NOTE: Leverage removed as requested. 
  // We strictly use the probability to determine payout.
  const { userAddress, amount, prediction, odds } = req.body;

  try {
    // 1. CONNECT TO DB (Using Vercel Keys)
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // 2. CHECK BALANCE
    const currentBalance = await redis.get(`balance:${userAddress}`);
    if (!currentBalance || parseFloat(currentBalance) < parseFloat(amount)) {
      return res.status(403).json({ error: 'Insufficient Funds' });
    }

    // 3. DEDUCT BET (BURN MECHANISM START)
    // The money is gone immediately. You only get it back if you win.
    await redis.incrbyfloat(`balance:${userAddress}`, -parseFloat(amount));

    // 4. DETERMINE WINNER (Using Real Polymarket Odds)
    // prediction: true (Left Button/Outcome 1) or false (Right Button/Outcome 2)
    // odds: The price of the outcome selected.
    
    // Simulation:
    const randomValue = Math.random();
    const isWin = randomValue < parseFloat(odds);

    let payout = 0;
    let newBalance = await redis.get(`balance:${userAddress}`); // Refresh balance

    if (isWin) {
      // WINNER LOGIC:
      // Payout = Stake / Probability. 
      // (e.g. 1 SOL on 50% odds = 2 SOL returned).
      const rawPayout = parseFloat(amount) / parseFloat(odds);
      
      // House Fee (2%) - We take a small cut from the winnings
      const fee = rawPayout * 0.02;
      payout = rawPayout - fee;

      // Credit Winnings
      newBalance = await redis.incrbyfloat(`balance:${userAddress}`, payout);
    } 
    // IF LOSS: We do nothing. The money was already deducted in Step 3 (Burned).

    return res.status(200).json({ 
      success: true, 
      isWin: isWin, 
      payout: payout,
      newBalance: parseFloat(newBalance)
    });

  } catch (error) {
    console.error("Bet Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // We now accept 'odds' (probability) from the frontend
  const { userAddress, amount, leverage, prediction, odds } = req.body;

  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // 1. SECURITY: Check Balance
    const currentBalance = await redis.get(`balance:${userAddress}`);
    if (!currentBalance || parseFloat(currentBalance) < parseFloat(amount)) {
      return res.status(403).json({ error: 'Insufficient Funds' });
    }

    // 2. DEDUCT BET
    await redis.incrbyfloat(`balance:${userAddress}`, -parseFloat(amount));

    // 3. DETERMINE WIN CHANCE (Based on REAL Polymarket Odds)
    // If Polymarket says 60% (0.60), we use 0.60.
    // HOUSE EDGE: We assume the Polymarket price IS the probability.
    // To ensure profit, we can slightly "worsen" the odds for the user in the RNG,
    // OR we just take a fee on the payout. Let's take a fee on payout.
    
    const probability = parseFloat(odds); 
    const isWin = Math.random() < probability; // Simulation based on real world odds

    let payout = 0;
    
    if (isWin) {
      // 4. CALCULATE PAYOUT
      // Standard Payout = Bet / Probability. (e.g. 1 / 0.50 = 2x).
      // Leveraged Profit = (Standard Profit) * Leverage.
      
      const standardPayout = amount / probability;
      const rawProfit = standardPayout - amount;
      
      // Apply Leverage to the PROFIT portion only (Safer for Vault)
      const leveragedProfit = rawProfit * leverage;
      
      // Apply House Fee (e.g. 5% of profit)
      const houseFee = leveragedProfit * 0.05;
      const finalProfit = leveragedProfit - houseFee;

      payout = amount + finalProfit;

      // Update Ledger
      await redis.incrbyfloat(`balance:${userAddress}`, payout);
    }

    return res.status(200).json({ 
      success: true, 
      isWin: isWin, 
      payout: payout,
      oddsUsed: probability 
    });

  } catch (error) {
    console.error("Bet Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

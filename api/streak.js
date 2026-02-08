import { Redis } from '@upstash/redis';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  const { userAddress } = req.query;

  // --- GET: Fetch History & ON-CHAIN Balance ---
  if (req.method === 'GET') {
    if (!userAddress) return res.status(400).json({ error: 'Missing address' });

    try {
      const history = await redis.get(`streaks:${userAddress}`) || [];
      
      // FETCH REAL ON-CHAIN BALANCE
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);
      const balanceLamports = await connection.getBalance(new PublicKey(userAddress));
      const realBalance = balanceLamports / LAMPORTS_PER_SOL;

      return res.status(200).json({ 
        history, 
        realBalance: parseFloat(realBalance)
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- POST: Start Streak (Transfer Funds to House) ---
  if (req.method === 'POST') {
    const { userAddress, stake, picks } = req.body;

    // 1. UPDATE LIMITS: 0.05 SOL to 500 SOL
    if (!stake || parseFloat(stake) < 0.05 || parseFloat(stake) > 500) {
        return res.status(400).json({ error: 'Invalid Stake. Must be 0.05 - 500 SOL.' });
    }
    if (!picks || picks.length !== 10) {
        return res.status(400).json({ error: 'Invalid Picks. Must be exactly 10.' });
    }

    try {
      // 2. Retrieve User's Private Key
      const secretKeyStr = await redis.get(`private_key:${userAddress}`);
      if (!secretKeyStr) {
          return res.status(403).json({ error: 'Account not found. Please re-login.' });
      }

      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);
      const userKeypair = Keypair.fromSecretKey(bs58.decode(secretKeyStr));
      const housePubkey = new PublicKey("9JHxS6rkddGG48ZTaLUtNaY8UBoZNpKsCgeXhJTKQDTt"); // House/Vault Address

      // 3. Check On-Chain Balance before attempting transfer
      const balanceLamports = await connection.getBalance(userKeypair.publicKey);
      const stakeLamports = parseFloat(stake) * LAMPORTS_PER_SOL;
      
      // Leave a tiny bit for gas (0.001 SOL)
      if (balanceLamports < (stakeLamports + 5000)) {
          return res.status(403).json({ error: 'Insufficient SOL Balance in Generated Wallet' });
      }

      // 4. EXECUTE TRANSFER: User Wallet -> House Wallet (Major Vault)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: userKeypair.publicKey,
          toPubkey: housePubkey,
          lamports: Math.floor(stakeLamports),
        })
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [userKeypair]
      );

      // 5. Create Streak Object (Only after successful transfer)
      const newStreak = {
        id: `STREAK-${Date.now()}`,
        date: new Date().toISOString(),
        mode: 'real',
        stake: parseFloat(stake),
        potentialPayout: parseFloat(stake) * 3, // 3x Multiplier
        status: 'PENDING',
        progress: '10/10',
        picks: picks,
        txSignature: signature
      };

      // 6. Save to History
      let history = await redis.get(`streaks:${userAddress}`) || [];
      history.unshift(newStreak);
      await redis.set(`streaks:${userAddress}`, history);

      // 7. Return new balance
      const newBalanceLamports = await connection.getBalance(userKeypair.publicKey);

      return res.status(200).json({ 
        success: true, 
        streak: newStreak,
        realBalance: newBalanceLamports / LAMPORTS_PER_SOL
      });

    } catch (error) {
      console.error("Streak Creation Error:", error);
      return res.status(500).json({ error: "Transaction Failed: " + error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

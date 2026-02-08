import { Redis } from '@upstash/redis';
import { Connection } from '@solana/web3.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { signature, userAddress } = req.body;

  try {
    // --- CONNECT USING YOUR SPECIFIC KEYS ---
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    // ----------------------------------------
    
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);

    // Replay Protection
    const exists = await redis.get(`tx:${signature}`);
    if (exists) {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    // Verify Transaction
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed' 
    });

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found on chain' });
    }

    const accountKeys = tx.transaction.message.accountKeys.map(k => k.pubkey.toString());
    const userIndex = accountKeys.findIndex(k => k === userAddress);
    
    if (userIndex === -1) return res.status(400).json({ error: 'User not found in transaction' });

    const preBalance = tx.meta.preBalances[userIndex];
    const postBalance = tx.meta.postBalances[userIndex];
    const diff = preBalance - postBalance;

    if (diff <= 5000) return res.status(400).json({ error: 'No SOL transferred' });

    const amountDeposited = (diff - 5000) / 1000000000; 

    // Update Ledger
    await redis.incrbyfloat(`balance:${userAddress}`, amountDeposited);
    await redis.set(`tx:${signature}`, 'processed'); 

    return res.status(200).json({ success: true, newBalance: amountDeposited });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

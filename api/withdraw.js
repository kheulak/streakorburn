import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { Redis } from '@upstash/redis';
import bs58 from 'bs58';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userAddress, amount } = req.body;
    
    // --- CONNECT USING YOUR SPECIFIC KEYS ---
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    // ----------------------------------------

    // Check Ledger
    const currentBalance = await redis.get(`balance:${userAddress}`);
    
    if (!currentBalance || parseFloat(currentBalance) < parseFloat(amount)) {
      return res.status(403).json({ error: 'INSUFFICIENT FUNDS. Request Denied.' });
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);
    const privateKeyString = process.env.HOUSE_PRIVATE_KEY;
    const houseKeypair = Keypair.fromSecretKey(bs58.decode(privateKeyString));

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: houseKeypair.publicKey,
        toPubkey: new PublicKey(userAddress),
        lamports: Math.floor(amount * 1000000000), 
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [houseKeypair]
    );

    // Deduct Balance
    await redis.incrbyfloat(`balance:${userAddress}`, -parseFloat(amount));

    return res.status(200).json({ status: 'success', signature });

  } catch (error) {
    console.error("Withdraw Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

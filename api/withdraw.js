import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Redis } from '@upstash/redis';
import bs58 from 'bs58';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userAddress, amount, destinationAddress } = req.body;
    
    if (!destinationAddress) return res.status(400).json({ error: "Destination required" });

    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // 1. Get Keys
    const secretKeyStr = await redis.get(`private_key:${userAddress}`);
    if (!secretKeyStr) return res.status(403).json({ error: 'Account not found.' });

    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);
    const userKeypair = Keypair.fromSecretKey(bs58.decode(secretKeyStr));
    const destPubkey = new PublicKey(destinationAddress);

    // 2. Execute Transfer
    const withdrawLamports = parseFloat(amount) * LAMPORTS_PER_SOL;
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: userKeypair.publicKey,
        toPubkey: destPubkey,
        lamports: Math.floor(withdrawLamports), 
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [userKeypair]);

    return res.status(200).json({ status: 'success', signature });

  } catch (error) {
    console.error("Withdraw Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

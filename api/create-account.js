import { Keypair } from '@solana/web3.js';
import { Redis } from '@upstash/redis';
import bs58 from 'bs58';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // 1. Generate New Solana Keypair (Custodial Wallet)
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const secretKey = bs58.encode(keypair.secretKey);

    // 2. Store Securely
    // We map the public key to the private key for backend signing
    await redis.set(`private_key:${publicKey}`, secretKey);
    
    // Initialize empty streak history
    await redis.set(`streaks:${publicKey}`, []);

    // 3. Return keys to frontend (User MUST save these)
    return res.status(200).json({ 
      success: true,
      publicKey, 
      secretKey 
    });

  } catch (error) {
    console.error("Account Creation Error:", error);
    return res.status(500).json({ error: "Failed to create account" });
  }
}

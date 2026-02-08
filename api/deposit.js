import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress } = req.body;

  if (!userAddress) {
    return res.status(400).json({ error: 'Missing user address' });
  }

  try {
    // 1. Connect to Solana
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL);

    // 2. Check Real On-Chain Balance of the Generated Wallet
    const balanceLamports = await connection.getBalance(new PublicKey(userAddress));
    const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

    return res.status(200).json({ 
      success: true, 
      newBalance: balanceSol 
    });

  } catch (error) {
    console.error("Deposit Check Error:", error);
    return res.status(500).json({ error: "Failed to check deposits" });
  }
}

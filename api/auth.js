import { Redis } from '@upstash/redis';
import crypto from 'crypto';

export default async function handler(req, res) {
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  const { action, username, password, publicKey } = req.body;

  // Helper to hash password
  const hashPassword = (pass) => crypto.createHash('sha256').update(pass).digest('hex');

  try {
    // --- REGISTER ---
    if (action === 'register') {
      if (!username || !password || !publicKey) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const userKey = `user:${username.toLowerCase()}`;
      
      // Check if user exists
      const exists = await redis.exists(userKey);
      if (exists) {
        return res.status(409).json({ error: "Username already taken" });
      }

      // Store Credentials
      await redis.set(userKey, JSON.stringify({
        passwordHash: hashPassword(password),
        publicKey: publicKey
      }));

      return res.status(200).json({ success: true });
    }

    // --- LOGIN ---
    if (action === 'login') {
      if (!username || !password) {
        return res.status(400).json({ error: "Missing credentials" });
      }

      const userKey = `user:${username.toLowerCase()}`;
      const userData = await redis.get(userKey);

      if (!userData) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Parse stored data (Upstash sometimes returns object directly, sometimes string depending on client config, handle both)
      const userObj = typeof userData === 'string' ? JSON.parse(userData) : userData;

      if (userObj.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      return res.status(200).json({ success: true, publicKey: userObj.publicKey });
    }

    return res.status(400).json({ error: "Invalid action" });

  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

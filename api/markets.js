export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Fetch Super Bowl Events from Polymarket Gamma API
    // We search for "Super Bowl" and ensure the market is active.
    const response = await fetch(
      'https://gamma-api.polymarket.com/events?limit=10&active=true&closed=false&slug=super-bowl'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Polymarket');
    }

    const data = await response.json();

    // 2. Filter & Format Data for your App
    // We only want the main "Winner" market or interesting prop bets
    const formattedMarkets = data.map(event => {
      // Find the main market (usually the first one in the event)
      const market = event.markets[0]; 
      
      // Calculate implied probability from the price
      // Polymarket prices are 0 to 1. E.g. 0.65 = 65% chance.
      const outcomes = JSON.parse(market.outcomes);
      const prices = JSON.parse(market.outcomePrices);

      return {
        id: market.id,
        question: event.title, // e.g. "Super Bowl LVIII Winner"
        category: "SUPER BOWL LX",
        // Use the event image from Polymarket
        img: event.image || "https://polymarket.com/images/default-event.png",
        // Pass the live odds to the frontend
        outcome_yes: outcomes[0],
        price_yes: Number(prices[0]),
        outcome_no: outcomes[1],
        price_no: Number(prices[1]),
        volume: market.volume,
        slug: event.slug
      };
    });

    return res.status(200).json(formattedMarkets);

  } catch (error) {
    console.error("Polymarket Fetch Error:", error);
    // Fallback data if API fails (so app doesn't crash)
    return res.status(200).json([
      { 
        id: "fallback-1", 
        question: "Chiefs vs 49ers (API Limit)", 
        category: "FALLBACK", 
        price_yes: 0.55, 
        img: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800" 
      }
    ]);
  }
}

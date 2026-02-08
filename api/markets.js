export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // The specific Super Bowl LX events you requested
  const SLUGS = [
    "super-bowl-champion-2026-731",
    "super-bowl-lx-mvp",
    "who-will-perform-at-super-bowl-halftime-show",
    "super-bowl-lx-gatorade-shower-color",
    "super-bowl-lx-national-anthem-time",
    "super-bowl-lx-coin-toss",
    "will-bad-bunny-say-fuck-ice-at-the-super-bowl",
    "bad-bunny-wears-a-dress-at-the-super-bowl",
    "super-bowl-lx-overtime",
    "scorigami-in-super-bowl-lx",
    "will-super-bowl-lx-be-the-most-viewed-super-bowl-ever",
    "pro-football-championship-player-to-cry-during-national-anthem",
    "super-bowl-winning-division",
    "super-bowl-lx-coin-toss-team-winner",
    "super-bowl-lx-winning-seed",
    "super-bowl-winning-conference",
    "super-bowl-lx-first-timeout"
  ];

  try {
    // Fetch data for ALL slugs in parallel (Fast!)
    const requests = SLUGS.map(slug => 
      fetch(`https://gamma-api.polymarket.com/events?slug=${slug}`)
        .then(r => r.json())
        .catch(e => null) // Ignore errors for individual broken links
    );

    const results = await Promise.all(requests);

    // Process and format the data for your frontend
    const cleanMarkets = results
      .flat()
      .filter(event => event && event.markets && event.markets.length > 0)
      .map(event => {
        const market = event.markets[0]; // Get the main betting market
        const outcomes = JSON.parse(market.outcomes); // e.g. ["Seahawks", "Patriots"]
        const prices = JSON.parse(market.outcomePrices); // e.g. ["0.65", "0.35"]

        return {
          id: market.id,
          question: event.title,
          category: "SUPER BOWL LX", // Hardcoded category for style
          img: event.image || "https://polymarket.com/images/default-event.png",
          
          // Real Data for Buttons
          outcome_yes: outcomes[0],
          price_yes: Number(prices[0]),
          
          outcome_no: outcomes[1] || "Field", // Handle multi-choice
          price_no: Number(prices[1]) || (1 - Number(prices[0])),
          
          volume: market.volume,
          slug: event.slug
        };
      });

    return res.status(200).json(cleanMarkets);

  } catch (error) {
    console.error("Polymarket Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch live odds" });
  }
}

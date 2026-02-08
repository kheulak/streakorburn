export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Exact list of Polymarket Events (Slugs)
  const SLUGS = [
    "super-bowl-champion-2026-731",
    "super-bowl-lx-mvp",
    "who-will-perform-at-super-bowl-halftime-show",
    "first-song-at-super-bowl-lx-halftime-show", 
    "super-bowl-lx-gatorade-shower-color",
    "super-bowl-lx-national-anthem-time",
    "super-bowl-lx-coin-toss",
    "what-songs-will-be-played-at-the-super-bowl-halftime-show",
    "who-will-attend-the-2026-pro-football-championship",
    "sup-bowl-national-anthem-ou-119pt5-seconds",
    "what-will-be-said-during-the-super-bowl",
    "will-bad-bunny-say-fuck-ice-at-the-super-bowl",
    "how-many-viewers-will-the-super-bowl-have",
    "last-song-at-2026-pro-football-championship-halftime-show",
    "super-bowl-lx-safety",
    "bad-bunny-wears-a-dress-at-the-super-bowl",
    "pro-football-championship-octopus",
    "super-bowl-lx-overtime",
    "scorigami-in-super-bowl-lx",
    "will-super-bowl-lx-be-the-most-viewed-super-bowl-ever",
    "pro-football-championship-player-to-cry-during-national-anthem",
    "super-bowl-lx-exact-outcome",
    "super-bowl-lx-first-team-score",
    "super-bowl-lx-oddeven-total-points",
    "super-bowl-winning-division",
    "pro-football-championship-big-man-touchdown",
    "super-bowl-lx-coin-toss-team-winner",
    "super-bowl-lx-coin-toss-winner-and-champion",
    "super-bowl-lx-winning-seed",
    "super-bowl-winning-conference",
    "super-bowl-lx-first-timeout"
  ];

  try {
    const requests = SLUGS.map(slug => 
      fetch(`https://gamma-api.polymarket.com/events?slug=${slug}`)
        .then(r => r.json())
        .catch(e => [])
    );

    const results = await Promise.all(requests);

    const cleanMarkets = results
      .flat()
      .filter(event => {
        // 1. Basic Availability Check
        if (!event || !event.markets || event.markets.length === 0) return false;
        
        const market = event.markets[0];
        // Parse prices securely
        let prices;
        try {
            prices = JSON.parse(market.outcomePrices);
        } catch (e) { return false; }

        if (!prices || prices.length < 2) return false;

        const p1 = Number(prices[0]);
        const p2 = Number(prices[1]);

        // 2. DATA SANITY CHECK: Filter out 0% or 100% markets (Invalid/Resolved/Broken)
        // We only want ACTIVE betting markets. 
        // If odds are 0 or 1, the market is effectively closed or broken for betting.
        if (p1 <= 0 || p1 >= 1 || p2 <= 0 || p2 >= 1) return false;

        // 3. Status Check
        if (market.closed || market.resolvedBy) return false;

        return true;
      })
      .map(event => {
        const market = event.markets[0]; 
        const outcomes = JSON.parse(market.outcomes); 
        const prices = JSON.parse(market.outcomePrices);

        // Logic to ensure Title vs Question is clear
        let mainQuestion = market.question;
        let subCategory = event.title;

        // Clean up redundant titles
        if (mainQuestion === "Winner" || mainQuestion === "Game Winner") {
            mainQuestion = event.title; 
            subCategory = "GAME LINES";
        }

        return {
          id: market.id, // Use Real Polymarket ID for locking
          question: mainQuestion, 
          category: subCategory, 
          // Ensure image is bound to this specific event iteration
          img: event.image || "https://polymarket.com/images/default-event.png",
          
          outcome_yes: outcomes[0], 
          price_yes: Number(prices[0]),
          
          outcome_no: outcomes[1], 
          price_no: Number(prices[1]),
          
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

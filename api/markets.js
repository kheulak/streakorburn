export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Exact list of Polymarket Events you requested
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
    // 1. Fetch all events in parallel
    const requests = SLUGS.map(slug => 
      fetch(`https://gamma-api.polymarket.com/events?slug=${slug}`)
        .then(r => r.json())
        .catch(e => [])
    );

    const results = await Promise.all(requests);

    // 2. Flatten and Format
    const cleanMarkets = results
      .flat()
      .filter(event => event && event.markets && event.markets.length > 0)
      .map(event => {
        // We take the most active market if multiple exist, or the first one
        const market = event.markets[0]; 
        
        const outcomes = JSON.parse(market.outcomes); // ["Yes", "No"] or ["Seahawks", "Patriots"]
        const prices = JSON.parse(market.outcomePrices);

        // LOGIC TO FIX NAMES:
        // If the question is "Winner", we use the Event Title as the main question.
        // If the question is specific (e.g. "Sam Darnold"), we use that.
        let mainQuestion = market.question;
        let subCategory = event.title;

        if (mainQuestion === "Winner" || mainQuestion === "Game Winner") {
            mainQuestion = event.title; // e.g. "Seahawks vs Patriots"
            subCategory = "GAME LINES";
        }

        return {
          id: market.id,
          // This ensures "Sam Darnold" shows up, not just "MVP"
          question: mainQuestion, 
          category: subCategory, 
          img: event.image || "https://polymarket.com/images/default-event.png",
          
          // Button Labels
          outcome_yes: outcomes[0], // "Yes" or "Seahawks"
          price_yes: Number(prices[0]),
          
          outcome_no: outcomes[1], // "No" or "Patriots"
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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Full List of Super Bowl LX Events
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
        // Basic check: Must have at least one market
        if (!event || !event.markets || event.markets.length === 0) return false;
        
        // REMOVED THE ODDS FILTER HERE. 
        // We now allow everything through, even if odds are 0% or 100%.
        
        return true;
      })
      .map(event => {
        const market = event.markets[0]; 
        let outcomes = ["Yes", "No"];
        let prices = ["0.5", "0.5"];

        try {
            outcomes = JSON.parse(market.outcomes); 
            prices = JSON.parse(market.outcomePrices);
        } catch (e) {
            console.error("Parse error for market:", market.id);
        }

        // Logic to ensure Title vs Question is clear
        let mainQuestion = market.question;
        let subCategory = event.title;

        if (mainQuestion === "Winner" || mainQuestion === "Game Winner") {
            mainQuestion = event.title; 
            subCategory = "GAME LINES";
        }

        return {
          id: market.id, 
          question: mainQuestion, 
          category: subCategory, 
          img: event.image || "https://polymarket.com/images/default-event.png",
          
          outcome_yes: outcomes[0] || "Yes", 
          price_yes: Number(prices[0]) || 0.5,
          
          outcome_no: outcomes[1] || "No", 
          price_no: Number(prices[1]) || 0.5,
          
          volume: market.volume,
          slug: event.slug
        };
      });

    return res.status(200).json(cleanMarkets);

  } catch (error) {
    console.error("Polymarket Fetch Error:", error);
    // Return empty array instead of error to keep app alive
    return res.status(200).json([]);
  }
}

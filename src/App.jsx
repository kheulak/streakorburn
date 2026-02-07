import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Lock,
  BarChart3,
  Menu,
  X,
  ArrowUpRight,
  Trophy,
  ChevronRight,
  Timer,
  Wallet2,
  Zap,
  Twitter,
  ExternalLink,
  Coins
} from 'lucide-react';

// --- UPDATED LOGO: THE BLUE FLAME (Obsidian Flare) ---
const CustomLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueFlameGradient" x1="50" y1="90" x2="50" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    {/* Outer Glow Path */}
    <path 
      d="M50 95C30 95 15 75 15 55C15 35 45 5 50 5C55 5 85 35 85 55C85 75 70 95 50 95Z" 
      fill="url(#blueFlameGradient)" 
      fillOpacity="0.15" 
    />
    {/* The Core Blue Flame */}
    <path 
      d="M50 90C35 90 25 78 25 60C25 45 40 25 50 10C60 25 75 45 75 60C75 78 65 90 50 90ZM50 75C58 75 63 68 63 58C63 48 50 35 50 35C50 35 37 48 37 58C37 68 42 75 50 75Z" 
      fill="url(#blueFlameGradient)" 
    />
    {/* Sharp Accent Lines */}
    <path d="M42 28L35 38M58 28L65 38" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// --- RESEARCHED SB LX (2026) BETTING DECK ---
const SUPER_BOWL_DECK = [
  { id: 1, question: "Coin Toss: Tails?", sub: "Beta Vol: 4,102", category: "PROPS" },
  { id: 2, question: "Total Points: Over 48.5?", sub: "Beta Vol: 12,119", category: "OVER/UNDER" },
  { id: 3, question: "Patrick Mahomes: 2.5+ Pass TDs?", sub: "Beta Vol: 8,942", category: "PLAYER" },
  { id: 4, question: "Gatorade Color: Purple?", sub: "Beta Vol: 3,055", category: "NOVELTY" },
  { id: 5, question: "Sack Count: Over 5.5?", sub: "Beta Vol: 5,201", category: "DEFENSE" },
  { id: 6, question: "Lamar Jackson: 55.5+ Rush Yards?", sub: "Beta Vol: 7,440", category: "PLAYER" }
];

const PREVIEW_MARKETS = [
  { id: 1, title: "SB LX: Points Spread", code: "SBLX-SPREAD", vol: "2.4M SOL", status: "LOCKED", liveDate: "FEB 08" },
  { id: 2, title: "Coin Toss Results", code: "PROP-042", vol: "1.1M SOL", status: "LOCKED", liveDate: "FEB 08" },
  { id: 3, title: "MVP Prediction", code: "PLAYER-MVP", vol: "0.8M SOL", status: "LOCKED", liveDate: "FEB 08" },
];

export default function App() {
  const [gameState, setGameState] = useState('landing'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [demoBalance, setDemoBalance] = useState(10.0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [activeLeverage, setActiveLeverage] = useState('2x');
  
  // Real Super Bowl LX Target: Feb 8, 2026 @ 6:30 PM ET
  const targetDate = useMemo(() => new Date('2026-02-08T18:30:00-05:00').getTime(), []);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setCountdown({ h: 0, m: 0, s: 0 });
        clearInterval(timer);
      } else {
        setCountdown({
          h: Math.floor((distance / (1000 * 60 * 60))),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleAction = (isYes) => {
    const isCorrect = Math.random() > 0.4; 
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setDemoBalance(prev => prev + (streak * 0.5 + 0.25)); 
      if (currentIdx === SUPER_BOWL_DECK.length - 1) setGameState('winner');
      else setCurrentIdx(prev => prev + 1);
    } else {
      setDemoBalance(prev => Math.max(0, prev - 1.0)); 
      setGameState('burned');
    }
  };

  const handleReset = () => {
    setGameState('landing');
    setCurrentIdx(0);
    setStreak(0);
    setShowEntryModal(false);
  };

  const navLinks = [
    { name: 'Live Terminal', active: true, icon: Zap },
    { name: 'Socials', active: false, icon: Twitter },
    { name: 'Buy $SOB', active: false, icon: Coins, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-[#E5E5E5] font-sans selection:bg-cyan-500/30 flex flex-col antialiased overflow-x-hidden">
      {/* Universal Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#0c1421_0%,transparent_50%)]" />
        <div className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-cyan-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40vw] h-[40vw] bg-purple-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="px-4 md:px-8 py-4 flex justify-between items-center border-b border-white/[0.03] bg-black/60 backdrop-blur-3xl sticky top-0 z-[100]">
        <div className="flex items-center gap-4 md:gap-12">
          <div onClick={handleReset} className="flex items-center gap-3 cursor-pointer group">
            <CustomLogo className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-lg md:text-xl uppercase leading-none italic">
                STREAK<span className="text-cyan-400">OR</span>BURN
              </span>
              <span className="text-[7px] font-bold text-neutral-500 uppercase tracking-[0.3em] mt-1">SUPER BOWL LX STREAKING</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href="#" 
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${link.active ? 'text-white' : link.highlight ? 'text-cyan-400 hover:text-white' : 'text-neutral-500 hover:text-white'}`}
              >
                <link.icon className="w-3 h-3" />
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {gameState !== 'landing' && (
            <div className="flex flex-col items-end px-3 md:px-6 border-r border-white/5">
              <span className="text-[7px] md:text-[8px] font-black text-cyan-400 uppercase tracking-[0.1em]">Simulator Funds</span>
              <span className="text-xs md:text-sm font-black text-white tabular-nums">{demoBalance.toFixed(2)} SOL</span>
            </div>
          )}

          <button 
            onClick={() => setShowEntryModal(true)}
            className="px-4 md:px-8 py-2 md:py-3 rounded bg-white text-black font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/5 active:scale-95 flex items-center gap-2"
          >
            <Wallet2 className="w-3 h-3" />
            <span className="hidden sm:inline">Access Platform</span>
            <span className="sm:hidden">Connect</span>
          </button>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-neutral-400">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="lg:hidden fixed inset-x-0 top-[65px] bg-black border-b border-white/10 z-[90] p-6 flex flex-col gap-6 backdrop-blur-xl"
          >
            {navLinks.map(link => (
              <a key={link.name} href="#" className={`flex items-center gap-4 text-xs font-black uppercase tracking-widest ${link.highlight ? 'text-cyan-400' : 'text-neutral-400'}`}>
                <link.icon className="w-4 h-4" />
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-8 lg:p-16 gap-12 lg:gap-16 z-10">
        
        {/* Left Column: Hero/Terminal */}
        <section className="flex-1 flex flex-col justify-center min-h-[50vh]">
          <AnimatePresence mode="wait">
            {gameState === 'landing' && (
              <motion.div key="landing" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl">
                <div className="inline-flex items-center gap-3 mb-6 md:mb-8 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">Deploying Feb 8, 2026</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-[8.5rem] font-black italic tracking-tighter leading-[0.85] mb-8 uppercase">
                  STREAK<br/>OR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">BURN.</span>
                </h1>
                <p className="text-neutral-500 text-base md:text-xl mb-10 leading-relaxed font-medium max-w-lg">
                  Aggressive prediction markets with up to 25x leverage. Built for the Super Bowl LX hype cycle.
                </p>
                <div className="flex flex-wrap gap-4 md:gap-6">
                  <button onClick={() => setShowEntryModal(true)} className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-white text-black rounded font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 group">
                    Enter Terminal <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-4 px-6 md:px-8 border-l border-white/10 mx-auto sm:mx-0">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-neutral-600 uppercase">Live Mainnet in</span>
                      <span className="text-lg md:text-xl font-black tabular-nums">{countdown.h}H {countdown.m}M {countdown.s}S</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div key="playing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[600px] mx-auto lg:mx-0">
                <div className="bg-[#080808] border border-white/[0.06] rounded-3xl p-6 md:p-10 relative shadow-2xl overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-white/[0.04]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shadow-inner">
                        <Flame className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Active Streak</span>
                        <span className="text-2xl font-black text-white italic">{streak}X</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 bg-black p-1.5 rounded-xl border border-white/[0.05] w-full md:w-auto">
                      {['2x', '5x', '10x', '25x'].map(lev => (
                        <button 
                          key={lev}
                          onClick={() => setActiveLeverage(lev)}
                          className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] font-black transition-all ${activeLeverage === lev ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-neutral-600 hover:text-white hover:bg-white/5'}`}
                        >
                          {lev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="min-h-[200px] flex flex-col justify-center">
                    <span className="inline-block px-3 py-1 rounded bg-cyan-500/5 text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-6 w-fit">
                      {SUPER_BOWL_DECK[currentIdx].category}
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-4">
                      {SUPER_BOWL_DECK[currentIdx].question}
                    </h2>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest tabular-nums">SIM BAL: {demoBalance.toFixed(2)} SOL</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-800" />
                      <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Risk: {activeLeverage}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6 mt-12">
                    <button onClick={() => handleAction(false)} className="group relative py-6 rounded-xl bg-white/[0.03] border border-white/[0.08] overflow-hidden transition-all hover:border-red-500/40">
                      <span className="relative z-10 font-black text-xs uppercase tracking-[0.3em] group-hover:text-red-400">Burn It</span>
                      <div className="absolute inset-0 bg-red-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button onClick={() => handleAction(true)} className="group relative py-6 rounded-xl bg-white text-black overflow-hidden transition-all hover:bg-cyan-400 hover:scale-[1.02]">
                      <span className="relative z-10 font-black text-xs uppercase tracking-[0.3em]">Streak It</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'burned' && (
              <motion.div key="burned" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-12 md:p-16 bg-[#080808] border border-red-500/20 rounded-3xl max-w-md mx-auto">
                <Flame className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-5xl md:text-6xl font-black italic uppercase mb-4 leading-none">WIPED.</h2>
                <p className="text-neutral-500 mb-10 text-[10px] font-black uppercase tracking-widest leading-relaxed">The prediction was wrong. Your simulation position has been liquidated.</p>
                <button onClick={() => {setGameState('playing'); setCurrentIdx(0); setStreak(0);}} className="w-full bg-white text-black py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Re-Buy Entry</button>
              </motion.div>
            )}

            {gameState === 'winner' && (
              <motion.div key="winner" className="text-center p-12 md:p-16 bg-[#080808] border border-cyan-500/20 rounded-3xl max-w-md mx-auto">
                <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-5xl md:text-6xl font-black italic uppercase mb-4 leading-none">LEGACY.</h2>
                <p className="text-neutral-500 mb-10 text-[10px] font-black uppercase tracking-widest leading-relaxed">Full prediction suite cleared. You have achieved maximum simulation streak.</p>
                <button onClick={() => {setGameState('playing'); setCurrentIdx(0); setStreak(0);}} className="w-full bg-cyan-500 text-black py-5 rounded-xl font-black text-xs uppercase tracking-widest">Restart Suite</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Column: Large Pre-Live Markets */}
        <aside className="lg:w-[480px] flex flex-col gap-10">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
               <BarChart3 className="w-5 h-5 text-cyan-400" />
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400">Prime Markets</span>
             </div>
             <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20">
               <span className="text-[8px] font-black text-green-500 uppercase">Terminal Online</span>
             </div>
          </div>

          <div className="space-y-6">
            {PREVIEW_MARKETS.map((market) => (
              <div key={market.id} className="group relative p-8 rounded-3xl border transition-all duration-500 bg-black border-white/[0.03] overflow-hidden">
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-[4px] rounded-3xl opacity-100 transition-opacity">
                  <Lock className="w-6 h-6 text-neutral-500 mb-3" />
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Opening {market.liveDate}</span>
                </div>
                
                <div className="flex justify-between items-start mb-8 opacity-40">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight mb-2">{market.title}</h4>
                    <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest px-2 py-1 bg-black rounded border border-white/[0.05]">{market.code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-neutral-500 uppercase block mb-1">Expected Vol</span>
                    <span className="text-lg md:text-xl font-black text-white tabular-nums">{market.vol}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-white/[0.03] opacity-40">
                  <div className="flex gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-400/20" />
                     <span className="w-2 h-2 rounded-full bg-cyan-400/10" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-neutral-600">
                    <span>VIEW DEPTH</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Protocol Telemetry */}
          <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] relative overflow-hidden hidden md:block">
             <div className="flex flex-col gap-6">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Global Orderbook Depth</span>
                 <span className="text-xs font-black text-cyan-400">Awaiting Launch</span>
               </div>
               <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
               </div>
               <div className="grid grid-cols-2 gap-8 mt-4">
                 <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-neutral-600 uppercase">Projected Burn</span>
                    <span className="text-xl font-black italic">42.1M $SOB</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-neutral-600 uppercase">Network Load</span>
                    <span className="text-xl font-black italic">OPTIMAL</span>
                 </div>
               </div>
             </div>
          </div>
        </aside>
      </main>

      {/* Entry Selector Modal */}
      <AnimatePresence>
        {showEntryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEntryModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#080808] border border-white/10 p-8 md:p-12 rounded-[2rem] w-full max-w-2xl">
              <div className="text-center mb-10 md:mb-12">
                <h3 className="text-3xl md:text-4xl font-black italic uppercase mb-3 tracking-tighter">Initialize Terminal</h3>
                <p className="text-neutral-500 text-sm font-medium">Connect to the environment for Super Bowl LX predictions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Live Version */}
                <div className="relative group p-6 md:p-8 rounded-2xl bg-black border border-white/5 opacity-50 cursor-not-allowed">
                  <div className="absolute top-4 right-4 px-2 py-1 rounded bg-magenta-500/10 border border-magenta-500/20 text-[8px] font-black text-magenta-400 uppercase tracking-widest">Awaiting Kickoff</div>
                  <h4 className="text-xl font-black italic uppercase mb-4 text-neutral-400">Live Mainnet</h4>
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center text-neutral-600">
                        <Timer className="w-4 h-4" />
                        <span className="text-base md:text-lg font-black tabular-nums">{countdown.h}:{countdown.m}:{countdown.s}</span>
                     </div>
                  </div>
                  <button disabled className="w-full py-4 rounded-xl border border-white/10 text-neutral-700 font-black text-[10px] uppercase tracking-widest">Coming Soon</button>
                </div>

                {/* Demo Version */}
                <div className="relative p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-cyan-400/30 hover:border-cyan-400 transition-all cursor-pointer shadow-2xl shadow-cyan-500/5 group">
                  <div className="absolute top-4 right-4 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-black text-cyan-400 uppercase tracking-widest">Open Staging</div>
                  <h4 className="text-xl font-black italic uppercase mb-4 text-white">Simulator Access</h4>
                  <div className="space-y-4 mb-8">
                     <p className="text-[10px] text-neutral-500 leading-relaxed uppercase font-black">Practice the streak mechanics with {demoBalance.toFixed(2)} SOL in staging credits.</p>
                  </div>
                  <button 
                    onClick={() => { setGameState('playing'); setShowEntryModal(false); }}
                    className="w-full py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest group-hover:bg-cyan-400 transition-all shadow-lg"
                  >
                    Enter Simulator
                  </button>
                </div>
              </div>

              <div className="mt-10 md:mt-12 text-center flex flex-col md:flex-row gap-4 items-center justify-center">
                 <button onClick={handleReset} className="text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2">
                   <X className="w-3 h-3" />
                   Cancel & Terminate Session
                 </button>
                 <span className="hidden md:inline w-1 h-1 rounded-full bg-neutral-800" />
                 <button onClick={() => setShowEntryModal(false)} className="text-[9px] font-black text-neutral-600 hover:text-white uppercase tracking-widest transition-colors">Return to Dashboard</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Ticker */}
      <footer className="bg-black border-t border-white/[0.03] py-5 overflow-hidden z-50">
        <div className="flex gap-16 items-center animate-ticker whitespace-nowrap">
          {[1,2,3,4].map(i => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>SUPER BOWL LX LIVE MARKETS OPENING FEB 08</span>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-600">
                <span>TERMINAL REFRESH: 120HZ</span>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-magenta-500">
                <span>MARKET ENTRY LIQUIDITY: 10M+ $SOL EXPECTED</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker 50s linear infinite; }
        body { 
          background-color: #020202; 
          color-scheme: dark; 
          overflow-x: hidden; 
          -webkit-tap-highlight-color: transparent;
        }
        /* Mobile-friendly scrollbar */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        
        /* Ensure Safari supports backdrop-filter */
        @supports not (backdrop-filter: blur(1px)) {
          .backdrop-blur-3xl { background: rgba(0,0,0,0.95); }
        }
      `}} />
    </div>
  );
}

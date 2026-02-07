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
  Coins,
  ShieldCheck,
  MousePointer2,
  LineChart,
  ChevronDown
} from 'lucide-react';

// --- YOUR LOGO (KEPT EXACTLY AS REQUESTED) ---
const CustomLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueFlameGradient" x1="50" y1="90" x2="50" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path d="M50 95C30 95 15 75 15 55C15 35 45 5 50 5C55 5 85 35 85 55C85 75 70 95 50 95Z" fill="url(#blueFlameGradient)" fillOpacity="0.15" />
    <path d="M50 90C35 90 25 78 25 60C25 45 40 25 50 10C60 25 75 45 75 60C75 78 65 90 50 90ZM50 75C58 75 63 68 63 58C63 48 50 35 50 35C50 35 37 48 37 58C37 68 42 75 50 75Z" fill="url(#blueFlameGradient)" />
    <path d="M42 28L35 38M58 28L65 38" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// --- SB LX CONTENT DECK ---
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
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Live Terminal', active: true, icon: Zap },
    { name: 'Socials', active: false, icon: Twitter },
    { name: 'Buy $SOB', active: false, icon: Coins, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-[#F0F0F0] font-sans selection:bg-magenta-500/30 flex flex-col antialiased overflow-x-hidden">
      {/* VIBRANT SUPERBOWL LX 2026 BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e0b3d_0%,#020205_70%)]" />
        <div className="absolute top-[-5%] right-[-5%] w-[60vw] h-[60vw] bg-magenta-600/[0.18] rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[60vw] h-[60vw] bg-cyan-700/[0.15] rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="px-4 md:px-8 py-4 flex justify-between items-center border-b border-magenta-500/20 bg-black/80 backdrop-blur-2xl sticky top-0 z-[100] h-20">
        <div className="flex items-center gap-4 md:gap-12">
          <div onClick={handleReset} className="flex items-center gap-3 cursor-pointer group">
            <CustomLogo className="w-9 h-9 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-lg md:text-2xl uppercase leading-none italic group-hover:text-cyan-400 transition-colors">
                STREAK<span className="text-magenta-500">OR</span>BURN
              </span>
              <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em] mt-1">SUPER BOWL LX 2026</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.name} href="#" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${link.active ? 'text-white border-b-2 border-magenta-500 pb-1' : link.highlight ? 'text-cyan-400 hover:text-cyan-300' : 'text-neutral-500 hover:text-white'}`}>
                <link.icon className="w-3 h-3" />
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {gameState !== 'landing' && (
            <div className="flex flex-col items-end px-3 md:px-6 border-r border-white/10">
              <span className="text-[7px] font-black text-magenta-500 uppercase tracking-widest">Balance</span>
              <span className="text-xs md:text-sm font-black text-white tabular-nums">{demoBalance.toFixed(2)} SOL</span>
            </div>
          )}
          
          <button 
            onClick={() => setShowEntryModal(true)} 
            className="px-4 md:px-8 py-2.5 rounded-lg bg-gradient-to-r from-magenta-600 to-cyan-600 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all active:scale-95 flex items-center gap-2 border border-white/20"
          >
            <Wallet2 className="w-3 h-3" />
            <span>Connect <span className="hidden sm:inline">Arena</span></span>
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 text-white bg-white/5 rounded-lg border border-magenta-500/30 active:bg-magenta-500/20"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
            />
            <motion.div 
              initial={{ y: -50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: -50, opacity: 0 }} 
              className="lg:hidden fixed inset-x-0 top-20 bg-[#0a0a0f] border-b border-magenta-500/40 z-[120] p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <a 
                    key={link.name} 
                    href="#" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-4 text-[11px] font-black uppercase tracking-widest p-5 rounded-xl border transition-all ${link.highlight ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-neutral-300 border-white/5'}`}
                  >
                    <link.icon className={`w-4 h-4 ${link.highlight ? 'text-cyan-400' : 'text-neutral-500'}`} />
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-8 lg:p-16 gap-12 lg:gap-16 z-10">
        {/* Left Column: Hero/Terminal */}
        <section className="flex-1 flex flex-col justify-center min-h-[50vh] pt-8 md:pt-0">
          <AnimatePresence mode="wait">
            {gameState === 'landing' && (
              <motion.div key="landing" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
                <div className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full bg-gradient-to-r from-magenta-500/20 to-cyan-500/20 border border-magenta-500/40">
                  <span className="w-2 h-2 rounded-full bg-magenta-500 animate-pulse shadow-[0_0_10px_#ec4899]" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">Super Bowl LX Finals • Feb 08, 2026</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[9.5rem] font-black italic tracking-tighter leading-[0.82] mb-10 uppercase">
                  STREAK<br/>OR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-500 to-blue-600 animate-gradient-x">BURN.</span>
                </h1>
                
                {/* 3-STEP TUTORIAL - CLEANED UP UI */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14 border-l-4 border-magenta-600 pl-8">
                  <div className="flex flex-col gap-3 group cursor-default p-4 rounded-2xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3 text-magenta-500 group-hover:text-cyan-400 transition-colors">
                      <div className="p-2 rounded-lg bg-magenta-500/10 border border-magenta-500/20"><MousePointer2 className="w-5 h-5" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Step 01</span>
                    </div>
                    <p className="text-[13px] font-bold text-neutral-300 leading-snug group-hover:text-white transition-colors uppercase italic tracking-tight">Initialize Arena Multiplier.</p>
                  </div>
                  <div className="flex flex-col gap-3 group cursor-default p-4 rounded-2xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3 text-cyan-400 group-hover:text-magenta-500 transition-colors">
                      <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20"><LineChart className="w-5 h-5" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Step 02</span>
                    </div>
                    <p className="text-[13px] font-bold text-neutral-300 leading-snug group-hover:text-white transition-colors uppercase italic tracking-tight">Predict Live SB Plays.</p>
                  </div>
                  <div className="flex flex-col gap-3 group cursor-default p-4 rounded-2xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3 text-blue-400 group-hover:text-cyan-400 transition-colors">
                      <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20"><ShieldCheck className="w-5 h-5" /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Step 03</span>
                    </div>
                    <p className="text-[13px] font-bold text-neutral-300 leading-snug group-hover:text-white transition-colors uppercase italic tracking-tight">Secure Streak or Burn.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 md:gap-8">
                  <button 
                    onClick={() => setShowEntryModal(true)} 
                    className="w-full sm:w-auto px-12 md:px-14 py-6 md:py-7 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.25em] hover:bg-magenta-600 hover:text-white transition-all shadow-[0_15px_50px_rgba(236,72,153,0.4)] flex items-center justify-center gap-3 group active:scale-95 border-b-4 border-neutral-300 hover:border-magenta-700"
                  >
                    Enter Terminal <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-6 px-8 border-l border-magenta-500/30 mx-auto sm:mx-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Kickoff Clock</span>
                      <span className="text-2xl md:text-3xl font-black tabular-nums text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{countdown.h}H {countdown.m}M {countdown.s}S</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div key="playing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[650px] mx-auto lg:mx-0">
                <div className="bg-[#0c0c14]/90 border border-magenta-500/40 rounded-[3rem] p-8 md:p-12 relative shadow-2xl overflow-hidden backdrop-blur-3xl ring-2 ring-white/5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-10 border-b border-magenta-500/20">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-magenta-500/30 to-cyan-500/30 flex items-center justify-center border border-magenta-500/50">
                        <Flame className="w-8 h-8 text-magenta-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Terminal Streak</span>
                        <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">{streak}X</span>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-black/60 p-2 rounded-2xl border border-white/10 w-full md:w-auto">
                      {['2x', '5x', '10x', '25x'].map(lev => (
                        <button key={lev} onClick={() => setActiveLeverage(lev)} className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-[11px] font-black transition-all ${activeLeverage === lev ? 'bg-magenta-600 text-white shadow-[0_0_20px_#ec4899]' : 'text-neutral-500 hover:text-white hover:bg-white/10'}`}>{lev}</button>
                      ))}
                    </div>
                  </div>
                  <div className="min-h-[250px] flex flex-col justify-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-8 w-fit">{SUPER_BOWL_DECK[currentIdx].category}</span>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] mb-6 text-white">
                      {SUPER_BOWL_DECK[currentIdx].question}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-5 md:gap-8 mt-14">
                    <button onClick={() => handleAction(false)} className="group relative py-7 rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden transition-all hover:border-red-500 active:scale-95">
                      <span className="relative z-10 font-black text-[11px] uppercase tracking-[0.4em] group-hover:text-red-400 transition-colors">Burn It</span>
                      <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button onClick={() => handleAction(true)} className="group relative py-7 rounded-3xl bg-gradient-to-r from-magenta-600 to-cyan-600 text-white overflow-hidden transition-all hover:scale-[1.03] shadow-[0_0_30px_rgba(236,72,153,0.3)] active:scale-95 border-t border-white/30">
                      <span className="relative z-10 font-black text-[11px] uppercase tracking-[0.4em] drop-shadow-lg">Streak It</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'burned' && (
              <motion.div key="burned" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-14 md:p-20 bg-[#0c0c14]/90 border-2 border-red-500/50 rounded-[3.5rem] max-w-lg mx-auto backdrop-blur-3xl shadow-[0_0_100px_rgba(239,68,68,0.2)]">
                <Flame className="w-20 h-20 text-red-500 mx-auto mb-8 drop-shadow-[0_0_15px_#ef4444]" />
                <h2 className="text-6xl md:text-7xl font-black italic uppercase mb-6 leading-none text-white">BURNED.</h2>
                <p className="text-neutral-400 text-xs font-bold uppercase mb-12 tracking-[0.3em]">Market crash detected. Session wiped.</p>
                <button onClick={() => {setGameState('playing'); setCurrentIdx(0); setStreak(0);}} className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-magenta-600 hover:text-white transition-all shadow-2xl">Re-Initialize Session</button>
              </motion.div>
            )}

            {gameState === 'winner' && (
              <motion.div key="winner" className="text-center p-14 md:p-20 bg-[#0c0c14]/90 border-2 border-cyan-500/50 rounded-[3.5rem] max-w-lg mx-auto backdrop-blur-3xl shadow-[0_0_100px_rgba(34,211,238,0.2)]">
                <Trophy className="w-20 h-20 text-cyan-400 mx-auto mb-8 drop-shadow-[0_0_20px_#22d3ee]" />
                <h2 className="text-6xl md:text-7xl font-black italic uppercase mb-6 leading-none text-white">LEGEND.</h2>
                <p className="text-neutral-400 text-xs font-bold uppercase mb-12 tracking-[0.3em]">Max Streak achieved. Rewards unlocked.</p>
                <button onClick={() => {setGameState('playing'); setCurrentIdx(0); setStreak(0);}} className="w-full bg-cyan-500 text-black py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-magenta-500 hover:text-white transition-all">Clear Terminal</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Column: Pre-Live Markets */}
        <aside className="lg:w-[500px] flex flex-col gap-12">
          <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-4">
               <BarChart3 className="w-6 h-6 text-magenta-500" />
               <span className="text-[12px] font-black uppercase tracking-[0.4em] text-cyan-400">Super Bowl LX Markets</span>
             </div>
             <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/40">
               <span className="text-[9px] font-black text-green-400 uppercase tracking-widest animate-pulse">Live Sync</span>
             </div>
          </div>

          <div className="space-y-8">
            {PREVIEW_MARKETS.map((market) => (
              <div key={market.id} className="group relative p-10 rounded-[2.5rem] border transition-all duration-500 bg-white/[0.03] border-white/[0.08] overflow-hidden backdrop-blur-xl hover:bg-white/[0.05] hover:border-magenta-500/30">
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm rounded-[2.5rem] opacity-100">
                  <Lock className="w-8 h-8 text-magenta-500 mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] border-b border-magenta-500 pb-1">UNLOCKING {market.liveDate}</span>
                </div>
                <div className="flex justify-between items-start mb-10 opacity-30">
                  <div>
                    <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-3 text-white">{market.title}</h4>
                    <span className="text-[10px] font-black text-magenta-400 uppercase tracking-widest px-3 py-1 bg-black rounded border border-magenta-500/20">{market.code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white tabular-nums">{market.vol}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-8 border-t border-white/[0.05] opacity-30">
                  <div className="flex gap-3"><span className="w-2.5 h-2.5 rounded-full bg-magenta-500" /><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /></div>
                  <div className="flex items-center gap-3 text-[11px] font-black text-neutral-400"><span>ACCESS DATA</span><ArrowUpRight className="w-5 h-5" /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 rounded-[3rem] bg-gradient-to-br from-magenta-900/20 to-cyan-900/20 border border-magenta-500/20 hidden md:block shadow-xl">
            <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-6 text-center">Communications Center</h5>
            <div className="flex gap-5">
              <button className="flex-1 py-4 rounded-2xl bg-white text-black hover:bg-magenta-500 hover:text-white transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase shadow-lg">
                <Twitter className="w-4 h-4" /> X.COM
              </button>
              <button className="flex-1 py-4 rounded-2xl bg-black border border-white/20 text-white hover:border-cyan-400 transition-all flex items-center justify-center gap-3 text-[11px] font-black uppercase">
                <ExternalLink className="w-4 h-4" /> DOCS
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Entry Modal */}
      <AnimatePresence>
        {showEntryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEntryModal(false)} className="absolute inset-0 bg-black/98 backdrop-blur-3xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative bg-[#08080c] border border-magenta-500/40 p-10 md:p-16 rounded-none md:rounded-[4rem] w-full h-full md:h-auto max-w-3xl shadow-[0_0_120px_rgba(236,72,153,0.3)] flex flex-col justify-center overflow-y-auto">
              <button onClick={() => setShowEntryModal(false)} className="absolute top-10 right-10 p-4 text-white hover:text-magenta-500 transition-colors bg-white/5 rounded-full">
                <X className="w-8 h-8" />
              </button>
              
              <div className="text-center mb-12 md:mb-16">
                <div className="w-20 h-20 bg-gradient-to-br from-magenta-500 to-cyan-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl border-t border-white/40">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-5xl md:text-6xl font-black italic uppercase mb-4 tracking-tighter text-white">Arena Auth</h3>
                <p className="text-cyan-400 text-sm font-black uppercase tracking-[0.4em]">SB LX PRE-FLIGHT VERIFICATION</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="relative p-10 rounded-[3rem] bg-black border border-white/5 opacity-40 cursor-not-allowed">
                  <h4 className="text-2xl font-black italic uppercase mb-3 text-neutral-400">Pro Arena</h4>
                  <p className="text-[11px] text-magenta-500 font-black uppercase mb-10 tracking-widest">Awaiting Kickoff</p>
                  <button disabled className="w-full py-6 rounded-2xl border border-white/10 text-neutral-600 font-black text-[11px] uppercase tracking-widest">Locked</button>
                </div>
                <div className="relative p-10 rounded-[3rem] bg-magenta-500/[0.08] border-2 border-magenta-500 hover:border-cyan-400 transition-all cursor-pointer group shadow-2xl shadow-magenta-500/10 ring-1 ring-white/10">
                  <h4 className="text-2xl font-black italic uppercase mb-3 text-white">Staging Terminal</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed uppercase font-black mb-10 italic tracking-widest underline decoration-magenta-500">Practice with 10.00 SOL Credits.</p>
                  <button 
                    onClick={() => { setGameState('playing'); setShowEntryModal(false); }} 
                    className="w-full py-6 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:bg-magenta-600 group-hover:text-white transition-all"
                  >
                    Launch Simulator
                  </button>
                </div>
              </div>
              
              <button onClick={() => setShowEntryModal(false)} className="mt-16 text-[11px] font-black text-neutral-600 hover:text-cyan-400 uppercase tracking-[0.5em] transition-colors self-center">
                ABORT CONNECTION
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Ticker */}
      <footer className="bg-[#020205] border-t border-magenta-500/20 py-8 overflow-hidden z-50">
        <div className="flex gap-24 items-center animate-ticker whitespace-nowrap">
          {[1,2,3,4,5,6].map(i => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.5em] text-neutral-500">
                <Lock className="w-3 h-3 text-magenta-500" />
                <span>UPCOMING: SB LX PLAYER PROPS</span>
              </div>
              <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.5em] text-neutral-500">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>UPCOMING: QUARTERLY OVER/UNDER</span>
              </div>
              <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.5em] text-neutral-500">
                <Lock className="w-3 h-3 text-white" />
                <span>UPCOMING: LIVE MVP TRACKER</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        .animate-ticker { animation: ticker 25s linear infinite; }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
        body { background-color: #020205; color-scheme: dark; overflow-x: hidden; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ec4899; border-radius: 10px; }
        
        /* HOVER FIXES - ENSURE TEXT REMAINS VISIBLE */
        .hover\\:bg-magenta-600:hover { color: white !important; }
        button.bg-white:hover { color: #020205 !important; }

        .backdrop-blur-3xl { -webkit-backdrop-filter: blur(64px); backdrop-filter: blur(64px); }
        .backdrop-blur-2xl { -webkit-backdrop-filter: blur(40px); backdrop-filter: blur(40px); }
        .backdrop-blur-xl { -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px); }
      `}} />
    </div>
  );
}

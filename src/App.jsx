import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Lock,
  Trophy,
  ChevronRight,
  Wallet2,
  Zap,
  ShieldCheck,
  History,
  TrendingUp,
  Activity,
  Mic2,
  Music,
  Menu,
  X,
  Twitter,
  ExternalLink,
  Coins
} from 'lucide-react';

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

const SUPER_BOWL_DECK = [
  { id: 1, question: "Seahawks Win Toss?", category: "PRE-GAME", color: "from-blue-600/20" },
  { id: 2, question: "Puth Anthem > 2:05?", category: "NATIONAL ANTHEM", color: "from-red-600/20" },
  { id: 3, question: "Bad Bunny Opens with 'Monaco'?", category: "HALFTIME SHOW", color: "from-purple-600/20" },
  { id: 4, question: "Patriots Lead at Half?", category: "GAME STATS", color: "from-blue-900/20" },
  { id: 5, question: "Seahawks Over 24.5 Pts?", category: "OVER/UNDER", color: "from-emerald-600/20" },
  { id: 6, question: "Bad Bunny Guest: Post Malone?", category: "NOVELTY", color: "from-pink-600/20" }
];

const PREVIEW_MARKETS = [
  { id: 1, title: "SEA vs NE: Spread", vol: "8.4M SOL", users: "15.2k", delta: "+22%", liveDate: "FEB 08" },
  { id: 2, title: "Bad Bunny Setlist", vol: "3.1M SOL", users: "42k", delta: "+15.4%", liveDate: "FEB 08" },
  { id: 3, title: "MVP Prediction", vol: "5.8M SOL", users: "8.1k", delta: "+62%", liveDate: "FEB 08" },
];

export default function App() {
  const [gameState, setGameState] = useState('landing'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  const [demoBalance, setDemoBalance] = useState(10.0);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [activeLeverage, setActiveLeverage] = useState(2);
  const [betAmount, setBetAmount] = useState(0.5);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const targetDate = useMemo(() => new Date('2026-02-08T18:30:00-05:00').getTime(), []);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = targetDate - new Date().getTime();
      if (distance < 0) {
        setCountdown({ h: 0, m: 0, s: 0 });
        clearInterval(timer);
      } else {
        setCountdown({
          h: Math.floor(distance / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleAction = (isYes) => {
    if (demoBalance < betAmount) return;
    const isCorrect = Math.random() > 0.45; 
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setDemoBalance(prev => prev + (betAmount * activeLeverage * 0.4)); 
      if (currentIdx === SUPER_BOWL_DECK.length - 1) setGameState('winner');
      else setCurrentIdx(prev => prev + 1);
    } else {
      setDemoBalance(prev => Math.max(0, prev - betAmount)); 
      setGameState('burned');
    }
  };

  const handleReset = () => {
    setGameState('landing');
    setCurrentIdx(0);
    setStreak(0);
    setDemoBalance(10.0);
    setShowEntryModal(false);
    setMobileMenuOpen(false);
  };

  const NavLinks = ({ mobile = false }) => (
    <div className={`${mobile ? 'flex flex-col gap-6 p-8' : 'hidden lg:flex items-center gap-8'}`}>
      <a href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-cyan-400 transition-colors">
        <Coins className="w-3.5 h-3.5" />
        BUY SOB
      </a>
      <a href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-[#1DA1F2] transition-colors">
        <Twitter className="w-3.5 h-3.5" />
        TWITTER
      </a>
      <a href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors">
        <ExternalLink className="w-3.5 h-3.5" />
        LIVE FEED
      </a>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#020205] text-[#F0F0F0] flex flex-col overflow-hidden relative font-sans">
      {/* SUPERBOWL THEME BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e0b3d_0%,#020205_75%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-600/[0.12] rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/[0.12] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.1]" />
      </div>

      {/* HEADER */}
      <nav className="flex-none px-4 md:px-6 py-4 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-xl z-[100] h-16">
        <div className="flex items-center gap-10">
          <div onClick={handleReset} className="flex items-center gap-3 cursor-pointer group">
            <CustomLogo className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-lg md:xl uppercase italic group-hover:text-cyan-400 transition-colors">
                STREAK<span className="text-red-500">OR</span>BURN
              </span>
              <span className="text-[6px] md:text-[7px] font-bold text-cyan-400 uppercase tracking-[0.4em]">SB LX ARENA</span>
            </div>
          </div>
          
          {/* Desktop Links */}
          <NavLinks />
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex flex-col items-end pr-4 md:pr-6 border-r border-white/10">
            <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">Bankroll</span>
            <span className="text-xs font-black text-white tabular-nums">{demoBalance.toFixed(2)} SOL</span>
          </div>
          
          <button 
            onClick={() => setShowEntryModal(true)} 
            className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl bg-white/5 border border-white/20 text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center gap-2"
          >
            <Wallet2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Connect Wallet</span>
            <span className="xs:hidden">Connect</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 bg-black/95 backdrop-blur-2xl z-[90] border-b border-white/10 lg:hidden"
          >
            <NavLinks mobile />
            <div className="p-8 pt-0 flex sm:hidden">
               <div className="flex flex-col">
                  <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">Bankroll</span>
                  <span className="text-sm font-black text-white tabular-nums">{demoBalance.toFixed(2)} SOL</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 p-4 md:p-6 overflow-hidden z-10">
        
        {/* CENTER TERMINAL SECTION */}
        <section className="flex flex-col min-h-0 justify-center items-center">
          <AnimatePresence mode="wait">
            {gameState === 'landing' && (
              <motion.div key="landing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-4xl text-center lg:text-left">
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Exchange: Seahawks vs Patriots</span>
                </div>
                <h1 className="text-5xl md:text-8xl lg:text-[7rem] font-black italic tracking-tighter leading-[0.85] mb-8 uppercase text-white">
                  SEAHAWKS.<br/>PATRIOTS.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">SUPER BOWL LX.</span>
                </h1>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8 md:mt-12">
                  <button 
                    onClick={() => setShowEntryModal(true)} 
                    className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3"
                  >
                    Enter Betting Arena <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-6 px-6 border-l border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Kickoff Event</span>
                      <span className="text-xl font-black tabular-nums text-white">{countdown.h}H {countdown.m}M {countdown.s}S</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div key="playing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl h-full lg:max-h-[580px] flex overflow-y-auto md:overflow-hidden lg:overflow-visible">
                <div className="w-full bg-[#0c0c14]/95 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
                  {/* IMAGE PLACEHOLDER (4:3) */}
                  <div className={`w-full md:w-[45%] h-48 md:h-auto bg-gradient-to-br ${SUPER_BOWL_DECK[currentIdx].color} to-black flex items-center justify-center relative overflow-hidden`}>
                     <div className="flex flex-col items-center gap-4 text-white/20">
                        {currentIdx === 2 || currentIdx === 5 ? <Music className="w-16 h-16" /> : <Trophy className="w-16 h-16" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Event Asset (4:3)</span>
                     </div>
                     <div className="absolute inset-0 border-r border-white/5" />
                  </div>

                  {/* BETTING UI */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
                    <div>
                      <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/30">
                            <Flame className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block">Current Streak</span>
                            <span className="text-2xl font-black text-white italic tabular-nums">{streak}X</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block">Stake Potential</span>
                          <span className="text-xl font-black text-green-400 tabular-nums">{(activeLeverage * 0.4).toFixed(1)}x</span>
                        </div>
                      </div>

                      <div className="min-h-[100px] md:min-h-[120px]">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 block">{SUPER_BOWL_DECK[currentIdx].category} MARKET</span>
                        <h2 className="text-2xl md:text-4xl font-black italic uppercase leading-tight text-white tracking-tighter">
                          {SUPER_BOWL_DECK[currentIdx].question}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                           <span className="text-[7px] font-black text-neutral-500 uppercase block mb-2">Bet Amount</span>
                           <div className="flex gap-1">
                             {[0.1, 0.5, 1.0].map(v => (
                               <button key={v} onClick={() => setBetAmount(v)} className={`flex-1 py-1.5 rounded text-[9px] font-black transition-all ${betAmount === v ? 'bg-white text-black' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}>{v}</button>
                             ))}
                           </div>
                         </div>
                         <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                           <span className="text-[7px] font-black text-neutral-500 uppercase block mb-2">Leverage Power</span>
                           <div className="flex gap-1">
                             {[2, 5, 10].map(v => (
                               <button key={v} onClick={() => setActiveLeverage(v)} className={`flex-1 py-1.5 rounded text-[9px] font-black transition-all ${activeLeverage === v ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}>{v}x</button>
                             ))}
                           </div>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleAction(false)} className="py-4 rounded-xl bg-white/5 border border-white/10 font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">No / Burn</button>
                        <button onClick={() => handleAction(true)} className="py-4 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 text-white font-black text-[9px] uppercase tracking-widest hover:brightness-125 active:scale-95 transition-all">Yes / Streak</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'burned' && (
              <motion.div key="burned" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-8 md:p-12 bg-black border border-red-500/50 rounded-[3rem] max-w-md shadow-2xl">
                <Flame className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-2 text-white">BURNED.</h2>
                <p className="text-neutral-500 text-[9px] font-black uppercase mb-8 tracking-widest italic">Betting Connection Terminated.</p>
                <button onClick={() => {setGameState('playing'); setCurrentIdx(0); setStreak(0);}} className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">New Session</button>
              </motion.div>
            )}

            {gameState === 'winner' && (
              <motion.div key="winner" className="text-center p-8 md:p-12 bg-[#0c0c14] border border-cyan-500/50 rounded-[3rem] max-w-md shadow-2xl">
                <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-2 text-white">CHAMPION.</h2>
                <p className="text-neutral-500 text-[9px] font-black uppercase mb-8 tracking-widest italic">Super Bowl LX Prediction Clear.</p>
                <button onClick={handleReset} className="w-full bg-cyan-500 text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Claim Rewards</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SIDEBAR - MARKETS & HISTORY */}
        <aside className="hidden lg:flex flex-col gap-5 min-h-0">
          <div className="flex-none flex items-center justify-between px-4">
             <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-red-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Locked Markets</span>
             </div>
             <span className="text-[8px] font-bold text-neutral-500 uppercase">Levi's Stadium - FEB 08</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {PREVIEW_MARKETS.map((m) => (
              <div key={m.id} className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
                  <Lock className="w-4 h-4 text-white/40 mb-2" />
                  <span className="text-[7px] font-black text-white/50 uppercase tracking-[0.3em]">RELEASING {m.liveDate}</span>
                </div>
                <div className="opacity-20 flex flex-col gap-3">
                  <h4 className="text-sm font-black italic uppercase text-white">{m.title}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[6px] font-black text-neutral-500 uppercase">Liquidity</span>
                      <span className="text-[10px] font-bold text-white">{m.vol}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-2">
                      <span className="text-[6px] font-black text-neutral-500 uppercase">Users</span>
                      <span className="text-[10px] font-bold text-white">{m.users}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-2">
                      <span className="text-[6px] font-black text-neutral-500 uppercase">24h Delta</span>
                      <span className="text-[10px] font-bold text-green-400">{m.delta}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-none p-5 rounded-3xl bg-white/5 border border-white/10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30"><History className="w-3 h-3 text-red-400" /></div>
               <span className="text-[9px] font-black text-white uppercase tracking-widest">Global Heat</span>
             </div>
             <div className="space-y-2 opacity-50">
               {[1,2,3].map(i => (
                 <div key={i} className="flex justify-between text-[7px] font-bold border-b border-white/5 pb-1.5">
                   <span className="text-neutral-400 uppercase italic">SantaClara_Fan_{Math.floor(Math.random()*9999)}</span>
                   <span className="text-blue-400">STREAK: 12X</span>
                 </div>
               ))}
             </div>
          </div>
        </aside>
      </main>

      {/* FOOTER TICKER */}
      <footer className="flex-none bg-black border-t border-white/10 py-3 overflow-hidden z-[100] h-12">
        <div className="flex gap-24 items-center animate-ticker whitespace-nowrap">
          {[1,2,3].map(i => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-[0.4em] text-neutral-500">
                <Zap className="w-3 h-3 text-red-500" />
                <span>SB LX: Seahawks vs Patriots - A 2015 Rematch at Levi's Stadium</span>
                <Mic2 className="w-3 h-3 text-blue-400" />
                <span>Halftime: Bad Bunny apple music show - first solo latino headliner</span>
                <Music className="w-3 h-3 text-emerald-400" />
                <span>Opening: Charlie Puth national anthem and Brandi Carlile "America the Beautiful"</span>
                <TrendingUp className="w-3 h-3 text-white" />
                <span>Super Bowl LX — the 60th NFL Championship game</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </footer>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showEntryModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEntryModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0a0a10] border border-white/10 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl">
              <div className="text-center mb-10">
                <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-3xl font-black italic uppercase text-white mb-2">Arena Connection</h3>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.3em]">Accessing SB LX Exchange Terminal</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-black border border-white/5 opacity-30 text-center flex flex-col items-center justify-center">
                  <span className="text-[8px] font-black text-red-500 block mb-1">REAL ASSETS</span>
                  <p className="text-xs font-black text-neutral-500 italic uppercase">Locked Until Kickoff</p>
                </div>
                <button 
                  onClick={() => { setGameState('playing'); setShowEntryModal(false); }} 
                  className="p-6 rounded-2xl bg-white/5 border border-white/20 hover:bg-white hover:border-white text-center group transition-all"
                >
                  <span className="text-[8px] font-black text-blue-400 group-hover:text-red-600 block mb-1">DEMO ARENA</span>
                  <p className="text-xs font-black text-white group-hover:text-black italic uppercase transition-colors">Start Simulator</p>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: ticker 50s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        html, body { 
          margin: 0; 
          padding: 0; 
          height: 100vh; 
          width: 100vw; 
          overflow: hidden; 
          background-color: #020205; 
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        /* Prevent all scrolling except sidebar on desktop */
        @media (min-width: 1024px) {
          .h-screen { overflow: hidden; }
        }

        @media (max-width: 1023px) {
          main { 
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            height: calc(100vh - 112px); /* Ticker + Header */
          }
          section { flex: 1 0 auto; min-height: 500px; }
        }

        @media (max-width: 639px) {
          .xs\\:hidden { display: block; }
          .xs\\:inline { display: none; }
        }
      `}} />
    </div>
  );
}

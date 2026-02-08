import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Lock, Menu, X, Trophy, ChevronRight, Wallet2, Zap, Twitter, Coins, 
  ShieldCheck, TrendingUp, Activity, Mic2, Music, User, LogOut, 
  ArrowDownCircle, ArrowUpCircle, History, ExternalLink, CheckCircle, Layers, PlusCircle, Copy, Key
} from 'lucide-react';

// --- CONFIGURATION ---
const HOUSE_WALLET_ADDRESS = "9JHxS6rkddGG48ZTaLUtNaY8UBoZNpKsCgeXhJTKQDTt"; 
// ---------------------

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

// Fallback Data
const FALLBACK_DECK = [
  { id: 'fb-1', question: "Sam Darnold", category: "SUPER BOWL MVP", img: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800", outcome_yes: "Yes", price_yes: 0.44, outcome_no: "No", price_no: 0.56 },
  { id: 'fb-2', question: "Seahawks vs Patriots", category: "GAME WINNER", img: "https://images.unsplash.com/photo-1628230538965-c3f25c76063b?q=80&w=800", outcome_yes: "Seahawks", price_yes: 0.55, outcome_no: "Patriots", price_no: 0.45 }
];

export default function App() {
  // --- STATE INITIALIZATION ---
  const [gameState, setGameState] = useState('landing'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // STREAK LOGIC STATE
  const [activePicks, setActivePicks] = useState([]); 
  const [streakStake, setStreakStake] = useState(0); 
  const [customStake, setCustomStake] = useState(''); 
  
  // DATA STATE
  const [marketDeck, setMarketDeck] = useState(FALLBACK_DECK);
  const [isMarketsLoading, setIsMarketsLoading] = useState(true);
  const [streakHistory, setStreakHistory] = useState([]); 
  
  // USER ACCOUNT STATE
  const [userAddress, setUserAddress] = useState(null);
  const [userSecret, setUserSecret] = useState(null); 
  
  // Balance State
  const [vaultBalance, setVaultBalance] = useState(0.0);
  
  // Dashboard Inputs
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDest, setWithdrawDest] = useState('');

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false); 
  const [showKeyModal, setShowKeyModal] = useState(false); 
  const [keysConfirmed, setKeysConfirmed] = useState(false); 
  const [showDashboard, setShowDashboard] = useState(false); // VAULT
  const [showMyBets, setShowMyBets] = useState(false);     // MY BETS
  
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const [showStakeSelect, setShowStakeSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Event Timing
  const targetDate = useMemo(() => new Date('2026-02-08T18:30:00-05:00').getTime(), []);
  const [isEventStarted, setIsEventStarted] = useState(false);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    const storedPub = localStorage.getItem('sob_user_pub');
    if (storedPub) {
      setUserAddress(storedPub);
      refreshUserData(storedPub);
    }
  }, []);

  const refreshUserData = async (addr) => {
      try {
          const addressToUse = addr || userAddress;
          if (!addressToUse) return;

          const res = await fetch(`/api/streak?userAddress=${addressToUse}`);
          const data = await res.json();
          if (data.history) setStreakHistory(data.history);
          if (data.realBalance !== undefined) setVaultBalance(data.realBalance);
      } catch (e) {
          console.error("Failed to load user data", e);
      }
  };

  // --- 2. LIVE DATA STREAM (FIXED) ---
  useEffect(() => {
    let isMounted = true;
    
    async function fetchPolymarket() {
      try {
        const res = await fetch('/api/markets');
        const data = await res.json();
        
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          // Use ID from backend as unique key and assign visual index
          const indexedData = data.map((item, index) => ({...item, visualIndex: index}));
          setMarketDeck(indexedData);
        }
      } catch (error) {
        console.error("Failed to stream markets", error);
      } finally {
        if (isMounted) setIsMarketsLoading(false);
      }
    }

    fetchPolymarket(); 
    const interval = setInterval(fetchPolymarket, 10000); 
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // --- 3. TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        setCountdown({ h: 0, m: 0, s: 0 });
        setIsEventStarted(true);
        clearInterval(timer);
      } else {
        setIsEventStarted(false);
        setCountdown({
          h: Math.floor(distance / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // --- ACCOUNT ACTIONS ---
  
  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/create-account', { method: 'POST' });
      const data = await res.json();
      if(data.success) {
        setUserAddress(data.publicKey);
        setUserSecret(data.secretKey);
        localStorage.setItem('sob_user_pub', data.publicKey);
        setShowEntryModal(false);
        setShowKeyModal(true); 
      } else {
        alert("Failed to create account.");
      }
    } catch(e) { alert(e.message); } finally { setIsLoading(false); }
  };

  const handleConfirmKeys = () => {
    if(!keysConfirmed) return alert("Please confirm you saved your key.");
    setShowKeyModal(false);
    setUserSecret(null); 
    setShowDashboard(true); 
  };

  const handleLogout = () => {
    localStorage.removeItem('sob_user_pub');
    setUserAddress(null);
    setVaultBalance(0);
    setStreakHistory([]);
    setActivePicks([]);
    setStreakStake(0);
    
    setShowDashboard(false);
    setShowMyBets(false);
    setShowEntryModal(false);
    setShowStakeSelect(false);
    setIsMenuOpen(false);
  };

  // --- DEPOSIT CHECK ---
  const handleCheckDeposit = async () => {
    if(!userAddress) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress })
      });
      const data = await res.json();
      if(data.success) {
        setVaultBalance(data.newBalance);
        if (data.newBalance > vaultBalance) {
          alert(`Deposit Detected! New Balance: ${data.newBalance.toFixed(3)} SOL`);
        } else {
          alert("No new deposits detected yet.");
        }
      }
    } catch(e) { alert(e.message); } finally { setIsLoading(false); }
  };

  // --- GAMEPLAY ACTIONS ---
  const handleEnterArena = () => {
    if (!userAddress) return setShowEntryModal(true);
    if (isEventStarted) {
        alert("Event has started! Betting is closed. Viewing My Bets.");
        setShowMyBets(true);
    } else {
        setShowStakeSelect(true); 
    }
  };

  const handleStartStreak = (amount) => {
      if (!userAddress) return setShowEntryModal(true);
      
      const stakeVal = parseFloat(amount);
      if (isNaN(stakeVal) || stakeVal < 0.05 || stakeVal > 500) {
          alert("Stake must be between 0.05 and 500 SOL");
          return;
      }

      if (stakeVal > vaultBalance) {
          alert(`Insufficient SOL Balance. Please Deposit.`);
          setShowStakeSelect(false);
          setShowDashboard(true); 
          return;
      }
      
      setStreakStake(stakeVal);
      setActivePicks([]); 
      setCurrentIdx(0);   
      setShowStakeSelect(false);
      setGameState('playing');
  };

  const handleAction = (selectionIndex) => {
      if (!userAddress) return;
      if (streakStake <= 0 || gameState !== 'playing') return;
      if (isEventStarted) return alert("Betting Closed. Event Live.");
      
      const currentCard = marketDeck[currentIdx];

      // GUARD: DUPLICATE CHECK (STREAK LOCKING)
      // Check if this market ID is already in activePicks
      const isAlreadyPicked = activePicks.some(p => p.marketId === currentCard.id);
      if (isAlreadyPicked) {
          return; // Prevent adding again
      }

      const pick = {
          question: currentCard.question,
          outcome: selectionIndex === 0 ? currentCard.outcome_yes : currentCard.outcome_no,
          odds: selectionIndex === 0 ? currentCard.price_yes : currentCard.price_no,
          marketId: currentCard.id,
          img: currentCard.img // Store image for My Bets display
      };

      const updatedPicks = [...activePicks, pick];
      setActivePicks(updatedPicks);

      if (updatedPicks.length >= 10) {
          submitStreak(updatedPicks);
      } else {
          setCurrentIdx((prev) => (prev + 1) % marketDeck.length);
      }
  };

  const submitStreak = async (finalPicks) => {
      setIsLoading(true);
      try {
          const response = await fetch('/api/streak', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  userAddress: userAddress,
                  stake: streakStake,
                  picks: finalPicks
              })
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error);

          setStreakHistory(prev => [data.streak, ...prev]);
          if (data.realBalance !== undefined) setVaultBalance(data.realBalance);

          setActivePicks([]); 
          setStreakStake(0);
          setCustomStake('');
          setCurrentIdx(0);

          setGameState('streak_submitted');

      } catch (error) {
          alert("Failed to submit streak: " + error.message);
          setGameState('landing');
      } finally {
          setIsLoading(false);
      }
  };

  const handleWithdraw = async () => {
    if (!userAddress) return;
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return alert("Invalid amount");
    if (!withdrawDest) return alert("Enter destination address");
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userAddress: userAddress, 
            amount: parseFloat(withdrawAmount),
            destinationAddress: withdrawDest
        })
      });
      const data = await response.json();
      if (response.ok) {
        setVaultBalance(prev => prev - parseFloat(withdrawAmount));
        setWithdrawAmount('');
        setWithdrawDest('');
        alert(`Withdrawal Success! Tx: ${data.signature}`);
      } else { throw new Error(data.error); }
    } catch (error) { alert("Withdraw Failed: " + error.message); } finally { setIsLoading(false); }
  };

  const handleMaxWithdraw = () => {
      const max = vaultBalance - 0.002;
      setWithdrawAmount(max > 0 ? max.toFixed(4) : '0');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (isMarketsLoading) {
      return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white font-black animate-pulse">
            <Activity className="w-12 h-12 text-cyan-500 mb-4 animate-spin" />
            <span className="tracking-widest">LOADING PLATFORM...</span>
        </div>
      );
  }

  // Visual Guard: Is current card already in active picks?
  const currentCard = marketDeck[currentIdx];
  const isCurrentCardPicked = activePicks.some(p => p.marketId === currentCard?.id);
  const isSidebarInteractive = userAddress && gameState === 'playing' && streakStake > 0;

  return (
    <div className="h-screen w-screen bg-[#020205] text-[#F0F0F0] flex flex-col overflow-hidden relative font-sans">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e0b3d_0%,#020205_75%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-600/[0.12] rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/[0.12] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.1]" />
      </div>

      {/* HEADER */}
      <nav className="flex-none px-6 py-4 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-xl z-[100] h-16">
        <div className="flex items-center gap-10">
          <div onClick={() => setGameState('landing')} className="flex items-center gap-3 cursor-pointer group">
            <CustomLogo className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-xl uppercase italic group-hover:text-cyan-400 transition-colors">
                STREAK<span className="text-red-500">OR</span>BURN
              </span>
              <span className="text-[7px] font-bold text-cyan-400 uppercase tracking-[0.4em]">SUPER BOWL LX</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-cyan-400 transition-colors">
              <Coins className="w-3.5 h-3.5" /> BUY $SOB
            </button>
            <button onClick={() => {if (userAddress) setShowMyBets(true); else setShowEntryModal(true);}} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-cyan-400 transition-colors">
              <History className="w-3.5 h-3.5" /> MY BETS
            </button>
            <button onClick={() => {if (userAddress) setShowStakeSelect(true); else setShowEntryModal(true);}} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600/20 px-4 py-2 rounded-full hover:bg-blue-600 transition-colors border border-blue-500/30">
              <PlusCircle className="w-3.5 h-3.5" /> START NEW STREAK
            </button>
            <button onClick={() => setShowLiveFeed(true)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors">
              <Activity className="w-3.5 h-3.5" /> LIVE FEED
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {userAddress && (
            <div className="hidden md:flex flex-col items-end pr-6 border-r border-white/10">
              <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">
                Vault Balance
              </span>
              <span className="text-xs font-black text-white tabular-nums">
                {vaultBalance.toFixed(3)} SOL
              </span>
            </div>
          )}
          
          {userAddress ? (
            <button 
              onClick={() => setShowDashboard(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[9px] uppercase tracking-widest hover:brightness-110 transition-all duration-300 flex items-center gap-2 border border-white/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>{userAddress.slice(0, 4)}...{userAddress.slice(-4)}</span>
            </button>
          ) : (
             <button 
                onClick={() => setShowEntryModal(true)}
                className="px-6 py-2.5 bg-[#2563eb] rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:brightness-110 transition-all"
             >
                LOGIN / SIGN UP
             </button>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white/70 hover:text-white">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 z-[90] p-6 lg:hidden flex flex-col gap-4">
            {userAddress && (
              <div className="flex flex-col pb-4 border-b border-white/10">
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Active Account</span>
                <span className="text-sm font-black text-cyan-400">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
              </div>
            )}
            
            <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white py-3 border-b border-white/5">
              <Coins className="w-4 h-4 text-cyan-400" /> BUY $SOB
            </button>
            <button onClick={() => {if(userAddress) setShowMyBets(true); else setShowEntryModal(true); setIsMenuOpen(false);}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white py-3 border-b border-white/5">
              <History className="w-4 h-4 text-cyan-400" /> MY BETS
            </button>
            <button onClick={() => {if(userAddress) setShowStakeSelect(true); else setShowEntryModal(true); setIsMenuOpen(false);}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white py-3 border-b border-white/5">
              <PlusCircle className="w-4 h-4 text-cyan-400" /> START NEW STREAK
            </button>
            <button onClick={() => {setShowLiveFeed(true); setIsMenuOpen(false);}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white py-3">
              <Activity className="w-4 h-4 text-red-500" /> LIVE FEED
            </button>

            {userAddress && (
              <>
                <button onClick={() => {setShowDashboard(true); setIsMenuOpen(false);}} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-blue-400 py-3 border-t border-white/10">
                  <User className="w-4 h-4" /> VAULT
                </button>
                <button onClick={handleLogout} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-red-500 py-3">
                  <LogOut className="w-4 h-4" /> LOGOUT
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. VAULT MODAL (DEPOSIT ONLY) */}
      <AnimatePresence>
        {showDashboard && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDashboard(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-[#0a0a10] border border-white/10 p-6 md:p-10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center mb-6 flex-none">
                <h3 className="text-2xl font-black italic uppercase text-white">Vault</h3>
                <button onClick={() => setShowDashboard(false)}><X className="w-6 h-6 text-neutral-500 hover:text-white" /></button>
              </div>
              
              <div className="overflow-y-auto pr-2 flex-1 space-y-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* WALLET INFO */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between mb-4">
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">Your Deposit Address</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/50 p-4 rounded-xl border border-white/5">
                      <span className="text-xs font-mono text-cyan-400 break-all">{userAddress}</span>
                      <button onClick={() => handleCopy(userAddress)}><Copy className="w-4 h-4 text-white hover:text-green-400" /></button>
                    </div>
                    <p className="text-[9px] text-neutral-500 mt-2 text-center">
                        Send SOL to this address. Funds will appear below.
                    </p>
                  </div>

                  {/* BALANCE & ACTIONS */}
                  <div className="border-t border-white/10 pt-6">
                      <div className="flex justify-between items-end mb-4">
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Current Balance</span>
                          <span className="text-2xl font-black text-white">{vaultBalance.toFixed(3)} SOL</span>
                      </div>
                      
                      <button 
                        onClick={handleCheckDeposit} 
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 mb-4"
                      >
                          {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <ArrowDownCircle className="w-4 h-4" />}
                          Check for Deposits
                      </button>

                      {/* WITHDRAW SECTION */}
                      <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                          <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-1">Withdraw Funds</span>
                          <input type="text" placeholder="Destination Address" value={withdrawDest} onChange={(e) => setWithdrawDest(e.target.value)} className="w-full bg-[#0a0a10] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors" />
                          
                          <div className="flex gap-2 mt-2">
                              <div className="relative flex-1">
                                  <input type="number" placeholder="Amount SOL" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-[#0a0a10] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-white transition-colors" />
                                  <button onClick={handleMaxWithdraw} className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] bg-white/10 px-2 py-1 rounded text-white hover:bg-white/20">MAX</button>
                              </div>
                              <button onClick={handleWithdraw} disabled={isLoading} className="px-6 py-3 rounded-xl bg-white/10 text-white font-black text-[10px] uppercase hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50">
                                  {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <ArrowUpCircle className="w-4 h-4" />}
                                  Withdraw
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <button onClick={handleLogout} className="mt-4 text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center justify-center gap-2"><LogOut className="w-3 h-3" /> Logout</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. NEW ACCOUNT KEYS MODAL */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-[#0a0a10] border border-red-500/50 p-10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="text-center mb-6">
                <Key className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-black italic uppercase text-white mb-2">Save Your Keys!</h3>
                <p className="text-xs text-neutral-400">This is the ONLY time you will see your private key.</p>
              </div>

              <div className="space-y-4">
                  <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                      <span className="text-[9px] text-neutral-500 uppercase block mb-1">Public Address</span>
                      <div className="flex justify-between items-center">
                          <span className="text-xs text-white font-mono break-all">{userAddress}</span>
                          <button onClick={() => handleCopy(userAddress)}><Copy className="w-4 h-4 text-neutral-400 hover:text-white" /></button>
                      </div>
                  </div>

                  <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/30">
                      <span className="text-[9px] text-red-400 uppercase block mb-1">Private Key (SECRET)</span>
                      <div className="flex justify-between items-center">
                          <span className="text-xs text-white font-mono break-all">{userSecret}</span>
                          <button onClick={() => handleCopy(userSecret)}><Copy className="w-4 h-4 text-neutral-400 hover:text-white" /></button>
                      </div>
                  </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                  <div 
                    onClick={() => setKeysConfirmed(!keysConfirmed)}
                    className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all ${keysConfirmed ? 'bg-red-600 border-red-600' : 'border-white/30'}`}
                  >
                      {keysConfirmed && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase cursor-pointer" onClick={() => setKeysConfirmed(!keysConfirmed)}>I have saved my private key securely</span>
              </div>

              <button 
                onClick={handleConfirmKeys}
                disabled={!keysConfirmed}
                className="mt-6 w-full py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MY BETS MODAL */}
      <AnimatePresence>
        {showMyBets && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMyBets(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-[#0a0a10] border border-white/10 p-6 md:p-10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center mb-6 flex-none">
                <h3 className="text-2xl font-black italic uppercase text-white">My Bets</h3>
                <button onClick={() => setShowMyBets(false)}><X className="w-6 h-6 text-neutral-500 hover:text-white" /></button>
              </div>
              
              <div className="overflow-y-auto pr-2 flex-1 space-y-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="space-y-4">
                      {streakHistory.length === 0 && <p className="text-[10px] text-neutral-600 text-center py-4">No active streaks. Start your first 10-streak!</p>}

                      {streakHistory.map((streak) => (
                          <div key={streak.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                              <div className="flex justify-between items-center mb-3">
                                  <div className="flex flex-col">
                                      <span className="text-[9px] font-bold text-neutral-400">{new Date(streak.date).toLocaleDateString()}</span>
                                      <span className="text-[8px] font-black uppercase tracking-widest text-red-500">REAL STREAK</span>
                                  </div>
                                  <div className="text-right">
                                      <span className="text-[9px] font-bold text-white block">STAKE: {streak.stake} SOL</span>
                                      <span className="text-[8px] font-black text-green-500 uppercase">POTENTIAL: {streak.potentialPayout} SOL</span>
                                  </div>
                              </div>
                              <div className="space-y-1">
                                  <div className="flex justify-between text-[8px] font-bold text-neutral-500 uppercase bg-black/20 p-2 rounded">
                                      <span>Status</span>
                                      <span className={isEventStarted ? 'text-green-400' : 'text-yellow-500'}>
                                          {isEventStarted ? 'LIVE TRACKING' : 'PENDING START'}
                                      </span>
                                  </div>
                                  {/* RENDER FULL LIST OF BETS */}
                                  <div className="mt-2 space-y-2">
                                      {streak.picks.map((p, i) => (
                                          <div key={i} className="flex items-center gap-3 bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
                                              {p.img && <img src={p.img} className="w-8 h-8 rounded-full object-cover" />}
                                              <div className="flex-1 min-w-0">
                                                  <div className="text-[8px] text-neutral-400 truncate uppercase">{p.question}</div>
                                                  <div className="text-[10px] font-bold text-white">{p.outcome}</div>
                                              </div>
                                              <div className="text-[9px] font-mono text-cyan-400">{(p.odds * 100).toFixed(0)}%</div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STAKE SELECTION MODAL */}
      <AnimatePresence>
        {showStakeSelect && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStakeSelect(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-[#0a0a10] border border-white/10 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl text-center">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-black italic uppercase text-white mb-2">10-Streak Challenge</h3>
              <p className="text-sm font-bold text-neutral-400 mb-2 max-w-md mx-auto">
                  Mode: <span className="text-red-500">REAL MONEY</span>
              </p>
              <p className="text-[10px] text-neutral-500 mb-8 uppercase tracking-widest">Select Stake Amount</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                 {[0.05, 0.5, 1].map((amt) => (
                    <button key={amt} onClick={() => handleStartStreak(amt)} className="p-6 rounded-2xl bg-white/5 border border-white/20 hover:bg-white hover:text-black transition-all group">
                        <span className="text-2xl font-black block">{amt} SOL</span>
                        <span className="text-[9px] font-bold uppercase opacity-50 group-hover:opacity-100">Lock Stake</span>
                    </button>
                 ))}
              </div>
              <div className="flex gap-2 mb-6">
                  <input 
                    type="number" 
                    placeholder="Custom SOL (0.05-500)" 
                    value={customStake} 
                    onChange={(e) => setCustomStake(e.target.value)} 
                    className="flex-1 bg-[#0a0a10] border border-white/10 rounded-xl px-4 text-white font-bold focus:border-blue-500 focus:outline-none h-12"
                  />
                  <button onClick={() => handleStartStreak(customStake)} className="px-6 rounded-xl bg-white text-black font-black text-[10px] uppercase hover:bg-gray-200">Start</button>
              </div>
              
              <button onClick={() => setShowStakeSelect(false)} className="text-[10px] font-black text-red-500 uppercase hover:text-white transition-colors">Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ENTRY MODAL */}
      <AnimatePresence>
        {showEntryModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEntryModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-[#0a0a10] border border-white/10 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl">
              <div className="text-center mb-10">
                <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-3xl font-black italic uppercase text-white mb-2">Player Access</h3>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.3em]">No Wallet Connection Required</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div onClick={handleCreateAccount} className="p-6 rounded-2xl bg-black border border-blue-500/30 hover:border-blue-500 cursor-pointer text-center group transition-all">
                  <span className="text-[8px] font-black text-blue-500 block mb-1">NEW PLAYER</span>
                  <p className="text-xs font-black text-white italic uppercase">Create Account</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL (STREAK LOCKED) */}
      <AnimatePresence>
        {gameState === 'streak_submitted' && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-[#0a0a10] border border-green-500/50 p-12 rounded-[3rem] w-full max-w-md shadow-2xl text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-4xl font-black italic uppercase mb-2 text-white">LOCKED IN.</h2>
                <p className="text-neutral-400 text-[10px] font-black uppercase mb-8 tracking-widest">
                    Your 10-Streak is saved. Results pending Super Bowl start.
                </p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => {setGameState('landing'); setShowMyBets(true);}} className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">View My Bets</button>
                    <button onClick={() => {setGameState('landing'); setShowStakeSelect(true);}} className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">Start New Streak</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        
      {/* LIVE FEED MODAL */}
      <AnimatePresence>
        {showLiveFeed && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLiveFeed(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-[#0a0a10] border border-white/10 p-8 rounded-[2rem] w-full max-w-lg shadow-2xl h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-6 flex-none border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tight">Arena Feed</h3>
                </div>
                <button onClick={() => setShowLiveFeed(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X className="w-4 h-4 text-neutral-400 hover:text-white" /></button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-white/[0.02] to-transparent border border-white/5 hover:border-cyan-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${Math.random() > 0.5 ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {Math.random() > 0.5 ? <TrendingUp className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white">User_{Math.floor(Math.random()*9999)}</span>
                          <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">{Math.random() > 0.5 ? 'WON STREAK' : 'VAULT DEPOSIT'}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-cyan-400 block">{(Math.random() * 5).toFixed(2)} SOL</span>
                        <span className="text-[8px] font-bold text-neutral-600">Just now</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 p-6 overflow-hidden z-10">
        <section className="flex flex-col min-h-0 justify-center items-center">
          <AnimatePresence mode="wait">
            {gameState === 'landing' && (
              <motion.div key="landing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-4xl text-center">
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Exchange: Seahawks vs Patriots</span>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black italic tracking-tighter leading-[0.85] mb-8 uppercase text-white">
                  SEAHAWKS.<br/>PATRIOTS.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">SUPER BOWL LX.</span>
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left hover:border-cyan-400/50 transition-colors">
                    <span className="text-[10px] font-black text-cyan-400 block mb-2">STEP 01</span>
                    <p className="text-xs font-bold text-neutral-400">Connect Wallet & Select Mode.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left hover:border-red-500/50 transition-colors">
                    <span className="text-[10px] font-black text-red-500 block mb-2">STEP 02</span>
                    <p className="text-xs font-bold text-neutral-400">Select Stake & Start 10-Streak.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left hover:border-purple-500/50 transition-colors">
                    <span className="text-[10px] font-black text-purple-500 block mb-2">STEP 03</span>
                    <p className="text-xs font-bold text-neutral-400">Win 10/10 to 3x your Stake.</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <button 
                    onClick={handleEnterArena} 
                    className="px-10 py-5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-3"
                  >
                    Enter Betting Arena <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-6 px-6 border-l border-white/10">
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Kickoff Event</span>
                      <span className="text-xl font-black tabular-nums text-white">{countdown.h}H {countdown.m}M {countdown.s}S</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div key="playing" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl h-full max-h-[580px] flex">
                <div className="w-full bg-[#0c0c14]/95 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
                  <div className="w-full md:w-[45%] bg-black relative overflow-hidden group">
                     {/* DYNAMIC IMAGE FROM API */}
                     {marketDeck[currentIdx]?.img && <img src={marketDeck[currentIdx].img} className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                     
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                       <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                         {currentIdx === 2 || currentIdx === 5 ? <Music className="w-8 h-8 text-white/50" /> : <Trophy className="w-8 h-8 text-white/50" />}
                       </div>
                       
                       {/* LIVE ODDS PILL */}
                       <span className="text-[12px] font-black uppercase tracking-widest text-cyan-400 mb-2 bg-black/50 px-3 py-1 rounded-full border border-cyan-500/30">
                         {marketDeck[currentIdx]?.outcome_yes}: {(marketDeck[currentIdx]?.price_yes * 100).toFixed(0)}%
                       </span>
                       <span className="text-[8px] font-bold text-white/30 mt-2">POLYMARKET DATA</span>
                     </div>
                     <div className="absolute inset-0 border-r border-white/5" />
                  </div>

                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/30">
                            <Flame className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block">Building Streak</span>
                            <span className="text-2xl font-black text-white italic tabular-nums">{activePicks.length}/10</span>
                          </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block">Stake</span>
                            <span className="text-xl font-black text-green-400 tabular-nums">{streakStake} SOL</span>
                        </div>
                      </div>

                      {/* MAIN QUESTION DISPLAY */}
                      <div className="min-h-[120px]">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 block">
                            {marketDeck[currentIdx]?.category}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black italic uppercase leading-tight text-white tracking-tighter">
                          {marketDeck[currentIdx]?.question}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* DYNAMIC BUTTONS (LEFT=Outcome 1, RIGHT=Outcome 2) */}
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleAction(0)} 
                            disabled={isLoading || isCurrentCardPicked} 
                            className={`py-6 rounded-xl text-white font-black text-[12px] uppercase tracking-widest flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]
                                ${isCurrentCardPicked ? 'bg-white/5 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-125'}
                            `}
                        >
                            {isLoading ? <Activity className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>{isCurrentCardPicked ? 'ALREADY BETTED' : marketDeck[currentIdx]?.outcome_yes}</span>
                                    {!isCurrentCardPicked && <span className="text-[9px] opacity-70">{(marketDeck[currentIdx]?.price_yes * 100).toFixed(0)}% PROB</span>}
                                </>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => handleAction(1)} 
                            disabled={isLoading || isCurrentCardPicked} 
                            className={`py-6 rounded-xl text-white font-black text-[12px] uppercase tracking-widest flex flex-col items-center justify-center gap-1 active:scale-95 transition-all
                                ${isCurrentCardPicked ? 'bg-white/5 border-white/5 cursor-not-allowed opacity-50' : 'bg-white/5 border border-white/10 hover:bg-white/10'}
                            `}
                        >
                            {isLoading ? <Activity className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span>{isCurrentCardPicked ? 'ALREADY BETTED' : marketDeck[currentIdx]?.outcome_no}</span>
                                    {!isCurrentCardPicked && <span className="text-[9px] opacity-70">{(marketDeck[currentIdx]?.price_no * 100).toFixed(0)}% PROB</span>}
                                </>
                            )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        
        {/* RIGHT SIDEBAR (Live Ticker / Market Selector) */}
        <aside className="hidden lg:flex flex-col gap-5 min-h-0 border-l border-white/5 pl-6 max-w-sm">
          <div className="flex-none flex items-center justify-between">
             <div className="flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-red-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Live Markets</span>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {marketDeck.map((m) => {
              // Check if market is locked
              const isLocked = activePicks.some(p => p.marketId === m.id);
              
              return (
              <div 
                key={m.id} 
                className={`group relative p-4 rounded-2xl border overflow-hidden backdrop-blur-md transition-all 
                    ${isSidebarInteractive 
                        ? 'border-white/[0.08] hover:border-cyan-500/30 cursor-pointer' 
                        : 'border-white/[0.05] opacity-40 grayscale pointer-events-none cursor-not-allowed'}
                    ${currentIdx === m.visualIndex && isSidebarInteractive ? 'border-cyan-500/50 bg-white/[0.05]' : 'bg-white/[0.03]'}
                `} 
                onClick={() => {
                  if(isSidebarInteractive) {
                      setCurrentIdx(m.visualIndex);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-bold text-cyan-400 uppercase">{m.category}</span>
                    {isLocked ? <Lock className="w-3 h-3 text-red-500" /> : <ExternalLink className="w-3 h-3 text-white/20" />}
                </div>
                <h4 className="text-xs font-bold text-white mb-3 leading-tight line-clamp-2">{m.question}</h4>
                <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${m.price_yes * 100}%` }} />
                    </div>
                    <span className="text-[8px] font-black text-white">{(m.price_yes * 100).toFixed(0)}%</span>
                </div>
              </div>
            )})}
          </div>
        </aside>
      </main>

      {/* FOOTER */}
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: ticker 50s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        html, body { margin: 0; padding: 0; height: 100vh; width: 100vw; overflow: hidden; background-color: #020205; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        @media (min-width: 1024px) { .h-screen { overflow: hidden; } }
        @media (max-width: 1023px) { main { overflow-y: auto; display: flex; flex-direction: column; height: calc(100vh - 112px); } section { flex: 1 0 auto; min-height: 500px; } }
        @media (max-width: 639px) { .xs\\:hidden { display: block; } .xs\\:inline { display: none; } }
      `}} />
    </div>
  );
}

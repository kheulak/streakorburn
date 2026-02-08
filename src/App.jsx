import { WalletConnectionProvider } from './contexts/WalletConnectionProvider';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Lock,
  Menu,
  X,
  Trophy,
  ChevronRight,
  Wallet2,
  Zap,
  Twitter,
  Coins,
  ShieldCheck,
  TrendingUp,
  Activity,
  Mic2,
  Music,
  User,
  LogOut,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  ExternalLink
} from 'lucide-react';

// --- CONFIGURATION ---
// !!! IMPORTANT: PASTE YOUR HOUSE WALLET ADDRESS HERE !!!
const HOUSE_WALLET_ADDRESS = "REPLACE_WITH_YOUR_WALLET_ADDRESS"; 
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

// Fallback Data (Loads if API fails so UI doesn't break)
const FALLBACK_DECK = [
  { 
    id: 0, 
    question: "Sam Darnold", 
    category: "SUPER BOWL MVP", 
    img: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=800", 
    outcome_yes: "Yes", 
    price_yes: 0.44, 
    outcome_no: "No", 
    price_no: 0.56 
  },
  { 
    id: 1, 
    question: "Seahawks vs Patriots", 
    category: "GAME WINNER", 
    img: "https://images.unsplash.com/photo-1628230538965-c3f25c76063b?q=80&w=800", 
    outcome_yes: "Seahawks", 
    price_yes: 0.55, 
    outcome_no: "Patriots", 
    price_no: 0.45 
  }
];

function GameContent() {
  // --- STATE INITIALIZATION ---
  const [gameState, setGameState] = useState('landing'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Market Data State
  const [marketDeck, setMarketDeck] = useState(FALLBACK_DECK);
  const [isMarketsLoading, setIsMarketsLoading] = useState(true);

  // Connection State
  const { publicKey, wallet, disconnect, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const walletAddress = publicKey ? publicKey.toString() : null;
  const walletName = wallet?.adapter?.name || 'Solana Wallet';
  
  // Mode State
  const [isRealMode, setIsRealMode] = useState(() => localStorage.getItem('sob_mode') === 'real');

  // Balances
  const [demoBalance, setDemoBalance] = useState(10.0);
  const [vaultBalance, setVaultBalance] = useState(0.0);
  const [winnings, setWinnings] = useState(0.0);

  // Dashboard Inputs
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Gameplay
  const [betAmount, setBetAmount] = useState(0.5);
  
  const targetDate = useMemo(() => new Date('2026-02-08T18:30:00-05:00').getTime(), []);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });

  // --- 1. LIVE DATA STREAM (POLLING) ---
  useEffect(() => {
    async function fetchPolymarket() {
      try {
        const res = await fetch('/api/markets');
        const data = await res.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Add index for navigation
          const indexedData = data.map((item, index) => ({...item, id: index}));
          setMarketDeck(indexedData);
          setIsMarketsLoading(false);
        }
      } catch (error) {
        console.error("Failed to stream markets", error);
        setIsMarketsLoading(false);
      }
    }
    
    fetchPolymarket(); // Initial load
    const interval = setInterval(fetchPolymarket, 10000); // Stream every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // --- 2. LIVE BALANCE STREAM ---
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletAddress && isRealMode) {
        try {
          const res = await fetch(`/api/balance?userAddress=${walletAddress}`);
          const data = await res.json();
          if (data.success) {
            setVaultBalance(data.balance);
          }
        } catch (e) {
          console.error("Failed to fetch balance", e);
        }
      }
    };
    
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); 
    return () => clearInterval(interval);
  }, [walletAddress, isRealMode]);

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    if (walletAddress) localStorage.setItem('sob_mode', isRealMode ? 'real' : 'sim');
  }, [walletAddress, isRealMode]);

  useEffect(() => {
    if (walletAddress && !isRealMode) {
      const savedSim = localStorage.getItem(`sob_sim_bal_${walletAddress}`);
      const savedStreak = localStorage.getItem(`sob_sim_streak_${walletAddress}`);
      if (savedSim) setDemoBalance(parseFloat(savedSim));
      if (savedStreak) setStreak(parseInt(savedStreak));
    }
  }, [walletAddress, isRealMode]);

  useEffect(() => {
    if (walletAddress && !isRealMode) {
      localStorage.setItem(`sob_sim_bal_${walletAddress}`, demoBalance.toString());
      localStorage.setItem(`sob_sim_streak_${walletAddress}`, streak.toString());
    }
  }, [demoBalance, streak, walletAddress, isRealMode]);

  // Timer Logic
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

  // --- ACTIONS ---

  const handleModeSelect = (mode) => {
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }
    setIsRealMode(mode === 'real');
    setGameState('playing');
    setShowEntryModal(false);
  };

  const handleDeposit = async () => {
    if (!publicKey) return alert("Connect wallet first!");
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) return alert("Enter valid amount");
    if (HOUSE_WALLET_ADDRESS === "REPLACE_WITH_YOUR_WALLET_ADDRESS") return alert("DEV ERROR: House Wallet not set");

    try {
        setIsLoading(true);
        const amountSOL = parseFloat(depositAmount);
        const housePubkey = new PublicKey(HOUSE_WALLET_ADDRESS);
        const latestBlockhash = await connection.getLatestBlockhash();
        const transaction = new Transaction({
            feePayer: publicKey,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        }).add(SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: housePubkey, lamports: amountSOL * LAMPORTS_PER_SOL }));

        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction({ blockhash: latestBlockhash.blockhash, lastValidBlockHeight: latestBlockhash.lastValidBlockHeight, signature: signature }, 'confirmed');

        const verifyResponse = await fetch('/api/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ signature: signature, userAddress: publicKey.toString() })
        });

        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) throw new Error(verifyData.error || "Verification failed");

        setVaultBalance(verifyData.newBalance);
        setDepositAmount('');
        alert(`Secure Deposit Confirmed! ${amountSOL} SOL added to Vault.`);
    } catch (error) {
        console.error("Deposit Failed:", error);
        alert("Deposit Failed: " + error.message);
    } finally { setIsLoading(false); }
  };

  const handleWithdraw = async () => {
    if (!publicKey) return alert("Connect wallet first!");
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return alert("Enter valid amount");
    if (parseFloat(withdrawAmount) > vaultBalance) return alert("Insufficient Funds");

    try {
      setIsLoading(true);
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: publicKey.toString(), amount: parseFloat(withdrawAmount) })
      });
      const data = await response.json();
      if (response.ok) {
        setVaultBalance(prev => prev - parseFloat(withdrawAmount));
        setWithdrawAmount('');
        alert(`Withdrawal Success! Tx: ${data.signature}`);
      } else { throw new Error(data.error); }
    } catch (error) { alert("Withdraw Failed: " + error.message); } finally { setIsLoading(false); }
  };

  // --- GAME ACTION (NO LEVERAGE) ---
  const handleAction = async (selectionIndex) => {
    // selectionIndex: 0 (Left Button), 1 (Right Button)
    
    if (!marketDeck || marketDeck.length === 0) return;
    const currentCard = marketDeck[currentIdx];
    
    const odds = selectionIndex === 0 ? currentCard.price_yes : currentCard.price_no;
    const outcomeName = selectionIndex === 0 ? currentCard.outcome_yes : currentCard.outcome_no;

    // DEMO MODE LOGIC
    if (!isRealMode) {
        if (demoBalance < betAmount) { 
            setDemoBalance(10.0); 
            return alert("Demo Bankrupt! Balance Reset."); 
        }
        
        const isWin = Math.random() < odds; 
        const payout = betAmount / odds;
        
        if (isWin) {
            setStreak(prev => prev + 1);
            setDemoBalance(prev => prev + (payout - betAmount)); 
            
            if (currentIdx === marketDeck.length - 1) setGameState('winner');
            else setCurrentIdx(prev => prev + 1);
        } else {
            setDemoBalance(prev => Math.max(0, prev - betAmount));
            setGameState('burned');
        }
        return;
    }

    // REAL MODE LOGIC
    if (vaultBalance < betAmount) {
        setShowDashboard(true);
        return;
    }

    try {
        setIsLoading(true);
        const response = await fetch('/api/bet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userAddress: walletAddress,
                amount: betAmount,
                odds: odds,
                prediction: outcomeName
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setVaultBalance(data.newBalance);

        if (data.isWin) {
            setStreak(prev => prev + 1);
            setWinnings(prev => prev + data.payout);
            if (currentIdx === marketDeck.length - 1) setGameState('winner');
            else setCurrentIdx(prev => prev + 1);
        } else {
            setGameState('burned');
        }
    } catch (error) { 
        alert("Bet Error: " + error.message); 
    } finally { 
        setIsLoading(false); 
    }
  };

  const handleReset = () => {
    setGameState('landing');
    setCurrentIdx(0);
    setStreak(0);
    setShowEntryModal(false);
    setIsMenuOpen(false);
  };

  if (isMarketsLoading) {
      return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white font-black animate-pulse">
            <Activity className="w-12 h-12 text-cyan-500 mb-4 animate-spin" />
            <span className="tracking-widest">CONNECTING TO POLYMARKET...</span>
        </div>
      );
  }

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
              <span className="text-[7px] font-bold text-cyan-400 uppercase tracking-[0.4em]">SUPER BOWL LX - SANTA CLARA</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-cyan-400 transition-colors">
              <Coins className="w-3.5 h-3.5" /> BUY $SOB
            </button>
            <button className="flex-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-[#1DA1F2] transition-colors">
              <Twitter className="w-3.5 h-3.5" /> TWITTER
            </button>
            <button onClick={() => setShowLiveFeed(true)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors">
              <Activity className="w-3.5 h-3.5" /> LIVE FEED
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* BALANCE DISPLAY */}
          {walletAddress && (
            <div className="hidden md:flex flex-col items-end pr-6 border-r border-white/10">
              <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">
                {isRealMode ? 'Vault Balance' : 'Sim Balance'}
              </span>
              <span className="text-xs font-black text-white tabular-nums">
                {isRealMode ? vaultBalance.toFixed(3) : demoBalance.toFixed(2)} SOL
              </span>
            </div>
          )}
          
          {walletAddress ? (
            <button 
              onClick={() => setShowDashboard(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[9px] uppercase tracking-widest hover:brightness-110 transition-all duration-300 flex items-center gap-2 border border-white/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
            </button>
          ) : (
             <div className="scale-75 origin-right">
                <WalletMultiButton />
             </div>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white/70 hover:text-white">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* DASHBOARD MODAL */}
      <AnimatePresence>
        {showDashboard && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDashboard(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-[#0a0a10] border border-white/10 p-10 rounded-[2rem] w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic uppercase text-white">Vault Profile</h3>
                <button onClick={() => setShowDashboard(false)}><X className="w-6 h-6 text-neutral-500 hover:text-white" /></button>
              </div>
              <div className="flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1 block">Connected {walletName}</span>
                  <div className="flex items-center gap-2">
                    <Wallet2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-lg font-black text-white">{walletAddress}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-black border border-white/5">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block mb-2">Vault Balance</span>
                    <span className="text-2xl font-black text-white">{vaultBalance.toFixed(3)} SOL</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-black border border-white/5">
                    <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block mb-2">Total Winnings</span>
                    <span className="text-2xl font-black text-green-400">{winnings.toFixed(3)} SOL</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <input type="number" placeholder="Amount SOL" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors" />
                    <button onClick={handleDeposit} disabled={isLoading} className="px-6 py-4 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50">
                        {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <ArrowDownCircle className="w-4 h-4" />}
                        {isLoading ? 'Processing...' : 'Deposit'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Amount SOL" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm font-bold focus:outline-none focus:border-white transition-colors" />
                    <button onClick={handleWithdraw} disabled={isLoading} className="px-6 py-4 rounded-xl bg-white/10 text-white font-black text-[10px] uppercase hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-50">
                        {isLoading ? <Activity className="w-4 h-4 animate-spin" /> : <ArrowUpCircle className="w-4 h-4" />}
                        {isLoading ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>
                <button onClick={() => disconnect()} className="mt-4 text-[9px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center justify-center gap-2"><LogOut className="w-3 h-3" /> Disconnect Wallet</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ENTRY MODAL */}
        {showEntryModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEntryModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-[#0a0a10] border border-white/10 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl">
              <div className="text-center mb-10">
                <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-3xl font-black italic uppercase text-white mb-2">Arena Connection</h3>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.3em]">Accessing SB LX Exchange Terminal</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => handleModeSelect('real')} className="p-6 rounded-2xl bg-black border border-red-500/30 hover:border-red-500 cursor-pointer text-center group transition-all">
                  <span className="text-[8px] font-black text-red-500 block mb-1">PRO ARENA</span>
                  <p className="text-xs font-black text-white italic uppercase">Enter Vault</p>
                </div>
                <button onClick={() => handleModeSelect('sim')} className="p-6 rounded-2xl bg-white/5 border border-white/20 hover:bg-white hover:border-white text-center group transition-all">
                  <span className="text-[8px] font-black text-blue-400 group-hover:text-red-600 block mb-1">SIMULATOR</span>
                  <p className="text-xs font-black text-white group-hover:text-black italic uppercase transition-colors">Practice Mode</p>
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* LIVE FEED MODAL */}
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
                    <p className="text-xs font-bold text-neutral-400">Predict plays. Winners streak, losers burn.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-left hover:border-purple-500/50 transition-colors">
                    <span className="text-[10px] font-black text-purple-500 block mb-2">STEP 03</span>
                    <p className="text-xs font-bold text-neutral-400">Cash out streak multipliers instantly.</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <button 
                    onClick={() => setShowEntryModal(true)} 
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
                            <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest block">Current Streak</span>
                            <span className="text-2xl font-black text-white italic tabular-nums">{streak}X</span>
                          </div>
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
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                         <span className="text-[7px] font-black text-neutral-500 uppercase block mb-2">Stake (SOL)</span>
                         <div className="flex gap-1">
                           {[0.1, 0.5, 1.0].map(v => (
                               <button key={v} onClick={() => setBetAmount(v)} className={`flex-1 py-2 rounded text-[10px] font-black transition-all ${betAmount === v ? 'bg-white text-black' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`}>{v}</button>
                           ))}
                         </div>
                      </div>
                      
                      {/* DYNAMIC BUTTONS (LEFT=Outcome 1, RIGHT=Outcome 2) */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Button 1: Usually "Yes" or "Team A" */}
                        <button onClick={() => handleAction(0)} className="py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-[10px] uppercase tracking-widest hover:brightness-125 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all">
                            <span>{marketDeck[currentIdx]?.outcome_yes}</span>
                            <span className="text-[8px] opacity-70">{(marketDeck[currentIdx]?.price_yes * 100).toFixed(0)}% PROB</span>
                        </button>
                        
                        {/* Button 2: Usually "No" or "Team B" */}
                        <button onClick={() => handleAction(1)} className="py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all">
                            <span>{marketDeck[currentIdx]?.outcome_no}</span>
                            <span className="text-[8px] opacity-70">{(marketDeck[currentIdx]?.price_no * 100).toFixed(0)}% PROB</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'burned' && (
              <motion.div key="burned" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-12 bg-black border border-red-500/50 rounded-[3rem] max-w-md shadow-2xl">
                <Flame className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-5xl font-black italic uppercase mb-2 text-white">BURNED.</h2>
                <p className="text-neutral-500 text-[9px] font-black uppercase mb-8 tracking-widest italic">Streak Broken. Funds Liquidated.</p>
                <button onClick={() => {setGameState('playing'); setCurrentIdx(0); setStreak(0);}} className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">New Session</button>
              </motion.div>
            )}

            {gameState === 'winner' && (
              <motion.div key="winner" className="text-center p-12 bg-[#0c0c14] border border-cyan-500/50 rounded-[3rem] max-w-md shadow-2xl">
                <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-5xl font-black italic uppercase mb-2 text-white">CHAMPION.</h2>
                <p className="text-neutral-500 text-[9px] font-black uppercase mb-8 tracking-widest italic">Super Bowl LX Prediction Clear.</p>
                <button onClick={handleReset} className="w-full bg-cyan-500 text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Claim Winnings</button>
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
            {marketDeck.map((m) => (
              <div 
                key={m.id} 
                className={`group relative p-4 rounded-2xl bg-white/[0.03] border overflow-hidden backdrop-blur-md hover:border-cyan-500/30 transition-all cursor-pointer ${currentIdx === m.id ? 'border-cyan-500/50 bg-white/[0.05]' : 'border-white/[0.08]'}`} 
                onClick={() => {
                  setCurrentIdx(m.id);
                  setGameState('playing'); 
                }}
              >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-bold text-cyan-400 uppercase">{m.category}</span>
                    <ExternalLink className="w-3 h-3 text-white/20" />
                </div>
                <h4 className="text-xs font-bold text-white mb-3 leading-tight line-clamp-2">{m.question}</h4>
                <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${m.price_yes * 100}%` }} />
                    </div>
                    <span className="text-[8px] font-black text-white">{(m.price_yes * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-2 text-[8px] text-neutral-500 flex justify-between">
                    <span>{m.outcome_yes}</span>
                    <span>{m.outcome_no}</span>
                </div>
              </div>
            ))}
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

export default function App() {
  return (
    <WalletConnectionProvider>
      <GameContent />
    </WalletConnectionProvider>
  );
}

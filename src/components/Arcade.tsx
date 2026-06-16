/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { DailyTask } from '../types';
import { CheckCircle, ShieldAlert, Award, Star, RefreshCw, Trophy, Play, Circle, HeartHandshake, Eye, BookOpen, Flame, Check, ShieldCheck, Disc, Share2, BrainCircuit } from 'lucide-react';

const getTaskIcon = (iconName: string, size: number = 16) => {
  switch (iconName) {
    case 'ShieldCheck':
      return <ShieldCheck size={size} />;
    case 'Disc':
      return <Disc size={size} />;
    case 'Share2':
      return <Share2 size={size} />;
    case 'BrainCircuit':
      return <BrainCircuit size={size} />;
    case 'BookOpen':
      return <BookOpen size={size} />;
    default:
      return <Award size={size} />;
  }
};
import { motion, AnimatePresence } from 'motion/react';

const WHEEL_SECTORS = [
  { value: '400', label: '400', isRed: true, coins: 400, xp: 40 },
  { value: '30', label: '30', isRed: false, coins: 30, xp: 5 },
  { value: '90', label: '90', isRed: true, coins: 90, xp: 10 },
  { value: '150', label: '150', isRed: false, coins: 150, xp: 15 },
  { value: 'TRY AGAIN', label: 'TRY AGAIN', isRed: true, coins: 0, xp: 2 },
  { value: '500', label: '500', isRed: false, coins: 500, xp: 50 },
  { value: '20', label: '20', isRed: true, coins: 20, xp: 2 },
  { value: '60', label: '60', isRed: false, coins: 60, xp: 6 },
  { value: '400', label: '400', isRed: true, coins: 400, xp: 40 },
  { value: '30', label: '30', isRed: false, coins: 30, xp: 5 },
  { value: '90', label: '90', isRed: true, coins: 90, xp: 10 },
  { value: '150', label: '150', isRed: false, coins: 150, xp: 15 },
  { value: 'TRY AGAIN', label: 'TRY AGAIN', isRed: true, coins: 0, xp: 2 },
  { value: '10', label: '10', isRed: false, coins: 10, xp: 2 },
  { value: '70', label: '70', isRed: true, coins: 70, xp: 7 },
  { value: '200', label: '200', isRed: false, coins: 200, xp: 20 },
];

const describeSector = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  const x1 = cx + r * Math.sin(startRad);
  const y1 = cy - r * Math.cos(startRad);
  const x2 = cx + r * Math.sin(endRad);
  const y2 = cy - r * Math.cos(endRad);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

interface ArcadeProps {
  tasks: DailyTask[];
  onCompleteTask: (taskId: string, coinsEarned: number, xpEarned: number) => void;
  userCoins: number;
  onAwardCoins: (coins: number, xp: number) => void;
}

export default function Arcade({ tasks, onCompleteTask, userCoins, onAwardCoins }: ArcadeProps) {
  const [activeGame, setActiveGame] = useState<'none' | 'captcha' | 'spin' | 'memory' | 'rush' | 'quiz'>('none');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'info' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // ==========================================
  // GAME 1: CAPTCHA SLIDER PUZZLE
  // ==========================================
  const [captchaSlider, setCaptchaSlider] = useState(20);
  const CAPTCHA_TARGET = 72; // Match target offset
  const [captchaStatus, setCaptchaStatus] = useState<'idle' | 'solved'>('idle');

  const handleVerifyCaptcha = () => {
    const diff = Math.abs(captchaSlider - CAPTCHA_TARGET);
    if (diff <= 4) {
      setCaptchaStatus('solved');
      showFeedback('✅ Human Verification Successful! +30 Star Coins earned.', 'success');
      onAwardCoins(30, 15);
      onCompleteTask('task-captcha', 30, 15);
    } else {
      showFeedback('❌ Misaligned! Please fit the sliding stamp directly into the slot silhouette.', 'info');
    }
  };

  // ==========================================
  // GAME 2: SUSTAINABILITY LUCKY SPIN
  // ==========================================
  const [isRotating, setIsRotating] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const handleSpinClick = () => {
    if (isRotating) return;
    setIsRotating(true);
    
    // Select winner index first
    const winnerIndex = Math.floor(Math.random() * 16);
    const sector = WHEEL_SECTORS[winnerIndex];
    
    // Math to align land on 12 o'clock sector:
    // targetAngle = (360 - targetR) % 360
    const randomOffset = (Math.random() - 0.5) * 12; // -6 to +6 deg offset
    const targetR = winnerIndex * 22.5 + randomOffset;
    const targetAngle = (360 - targetR + 360) % 360;
    
    // Spin must be clockwise, add 1440 degrees (4 full spins) and land on targetAngle
    const spinMod = spinAngle % 360;
    const nextAngle = spinAngle + 1440 + (360 - spinMod + targetAngle) % 360;
    setSpinAngle(nextAngle);

    setTimeout(() => {
      setIsRotating(false);
      setSpinCount(prev => prev + 1);

      let coins = sector.coins;
      let xp = sector.xp;
      let rewardText = '';

      if (sector.value === 'TRY AGAIN') {
        rewardText = '🎡 LUCK SAVED! You landed on TRY AGAIN! Gained +5 XP!';
        coins = 0;
        xp = 5;
      } else {
        rewardText = `🎉 Won ${coins} Star Coins and earned +${xp} XP!`;
      }

      showFeedback(`🎡 SPIN COMPLETE! ${rewardText}`, 'success');
      onAwardCoins(coins, xp);
      onCompleteTask('task-spin', coins, xp);
    }, 3000);
  };

  // ==========================================
  // GAME 3: MEMORY CARD FLIP MATCH
  // ==========================================
  const CARD_ICONS = ['👕', '🧢', '🧥', '☕', '👕', '🧢', '🧥', '☕'];
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const initMemoryGame = () => {
    // Shuffle
    const arr = [...CARD_ICONS].sort(() => Math.random() - 0.5);
    setShuffledCards(arr);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMemoryMoves(0);
  };

  const handleCardClick = (idx: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(idx) || matchedIndices.includes(idx)) return;

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(p => p + 1);
      const [first, second] = newFlipped;
      if (shuffledCards[first] === shuffledCards[second]) {
        // Match!
        const nextMatched = [...matchedIndices, first, second];
        setMatchedIndices(nextMatched);
        setFlippedIndices([]);
        
        if (nextMatched.length === shuffledCards.length) {
          showFeedback('🧠 SMART MIND! Memory Match complete! +40 Coins.', 'success');
          onAwardCoins(40, 25);
          onCompleteTask('task-memory-match', 40, 25);
        }
      } else {
        // Discrepancy, flip back shortly
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // ==========================================
  // GAME 4: CLICK RUSH EXTREME REFLEX
  // ==========================================
  const [rushRunning, setRushRunning] = useState(false);
  const [rushScore, setRushScore] = useState(0);
  const [rushTimeLeft, setRushTimeLeft] = useState(10);
  const [rushTarget, setRushTarget] = useState({ x: 50, y: 50 });
  const rushContainerRef = useRef<HTMLDivElement>(null);

  const triggerNextRushTarget = () => {
    if (!rushContainerRef.current) return;
    const w = rushContainerRef.current.clientWidth - 50;
    const h = rushContainerRef.current.clientHeight - 50;
    setRushTarget({
      x: Math.max(25, Math.floor(Math.random() * w)),
      y: Math.max(25, Math.floor(Math.random() * h))
    });
  };

  const startRushGame = () => {
    setRushRunning(true);
    setRushScore(0);
    setRushTimeLeft(10);
    triggerNextRushTarget();
  };

  const handleRushTargetClicked = () => {
    if (!rushRunning) return;
    setRushScore(prev => prev + 1);
    triggerNextRushTarget();
  };

  useEffect(() => {
    let timer: any;
    if (rushRunning && rushTimeLeft > 0) {
      timer = setInterval(() => {
        setRushTimeLeft(p => p - 1);
      }, 1000);
    } else if (rushRunning && rushTimeLeft === 0) {
      setRushRunning(false);
      const coinsAwarded = Math.min(40, rushScore * 2); // 2 Star Coins per hit, max 40
      const xpEarned = Math.min(25, rushScore);
      showFeedback(`⏱️ Time's Out! You clicked ${rushScore} targets. Earned +${coinsAwarded} Star Coins!`, 'success');
      onAwardCoins(coinsAwarded, xpEarned);
    }
    return () => clearInterval(timer);
  }, [rushRunning, rushTimeLeft]);

  // ==========================================
  // GAME 5: SUSTAINABILITY QUIZ CHALLENGE
  // ==========================================
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleSelectQuizOption = (idx: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);
    if (idx === ({
      q: 'How many gallons of water are typically saved by recycling just 1 cotton shirt instead of manufacturing a brand new one?',
      options: [
        'Approx 10 gallons',
        'Approx 700 gallons (Growing cotton has a massive freshwater impact!)',
        'Approx 50 gallons',
        'Approx 120 gallons'
      ],
      correctIdx: 1
    }).correctIdx) {
      setQuizScore('correct');
      showFeedback('📖 EXPERT LEVEL! +35 Star Coins added to reward profile.', 'success');
      onAwardCoins(35, 20);
      onCompleteTask('task-quiz-clean', 35, 20);
    } else {
      setQuizScore('wrong');
      showFeedback('😅 Not quite! Circular textile water reduction has a huge 700 gallon impact!', 'info');
    }
  };

  // Launch handlers
  useEffect(() => {
    if (activeGame === 'memory') {
      initMemoryGame();
    }
  }, [activeGame]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Visual Feedback Alerts */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-5 py-3 shadow-lg flex items-center gap-2 border text-sm font-sans font-semibold font-display tracking-tight ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'bg-indigo-600 border-indigo-500 text-white'
            }`}
          >
            <span>{feedbackMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Arcade Top Splash Hero */}
      <div className="bg-radial-at-t from-indigo-900/10 via-white to-white border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 max-w-md">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-mono text-xs font-bold rounded-full">
            🕹️ COMMUNITY GAME ARCADE
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Play & Earn Rewards
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-sans">
            Our mission is community support and recycling consciousness. Earn **Live Coins** playing daily clean-earth challenges and redeem them for free pins, merchandise or coupons!
          </p>
        </div>
        <div className="flex gap-4 items-center bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md animate-bounce">
            <Trophy className="text-amber-300" size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-indigo-500 uppercase">Your Store Earnings</div>
            <div className="text-xl font-display font-extrabold text-slate-800 font-mono">
              💰 {userCoins} Coins
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 1. Left controls/Games list | 2. Right Game Console Rendering Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Tasks & Challenges Index Menu */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <CheckCircle size={18} className="text-indigo-600" /> Daily Engagement Tasks
            </h3>
            <div className="space-y-3">
              {tasks.map((tk) => (
                <div
                  key={tk.id}
                  onClick={() => {
                    if (tk.id === 'task-captcha') setActiveGame('captcha');
                    if (tk.id === 'task-spin') setActiveGame('spin');
                    if (tk.id === 'task-memory-match') setActiveGame('memory');
                    if (tk.id === 'task-quiz-clean') setActiveGame('quiz');
                    if (tk.id === 'task-feed-post') setActiveGame('none'); // Instructions tell them to use Custom Lab
                  }}
                  className={`p-3.5 rounded-xl border-2 text-left transition relative cursor-pointer group flex items-start gap-3 ${
                    tk.isCompleted
                      ? 'bg-slate-50 border-slate-100 opacity-60'
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tk.isCompleted ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {tk.isCompleted ? <Check size={16} /> : getTaskIcon(tk.icon, 16)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-display font-bold leading-tight ${tk.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {tk.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                      {tk.description}
                    </p>
                    <div className="flex gap-2.5 mt-2 font-mono text-[9px] font-bold">
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">💰 +{tk.pointsReward} Coins</span>
                      <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">🔥 +{tk.xpReward} XP</span>
                    </div>
                  </div>
                  {tk.isCompleted && (
                    <span className="absolute top-2 right-2 text-xs text-indigo-500 font-bold font-mono">DONE</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Click Rush Invitation Promo */}
          <div className="bg-slate-800 text-white rounded-2xl p-5 border border-slate-700 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <span className="px-2 py-0.5 bg-rose-500 font-bold text-[9px] font-mono rounded">⚡ LIVE REFLEX</span>
            <h4 className="font-display font-bold text-sm mt-1">Reflex Tap Challenge</h4>
            <p className="text-[11px] text-slate-300 leading-snug mt-1">
              Tap random moving badges as fast as you can inside 10 seconds! Great way to build motor-engagement!
            </p>
            <button
              id="start-click-rush-launcher"
              onClick={() => setActiveGame('rush')}
              className="mt-3.5 bg-rose-500 hover:bg-rose-600 text-white font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition w-full justify-center"
            >
              <Play size={11} fill="white" /> Launch Click Rush (Earn x2 Coins)
            </button>
          </div>
        </div>

        {/* Real-Time Interactive Game Console Arena */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 min-h-[460px] relative overflow-hidden group shadow-lg">
          
          {/* CRT screen line effect overlays */}
          <div className="absolute inset-0 bg-radial-at-c from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none z-0" />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(rgba(18,24,38,0)_95%,rgba(0,0,0,0.3)_98%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

          {/* Header metadata layout */}
          <div className="absolute top-4 inset-x-6 flex justify-between items-center z-10 border-b border-slate-800 pb-3">
            <span className="font-mono text-[10px] text-emerald-400 font-semibold tracking-widest uppercase flex items-center gap-1 animate-pulse">
              ● ONLINE STAGE CORE
            </span>
            <span className="font-mono text-[9px] text-slate-400">
              V-SERVER ID: CLOTH_GAMING_3000
            </span>
          </div>

          <div className="w-full max-w-xl text-center relative z-10 py-6">
            <AnimatePresence mode="wait">
              {activeGame === 'none' && (
                <motion.div
                  key="welcome-arcade"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 bg-slate-800 border border-slate-700 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                    🎮
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-slate-100">
                    Console Ready to Play
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Select any engagement challenge on the left menu, or swipe right to load high-fidelity community simulator games. Unlocking points gives free clothing merchandise!
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-2">
                    <button
                      onClick={() => setActiveGame('spin')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold leading-tight transition hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      🎪 Lucky Spin
                    </button>
                    <button
                      onClick={() => setActiveGame('memory')}
                      className="bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold leading-tight border border-slate-700 transition hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      🧠 Card Match
                    </button>
                  </div>
                </motion.div>
              )}

              {/* GAME 1: CAPTCHA PUZZLE */}
              {activeGame === 'captcha' && (
                <motion.div
                  key="captcha-game"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-display font-extrabold text-indigo-400 flex items-center justify-center gap-1.5">
                      🛡️ Anti-Bot Human Slider Check
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Drag our carbon-neutral volunteer leaf badge directly over the dotted target frame silhouette!
                    </p>
                  </div>

                  {/* Slider visual track arena */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl h-36 relative flex items-center overflow-hidden w-full max-w-sm mx-auto shadow-inner px-6">
                    {/* Silhouette target frame on right */}
                    <div
                      className="absolute w-12 h-12 rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-500/10 flex items-center justify-center"
                      style={{ left: `${CAPTCHA_TARGET}%` }}
                    >
                      <span className="text-[10px] text-indigo-300 font-mono font-bold animate-pulse">FIT HERE</span>
                    </div>

                    {/* Draggable stamp controlled by slider percentage */}
                    <div
                      className={`absolute w-12 h-12 rounded-xl border flex items-center justify-center transition shadow-md ${
                        captchaStatus === 'solved'
                          ? 'border-emerald-500 bg-emerald-950/80'
                          : 'border-slate-600 bg-slate-800 group-hover:scale-110'
                      }`}
                      style={{ left: `${captchaSlider}%`, transform: 'translateX(-50%)' }}
                    >
                      <span className="text-2xl">{captchaStatus === 'solved' ? '🌱' : '🍁'}</span>
                    </div>
                  </div>

                  <div className="max-w-xs mx-auto space-y-4">
                    <input
                      id="captcha-drag-slider"
                      type="range"
                      min="10"
                      max="90"
                      value={captchaSlider}
                      disabled={captchaStatus === 'solved'}
                      onChange={(e) => setCaptchaSlider(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    
                    <div className="flex gap-2">
                      <button
                        id="verify-captcha-slider-btn"
                        onClick={handleVerifyCaptcha}
                        disabled={captchaStatus === 'solved'}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition active:scale-95"
                      >
                        {captchaStatus === 'solved' ? 'Verified!' : 'Submit Alignment'}
                      </button>
                      <button
                        onClick={() => {
                          setCaptchaSlider(15);
                          setCaptchaStatus('idle');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3 rounded-xl border border-slate-700 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* GAME 2: LUCKY SPIN WHEEL */}
              {activeGame === 'spin' && (
                <motion.div
                  key="spin-game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-display font-extrabold text-amber-400">
                      🎡 Sustainable Spinner
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Spin the interactive loop wheel to secure random Star Coins!
                    </p>
                  </div>

                  {/* Wheel construction with high-fidelity vector representation of user's uploaded asset */}
                  <div className="relative w-64 h-64 md:w-72 md:h-72 mx-auto flex items-center justify-center my-6">

                    {/* Outer Wheel Vector Representation */}
                    <svg 
                      viewBox="0 0 220 220" 
                      className="w-full h-full select-none overflow-visible filter drop-shadow-2xl"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Red gradient for rich wood-crimson 3D wedges */}
                        <radialGradient id="redWedge" cx="110" cy="110" r="100" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#FB2D3F" />
                          <stop offset="60%" stopColor="#BE101E" />
                          <stop offset="100%" stopColor="#78050D" />
                        </radialGradient>

                        {/* Cream gradient for glowing, warm gold-cream 3D wedges */}
                        <radialGradient id="creamWedge" cx="110" cy="110" r="100" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#FFFDF5" />
                          <stop offset="50%" stopColor="#FBEFA9" />
                          <stop offset="85%" stopColor="#F5D05B" />
                          <stop offset="100%" stopColor="#C8A538" />
                        </radialGradient>

                        {/* Metallic border gold gradient for 3D rims */}
                        <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFF9D9" />
                          <stop offset="30%" stopColor="#F5C022" />
                          <stop offset="70%" stopColor="#C2800C" />
                          <stop offset="100%" stopColor="#6E3B06" />
                        </linearGradient>

                        {/* Gold shadow filter for elevated objects */}
                        <filter id="hubShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#221100" floodOpacity="0.45" />
                        </filter>
                      </defs>

                      {/* Outer Rim Shadow Base */}
                      <circle cx="110" cy="110" r="108" fill="#1C0204" opacity="0.3" filter="url(#hubShadow)" />

                      {/* Outline Rim 1: Gold Edge & Crimson Main Border */}
                      <circle cx="110" cy="110" r="106" fill="#880811" stroke="url(#goldRim)" strokeWidth="1.8" />
                      <circle cx="110" cy="110" r="103" fill="#AB101E" stroke="#5F0407" strokeWidth="0.8" />

                      {/* Rotating Symmetrical Slices container group */}
                      <g 
                        style={{
                          transformOrigin: '110px 110px',
                          transform: `rotate(${spinAngle}deg)`,
                          transition: isRotating ? 'transform 3.0s cubic-bezier(0.15, 0.85, 0.15, 1)' : 'none'
                        }}
                      >
                        {WHEEL_SECTORS.map((sector, idx) => {
                          const angle1 = idx * 22.5 - 11.25;
                          const angle2 = idx * 22.5 + 11.25;
                          const d = describeSector(110, 110, 96, angle1, angle2);
                          
                          const textColor = sector.isRed ? '#FFEAA6' : '#041728';
                          const textShadow = sector.isRed ? '#6E050D' : 'none';
                          const textAngle = idx * 22.5;
                          
                          return (
                            <g key={idx}>
                              {/* Sector Slice Path */}
                              <path 
                                d={d} 
                                fill={sector.isRed ? 'url(#redWedge)' : 'url(#creamWedge)'} 
                                stroke={sector.isRed ? '#8F0811' : '#D0BA67'} 
                                strokeWidth="0.65"
                              />

                              {/* Sector Label Placement */}
                              <g transform={`rotate(${textAngle}, 110, 110) translate(110, 39) rotate(90)`}>
                                <text
                                  x="0"
                                  y="0"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill={textColor}
                                  className="font-display font-black tracking-tight"
                                  style={{
                                    fontSize: sector.value === 'TRY AGAIN' ? '5.4px' : '9px',
                                    filter: sector.isRed ? `drop-shadow(0px 1.2px 1px ${textShadow})` : 'none',
                                    fontFamily: '"Space Grotesk", "Outfit", "Inter", sans-serif'
                                  }}
                                >
                                  {sector.label}
                                </text>
                              </g>
                            </g>
                          );
                        })}

                        {/* Concentric internal thin boundary gold separator */}
                        <circle cx="110" cy="110" r="96" fill="none" stroke="url(#goldRim)" strokeWidth="1.2" />

                        {/* Secondary inner decorative loop ring */}
                        <circle cx="110" cy="110" r="30" fill="none" stroke="url(#goldRim)" strokeWidth="0.5" opacity="0.45" />
                      </g>

                      {/* STATIONARY DECORATIVE FOREGROUND (Pointer, Hub pin - Do not rotate) */}

                      {/* Golden Central Center Dome Hub Card */}
                      <circle cx="110" cy="110" r="15" fill="#1A0A00" opacity="0.25" filter="url(#hubShadow)" />
                      <circle cx="110" cy="110" r="13" fill="url(#goldRim)" stroke="#6E3B06" strokeWidth="0.6" />
                      <circle cx="110" cy="110" r="11" fill="url(#creamWedge)" stroke="none" opacity="0.3" />
                      <circle cx="110" cy="110" r="7" fill="url(#goldRim)" stroke="#522C04" strokeWidth="0.4" />

                      {/* Glossy translucent lighting layer overlay */}
                      <path d="M 14 110 A 96 96 0 0 1 206 110 A 96 98 0 0 0 14 110 Z" fill="#FFFFFF" opacity="0.05" pointerEvents="none" />

                      {/* Stationery mechanical pointer needle pointer at top (12 o'clock) */}
                      <g filter="url(#hubShadow)">
                        {/* Shadow Border Shape */}
                        <path 
                          d="M 103 1 C 103 0, 117 0, 117 1 L 115 17 L 110 24 L 105 17 Z" 
                          fill="url(#goldRim)" 
                          stroke="#4F2700" 
                          strokeWidth="1" 
                        />
                        {/* Golden core plate */}
                        <path 
                          d="M 105 2 L 105 15 L 110 21 L 115 15 L 115 2" 
                          fill="none" 
                          stroke="#FFFDD4" 
                          strokeWidth="0.75" 
                          opacity="0.7" 
                        />
                        <circle cx="110" cy="7" r="1.8" fill="#F43F5E" />
                      </g>
                    </svg>

                  </div>

                  <div>
                    <button
                      id="spin-wheel-interactive-btn"
                      onClick={handleSpinClick}
                      disabled={isRotating}
                      className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-display font-extrabold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer active:scale-95 shadow-md flex items-center gap-1.5 mx-auto"
                    >
                      <RefreshCw size={14} className={isRotating ? 'animate-spin' : ''} />
                      {isRotating ? 'STAY CONCENTRATED...' : 'SPIN WHEEL NOW'}
                    </button>
                    <p className="text-[10px] text-slate-500 font-mono mt-2">Spent {spinCount} spins today.</p>
                  </div>
                </motion.div>
              )}

              {/* GAME 3: CARD MATCH GAME */}
              {activeGame === 'memory' && (
                <motion.div
                  key="memory-game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center max-w-sm mx-auto">
                    <h3 className="text-base font-display font-bold text-sky-400">
                      🧠 Matching Card Pairs
                    </h3>
                    <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                      Moves: {memoryMoves}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                    {shuffledCards.map((card, idx) => {
                      const isFlipped = flippedIndices.includes(idx) || matchedIndices.includes(idx);
                      const isMatched = matchedIndices.includes(idx);

                      return (
                        <button
                          key={idx}
                          id={`memory-card-${idx}`}
                          onClick={() => handleCardClick(idx)}
                          className={`h-20 rounded-xl flex items-center justify-center text-3xl font-sans border-2 relative select-none transition-all duration-300 transform active:scale-90 cursor-pointer ${
                            isFlipped
                              ? isMatched
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-100 scale-95'
                                : 'bg-slate-800 border-indigo-500 rotate-y-180'
                              : 'bg-slate-950 hover:bg-slate-900 border-slate-700 text-slate-600'
                          }`}
                        >
                          {isFlipped ? (
                            <span>{card}</span>
                          ) : (
                            <span className="text-lg font-mono text-indigo-500 font-bold">🛒</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={initMemoryGame}
                    className="text-xs font-mono text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw size={11} /> Reset Board / Shuffle Pairs
                  </button>
                </motion.div>
              )}

              {/* GAME 4: CLICK RUSH GAME */}
              {activeGame === 'rush' && (
                <motion.div
                  key="rush-game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 w-full"
                >
                  <div className="flex justify-between items-center max-w-md mx-auto">
                    <div>
                      <h3 className="text-sm font-display font-bold text-rose-400">Tap Reflex Target Challenge</h3>
                      <p className="text-[10px] text-slate-500">Fast motor-reflex clicking engagement</p>
                    </div>
                    <div className="font-mono text-xs flex gap-2 font-bold bg-slate-800 px-3 py-1 rounded">
                      <span className="text-red-400">⏱️ {rushTimeLeft}s</span>
                      <span className="text-yellow-400">🎯 Hits: {rushScore}</span>
                    </div>
                  </div>

                  {/* Play Board Stage boundaries */}
                  <div
                    ref={rushContainerRef}
                    className="w-full max-w-md h-52 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden mx-auto shadow-inner"
                  >
                    {!rushRunning ? (
                      <div className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-xs select-none">
                        <button
                          id="btn-trigger-click-rush"
                          onClick={startRushGame}
                          className="bg-rose-500 hover:bg-rose-600 text-xs font-bold py-2 px-5 rounded-xl border border-rose-400 shadow cursor-pointer transition transform hover:scale-105 active:scale-95"
                        >
                          Click Here to Start Click Rush
                        </button>
                        <p className="text-[10px] text-slate-500 mt-2">Runs exactly 10s. Earns +2 coins per hit!</p>
                      </div>
                    ) : (
                      <button
                        id="rush-clicking-target"
                        onClick={handleRushTargetClicked}
                        className="absolute w-8 h-8 rounded-full border-2 border-yellow-400 bg-yellow-500/20 hover:scale-110 flex items-center justify-center cursor-pointer transition duration-75 text-amber-300 outline-hidden transform animate-ping"
                        style={{ left: `${rushTarget.x}px`, top: `${rushTarget.y}px` }}
                      >
                        <Circle size={10} fill="#facc15" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* GAME 5: SUSTAINABILITY QUIZ */}
              {activeGame === 'quiz' && (
                <motion.div
                  key="quiz-game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5 max-w-md mx-auto"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-sky-950 text-sky-400 font-mono text-[9px] uppercase font-bold rounded">
                      Trivia Challenge
                    </span>
                    <h3 className="text-sm md:text-base font-display font-semibold text-slate-100 leading-snug">
                      {({
                        q: 'How many gallons of water are typically saved by recycling just 1 cotton shirt instead of manufacturing a brand new one?',
                        options: [
                          'Approx 10 gallons',
                          'Approx 700 gallons (Growing cotton has a massive freshwater impact!)',
                          'Approx 50 gallons',
                          'Approx 120 gallons'
                        ],
                        correctIdx: 1
                      }).q}
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-left">
                    {({
                      q: 'How many gallons of water are typically saved by recycling just 1 cotton shirt instead of manufacturing a brand new one?',
                      options: [
                        'Approx 10 gallons',
                        'Approx 700 gallons (Growing cotton has a massive freshwater impact!)',
                        'Approx 50 gallons',
                        'Approx 120 gallons'
                      ],
                      correctIdx: 1
                    }).options.map((opt, oIdx) => {
                      let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/80';
                      
                      if (quizAnswered !== null) {
                        if (oIdx === ({
                          q: 'How many gallons of water are typically saved by recycling just 1 cotton shirt instead of manufacturing a brand new one?',
                          options: [
                            'Approx 10 gallons',
                            'Approx 700 gallons (Growing cotton has a massive freshwater impact!)',
                            'Approx 50 gallons',
                            'Approx 120 gallons'
                          ],
                          correctIdx: 1
                        }).correctIdx) {
                          btnStyle = 'border-emerald-500/70 bg-emerald-950/40 text-emerald-100 font-bold';
                        } else if (oIdx === quizAnswered) {
                          btnStyle = 'border-rose-500/70 bg-rose-950/40 text-rose-100';
                        } else {
                          btnStyle = 'border-slate-800 opacity-40 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          id={`quiz-opt-${oIdx}`}
                          onClick={() => handleSelectQuizOption(oIdx)}
                          className={`w-full p-3.5 border-2 rounded-xl text-xs transition cursor-pointer text-left font-sans flex items-center gap-3 ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-500">[{String.fromCharCode(65 + oIdx)}]</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered !== null && (
                    <button
                      onClick={() => {
                        setQuizAnswered(null);
                        setQuizScore('idle');
                      }}
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      Reset and Try Another Challenge
                    </button>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Bottom Game Console back-to-menu navigation controls */}
          {activeGame !== 'none' && (
            <button
              onClick={() => {
                setActiveGame('none');
                setCaptchaStatus('idle');
                setRushRunning(false);
              }}
              className="absolute bottom-4 left-6 text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
            >
              ← CLOSE GAME / RETURN TERMINAL MENU
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

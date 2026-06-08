/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Award, Gift, Clock, User, ChevronRight, PlayCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserScore: number;
  onRewardCoins: (coins: number) => void;
}

export default function Leaderboard({ entries, currentUserScore, onRewardCoins }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [videoState, setVideoState] = useState<'idle' | 'playing' | 'watched'>('idle');
  const [videoTimer, setVideoTimer] = useState(15); // Let's make it 15 seconds for snappiness

  // Sort score matches
  const getSortedEntries = () => {
    let multiplier = 1;
    if (activeTab === 'weekly') multiplier = 0.45;
    if (activeTab === 'monthly') multiplier = 0.75;

    // Map through standard entries and inject user item
    const customEntries = [
      ...entries.map(e => ({ ...e, score: Math.floor(e.score * multiplier) })),
      {
        id: 'l-curr-user',
        rank: 0, // Calculated below
        name: 'Kaushik Creates (You)',
        avatar: '👋',
        level: 5,
        score: currentUserScore,
        isCurrentUser: true
      }
    ];

    // Sort descending
    return customEntries
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
  };

  const visibleEntries = getSortedEntries();

  // Watch video simulations ticker
  useEffect(() => {
    let interval: any;
    if (videoState === 'playing' && videoTimer > 0) {
      interval = setInterval(() => {
        setVideoTimer(t => t - 1);
      }, 1000);
    } else if (videoState === 'playing' && videoTimer === 0) {
      setVideoState('watched');
      onRewardCoins(25); // Gives +25 star coins!
    }
    return () => clearInterval(interval);
  }, [videoState, videoTimer]);

  const startVideo = () => {
    setVideoState('playing');
    setVideoTimer(15);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* 1. Header Leaderboards Jumbotron */}
      <div className="text-center space-y-3 select-none">
        <h2 className="text-2xl md:text-3xl font-display font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          🏆 Ranks & Leaderboards
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-sans">
          Compete on sustainability tasks, mini-games, and custom printing concepts with other community creators to unlock exclusive physical catalog rewards.
        </p>
      </div>

      {/* 2. Ranks Timeline Filter Tabs */}
      <div className="flex justify-center gap-1.5 md:gap-3 font-display">
        {[
          { id: 'all', label: 'All Time' },
          { id: 'weekly', label: 'Weekly Drop' },
          { id: 'monthly', label: 'Monthly Drop' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`leaderboard-filter-btn-${tab.id}`}
            onClick={() => setActiveTab(tab.id as 'all' | 'weekly' | 'monthly')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Main Leaderboard Rows rendering card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5 max-w-xl mx-auto">
        <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400 px-3 pb-2 border-b border-slate-100">
          <span>CREATOR IDENTIFICATION</span>
          <span>SCORE / LIVE COINS</span>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {visibleEntries.map((e) => {
              let medalIcon = '';
              let rowStyle = 'border-slate-100 bg-white';
              
              if (e.rank === 1) { medalIcon = '🥇'; rowStyle = 'bg-amber-500/5 border-amber-201 text-amber-950 font-bold'; }
              if (e.rank === 2) { medalIcon = '🥈'; rowStyle = 'bg-slate-100 border-slate-201 text-slate-900'; }
              if (e.rank === 3) { medalIcon = '🥉'; rowStyle = 'bg-orange-100/50 border-orange-201 text-orange-950'; }
              if (e.isCurrentUser) { rowStyle = 'bg-indigo-600/5 border-indigo-200 ring-2 ring-indigo-50/50 text-indigo-950'; }

              return (
                <motion.div
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 border rounded-2xl flex items-center justify-between text-xs transition ${rowStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 w-6 text-center">
                      {medalIcon ? medalIcon : '#' + e.rank}
                    </span>
                    <span className="text-xl">{e.avatar}</span>
                    <div>
                      <p className="font-display font-semibold text-slate-800 flex items-center gap-1.5">
                        {e.name}
                        {e.isCurrentUser && (
                          <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-mono rounded">YOU</span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">Level {e.level} • Professional Builder</p>
                    </div>
                  </div>

                  <span className="font-mono font-extrabold text-slate-850">
                    💰 {e.score} <span className="text-[9px] text-slate-400 font-medium">Stars</span>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Instructions "How Leaderboards Work" accordion */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 max-w-xl mx-auto space-y-3 text-amber-900 select-none">
        <h4 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
          <Clock size={16} /> How Leaderboards Work
        </h4>
        <ul className="text-xs space-y-2 leading-relaxed text-amber-800 list-disc list-inside">
          <li><b>Earn Points</b>: Complete daily tasks, mini challenges, and publish customized wearable drafts in the community thread to accumulate point balances.</li>
          <li><b>Drop resets</b>: Rankings rest weekly and monthly. Leaderboard performers secure high-frequency physical catalog vouchers and custom branding accessories.</li>
          <li><b>Level Progression</b>: Higher Star levels grant higher profile badge tiers and lower custom print lab garment processing costs!</li>
        </ul>
      </div>

      {/* 5. WATCH & EARN VIDEO PANEL (Exact match to screenshot UI requirement) */}
      <div id="video-task-panel" className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 max-w-xl mx-auto relative overflow-hidden group shadow-lg">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            <h4 className="font-display font-bold text-sm tracking-tight text-slate-100">Watch & Earn Star Coins</h4>
          </div>
          <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-mono font-bold rounded-full">
            🎁 +25 Coins
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl h-52 flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
          <AnimatePresence mode="wait">
            {videoState === 'idle' && (
              <motion.div
                key="video-idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-3"
              >
                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-500 mx-auto select-none mt-2">
                  <PlayCircle size={24} className="animate-pulse" />
                </div>
                <p className="text-xs text-slate-400 font-sans max-w-xs leading-normal">
                  Watch this 15-second simulation campaign video drop-off review to earn additional rewards!
                </p>
                <button
                  id="trigger-video-play-btn"
                  onClick={startVideo}
                  className="bg-rose-500 hover:bg-rose-600 font-mono text-[10px] font-extrabold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Start Simulated Video
                </button>
              </motion.div>
            )}

            {videoState === 'playing' && (
              <motion.div
                key="video-playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-2.5"
              >
                <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">
                  Reviewing Chicago Winter Outfitter details...
                </p>
                <div className="text-sm font-mono font-bold text-yellow-400">
                  {videoTimer}s Remaining
                </div>
                <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${((15 - videoTimer) / 15) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}

            {videoState === 'watched' && (
              <motion.div
                key="video-watched"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-3.5"
              >
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✔️
                </div>
                <div>
                  <p className="text-xs text-slate-200 mt-1 font-bold">Simulated Video Complete!</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">+25 Star Coins added to user ledger</p>
                </div>
                <button
                  onClick={() => setVideoState('idle')}
                  className="text-[10px] font-semibold text-indigo-400 hover:underline cursor-pointer"
                >
                  Watch Again in next campaign cycle
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}

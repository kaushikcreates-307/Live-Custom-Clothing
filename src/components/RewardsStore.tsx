/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { REWARDS_PRODUCTS } from '../data/products';
import { Coins, Sparkles, HelpCircle, Check, Award, Compass, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RewardsStoreProps {
  products?: Product[];
  currentCoins: number;
  onSpendCoins: (amount: number, rewardName: string) => void;
  unlockedRewards: string[]; // List of product IDs they already redeemed
}

export default function RewardsStore({ products = REWARDS_PRODUCTS, currentCoins, onSpendCoins, unlockedRewards }: RewardsStoreProps) {
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const handleRedeem = (p: Product) => {
    const cost = p.pointsPrice || 100;
    
    if (unlockedRewards.includes(p.id)) {
      setErrorFeedback(`💡 You have already unlocked "${p.name}". Ready in your reward dashboard!`);
      setTimeout(() => setErrorFeedback(null), 3000);
      return;
    }

    if (currentCoins < cost) {
      setErrorFeedback(`⚠️ Insufficient funds! "${p.name}" costs ${cost} Star Coins. Play mini-games in the arcade stage to earn more!`);
      setTimeout(() => setErrorFeedback(null), 3000);
      return;
    }

    onSpendCoins(cost, p.name);
    setPurchaseFeedback(`🎉 AWESOME! Redeemed "${p.name}" successfully for ${cost} Coins!`);
    setTimeout(() => setPurchaseFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      
      {/* Alert Feedbacks overlay */}
      <AnimatePresence>
        {purchaseFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-3.5 shadow-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-sans font-bold flex items-center gap-2 max-w-md text-sm border border-emerald-400"
          >
            <Sparkles size={18} className="animate-spin" />
            <span>{purchaseFeedback}</span>
          </motion.div>
        )}

        {errorFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-3.5 shadow-xl bg-slate-900 border border-slate-800 text-white font-sans font-bold flex items-center gap-2 max-w-md text-sm"
          >
            <HelpCircle size={18} className="text-amber-400" />
            <span>{errorFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards Jumbotron Overview */}
      <div className="bg-radial-at-t from-emerald-900/10 via-white to-white border border-emerald-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 max-w-md">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-850 font-mono text-xs font-bold rounded-full">
            🎁 KIDS REWARDS ECOSTORE
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Exchange Star Coins
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            No real credit card required! Spend your earned mini-game Star balances on digital coupons, community Hero profile badges, and sticker drop-offs.
          </p>
        </div>

        <div className="flex gap-4 items-center bg-emerald-50 border border-emerald-100/55 p-3.5 rounded-2xl shrink-0 select-none">
          <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md animate-bounce">
            <Coins size={22} className="text-amber-200" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Available Balance</div>
            <div className="text-lg font-display font-black text-slate-800 font-mono">
              💰 {currentCoins} Star Coins
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const cost = p.pointsPrice || 100;
          const isRedeemed = unlockedRewards.includes(p.id);

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 relative select-none ${
                isRedeemed ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200/80 hover:border-slate-350'
              }`}
            >
              {isRedeemed && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-mono font-bold rounded-full flex items-center gap-0.5">
                  <Check size={9} /> REDEEMED
                </span>
              )}

              <div className="space-y-4">
                {/* Visual Header card photo/emoji */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center overflow-hidden text-3xl select-none relative shrink-0">
                  {p.imageUrl && p.imageUrl.startsWith('http') ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{p.imageUrl || '🎁'}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-slate-800 text-sm tracking-tight leading-tight">
                    {p.name}
                  </h4>
                  <p className="text-slate-400 text-[10px] uppercase font-mono tracking-widest">{p.category}</p>
                  <p className="text-xs text-slate-500 leading-normal font-sans mt-1.5 pt-0.5 border-t border-slate-50">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Spend action panel button */}
              <div className="border-t border-slate-100 pt-4 mt-5 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 font-bold block uppercase tracking-wider">REPORTS VALUE</span>
                  <span className="font-mono text-base font-extrabold text-emerald-700">
                    💰 {cost} Stars
                  </span>
                </div>

                <button
                  id={`redeem-btn-${p.id}`}
                  onClick={() => handleRedeem(p)}
                  disabled={isRedeemed}
                  className={`px-3.5 py-2 font-display text-[11px] font-bold rounded-xl shadow cursor-pointer transition flex items-center gap-1.5 transform active:scale-95 ${
                    isRedeemed
                      ? 'bg-slate-100 text-slate-400 border border-slate-200/50 shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isRedeemed ? (
                    <>
                      <Check size={12} />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Award size={12} />
                      <span>Spend Coins</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rewards support info */}
      <div className="bg-slate-50 border border-slate-200/55 rounded-2xl p-5 flex gap-4 max-w-2xl mx-auto items-start select-none">
        <div className="text-3xl">🎫</div>
        <div className="text-xs leading-normal text-slate-600 font-sans">
          <p className="font-bold text-slate-800">Coupon Code Notice</p>
          <p className="text-slate-500 mt-0.5">Redeeming digital custom print discounts grants a code which is instantly applied to your shopping cart transactions as free virtual dollar reductions. Keep building, crafting, and helping outreach shelters!</p>
        </div>
      </div>

    </div>
  );
}

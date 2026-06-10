/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DonationStats, ImpactCampaign } from '../types';
import { HERO_CAMPAIGNS } from '../data/products';
import { Gift, ShieldCheck, Heart, Sparkles, MapPin, Compass, Users, CheckCircle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImpactTrackerProps {
  stats: DonationStats;
  campaigns: ImpactCampaign[];
}

export default function ImpactTracker({ stats, campaigns }: ImpactTrackerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeCampaign = campaigns[selectedIndex] || HERO_CAMPAIGNS[0];

  // Draw local Map points
  const points = [
    { name: 'Chicago Englewood Hub', x: 230, y: 155, id: 'camp-chicago' },
    { name: 'Atlanta Uniform Alliance', x: 250, y: 260, id: 'camp-atlanta' },
    { name: 'Detroit Youth Athletics', x: 255, y: 135, id: 'camp-detroit' }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* 1. Main visual analytics metrics counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items Donated', value: stats.totalDonated.toLocaleString() + ' 👚', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', subtitle: 'Matched in real-time orders' },
          { label: 'Families Supported', value: stats.familiesSupported.toLocaleString() + ' 🏡', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', subtitle: 'Targeted support efforts' },
          { label: 'Active Outreach Spots', value: stats.activeCampaigns.toLocaleString() + ' 📍', color: 'text-rose-600 bg-rose-50 border-rose-100', subtitle: 'Multi-state partnerships' },
          { label: 'Community Live Coins', value: stats.pointsDistributed.toLocaleString() + ' 💰', color: 'text-amber-700 bg-amber-50 border-amber-100', subtitle: 'Distributed community rewards' }
        ].map((met, i) => (
          <div key={i} className={`p-4 border rounded-2xl flex flex-col justify-between h-32 ${met.color}`}>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-500">{met.label}</span>
            <div>
              <p className="text-2xl font-display font-extrabold tracking-tight mt-1">{met.value}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-mono font-medium">{met.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Interactive Impact Map & Campaign Spotlight Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Vector Map Visualizer */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-lg flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Compass size={18} className="text-indigo-600 animate-spin-slow" /> Interactive Donation Map
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Hover or click the highlighted pins to learn about specific local print campaigns, partnering sheltering structures, and drop counts.
            </p>
          </div>

          {/* Styled US Map Vector Representation */}
          <div className="w-full my-6 flex justify-center items-center py-6 h-64 bg-slate-50 rounded-xl border border-slate-100 shadow-inner relative overflow-hidden">
            {/* Ambient map background grid */}
            <div className="absolute inset-0 opacity-[0.05] bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-indigo-500 via-indigo-900 to-indigo-500 pointer-events-none" />
            
            <svg viewBox="0 0 450 300" className="w-full h-full max-h-[220px] select-none opacity-80" id="us-outline-map">
              {/* Soft styled boundaries representing US region outline */}
              <path
                d="M 60,60 C 80,40 120,40 140,55 C 160,30 200,30 220,50 C 240,40 280,45 300,30 C 330,30 350,20 380,40 C 390,50 410,50 410,70 C 410,95 440,110 420,130 C 400,150 410,180 390,200 C 370,220 360,240 330,250 C 310,260 290,270 270,255 C 250,270 230,290 200,280 C 180,270 160,255 140,260 C 120,250 100,250 80,240 C 60,230 40,210 50,180 C 30,170 10,140 20,120 C 10,105 20,80 50,80 Z"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Grid lines to make it feel techy and kid-friendly */}
              <line x1="150" y1="0" x2="150" y2="300" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="300" y1="0" x2="300" y2="300" stroke="#e2e8f0" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="450" y2="150" stroke="#e2e8f0" strokeDasharray="4 4" />

              {/* Pin Points of Impact */}
              {points.map((pt, index) => {
                const isActive = activeCampaign.id === pt.id;
                return (
                  <g 
                    key={pt.id} 
                    className="cursor-pointer group"
                    onClick={() => {
                      const foundIdx = campaigns.findIndex(c => c.id === pt.id);
                      if (foundIdx !== -1) setSelectedIndex(foundIdx);
                    }}
                  >
                    {/* Ring highlight animation */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? 14 : 7}
                      className="fill-indigo-500/20 stroke-indigo-500/30 animate-ping"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={6}
                      className={`${
                        isActive ? 'fill-indigo-600 stroke-white stroke-2 shadow-lg' : 'fill-slate-400 group-hover:fill-indigo-500 transition'
                      }`}
                    />
                    <foreignObject x={pt.x + 8} y={pt.y - 10} width="120" height="30">
                      <div className={`text-[9px] font-mono font-bold leading-tight select-none transition ${isActive ? 'text-indigo-600 bg-white border border-slate-100 rounded shadow px-1.5 py-0.5' : 'text-slate-400 hover:text-slate-600'}`}>
                        {pt.name.split(' ')[0]}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Compass or map elements */}
              <text x="20" y="280" fontStyle="italic" className="fill-slate-350 text-[10px] font-mono">NORTH AMERICA REGION</text>
            </svg>
          </div>

          {/* Quick instructions block */}
          <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl text-amber-800 text-[11px] leading-relaxed flex items-start gap-2 max-w-lg">
            <span className="text-sm">💡</span>
            <p>Every time a customer simulates a shopping purchase, our system adds +1 clothing item to the total donated balance. Watch the stats react live!</p>
          </div>
        </div>

        {/* Right Column: Campaign SpotLight Drawer Details */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm justify-between">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-indigo-50">
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 font-mono">
                🎨 ACT ACTIVE SPOTLIGHT
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Drop #{selectedIndex + 1}</span>
            </div>

            {activeCampaign.imageUrl && activeCampaign.imageUrl.startsWith('http') && (
              <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-100 shadow-sm relative shrink-0">
                <img
                  src={activeCampaign.imageUrl}
                  alt={activeCampaign.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}

            {/* Title Location drop */}
            <div className="space-y-1">
              <h4 className="text-lg font-display font-extrabold text-slate-800 tracking-tight leading-snug">
                {activeCampaign.title}
              </h4>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1 font-sans">
                <span className="flex items-center gap-0.5 font-mono font-semibold text-rose-500">
                  <MapPin size={12} className="shrink-0" /> {activeCampaign.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 font-mono text-slate-400">
                  <Calendar size={12} className="shrink-0" /> {activeCampaign.date}
                </span>
              </div>
            </div>

            {/* Details Description */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50 text-xs text-slate-600 leading-relaxed font-sans">
              <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1"><Users size={12} className="text-emerald-600" /> Outreach Objective</p>
              <p>{activeCampaign.description}</p>
            </div>

            {/* Specific items drop results */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="border border-slate-100 rounded-xl p-3 text-center bg-radial-at-t from-indigo-50/20">
                <span className="text-xl">👕</span>
                <p className="font-mono text-base font-extrabold text-slate-800 mt-0.5">
                  {activeCampaign.itemsDonated} units
                </p>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Donated Gift count</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-3 text-center bg-radial-at-t from-emerald-50/20">
                <span className="text-xl">🤝</span>
                <p className="font-sans text-xs font-semibold text-slate-800 mt-0.5">
                  GOTS Certified
                </p>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Material Rating</p>
              </div>
            </div>

            {/* Campaign Partners logos bubble lists */}
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Outreach Partners</p>
              <div className="flex flex-wrap gap-1.5">
                {activeCampaign.partners.map((partner, key) => (
                  <span
                    key={key}
                    className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-sans"
                  >
                    🤝 {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Slider Pagination indicator dots */}
          <div className="flex gap-2.5 items-center justify-center pt-6 mt-4 border-t border-slate-100">
            {campaigns.map((opt, slideIdx) => (
              <button
                key={opt.id}
                id={`campaign-pagination-dot-${slideIdx}`}
                onClick={() => setSelectedIndex(slideIdx)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  selectedIndex === slideIdx ? 'bg-indigo-600 w-6' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

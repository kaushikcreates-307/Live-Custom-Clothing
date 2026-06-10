import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, ArrowUpRight, HelpCircle, Eye } from 'lucide-react';

export interface AdItem {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  ctaText: string;
  emoji: string;
  category: string;
  badge: string;
  rewardCoins: number;
}

export const ADS_DATA: AdItem[] = [
  {
    id: 'eco-ad-1',
    sponsor: 'ThreadCycle',
    title: 'Don\'t Bin Your Old Blank Tees!',
    description: 'Ship us any worn shirt and get a 50 Star Coins voucher. We spin cotton back into premium custom yarn.',
    ctaText: 'Start Upcycling',
    emoji: '👕',
    category: 'Circular Eco',
    badge: 'Recycle & Earn',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-2',
    sponsor: 'PlantDye Co.',
    title: 'Botanical Plant-Based Screen Inks',
    description: 'Ditch toxic plastic plastisols! Print custom styles with GOTS certified pigments made from avocados & indigo leaves.',
    ctaText: 'Browse Organic Colors',
    emoji: '🥑',
    category: 'Zero Plastics',
    badge: 'GOTS Approved',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-3',
    sponsor: 'SolarDenim Labs',
    title: 'Sun-Bleached Upcycled Denim',
    description: 'Bleached entirely under clean natural solar rays. Every jacket has a unique wash pattern avoiding harsh chlorine waste.',
    ctaText: 'Explore Solar Styles',
    emoji: '☀️',
    category: 'Solar Power',
    badge: 'Zero Chemicals',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-4',
    sponsor: 'BioWeave Textiles',
    title: 'Pristine Peruvian Organic Blanks',
    description: 'Ancestral flood-harvested white blanks. Incredible durability with zero pesticides or petroleum-based stretching.',
    ctaText: 'Browse Fine Blanks',
    emoji: '🌱',
    category: 'Pure Material',
    badge: '100% Organic',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-5',
    sponsor: 'OneTreeExchange',
    title: 'Trade Star Coins for Real Mangroves!',
    description: 'Support global climate restoration. Spend 300 of your Star Coins to plant a real tree in certified coastal wetlands.',
    ctaText: 'Plant Real Tree',
    emoji: '🌳',
    category: 'Estuary Restore',
    badge: 'Real-Life Impact',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-6',
    sponsor: 'HydroRain Wash',
    title: 'Purified Rainwater Textile Wash',
    description: 'Saving precious municipal resources! All regional custom outreach clothes get pre-washed with 100% captured rainwater.',
    ctaText: 'See Water Ledger',
    emoji: '🌧️',
    category: 'Water Save',
    badge: '99% Off-Grid',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-7',
    sponsor: 'Heirloom Repairs',
    title: 'Lifetime Patch Thread Kits',
    description: 'Extend the lifespan of your custom hoodies. Request a free GOTS patch kit containing high-tensile organic thread.',
    ctaText: 'Claim Repair Kit',
    emoji: '🪡',
    category: 'Anti-Waste',
    badge: 'Wear It Forever',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-8',
    sponsor: 'Biopedal Courier',
    title: 'Last-Mile Bicycle Dispatching',
    description: 'No diesel smog in community neighborhoods! Local custom outreach shipments are couriered strictly by electric cargo trikes.',
    ctaText: 'View Green Zones',
    emoji: '🚲',
    category: 'Green Delivery',
    badge: 'Zero Emission',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-9',
    sponsor: 'SproutBags',
    title: 'Wildflower Seed Packaging Rollout',
    description: 'Your delivery packaging sprouts wildflowers! Simply shred, soak, plant, and watch chamomile and poppies grow.',
    ctaText: 'Learn Growing Steps',
    emoji: '🌸',
    category: 'Zero Trash',
    badge: '100% Compostable',
    rewardCoins: 5,
  },
  {
    id: 'eco-ad-10',
    sponsor: 'Circular Apparel Alliance',
    title: 'Join the Sustainable Creators Union',
    description: 'Connect with over 50,000 conscious fashion designers, exchange upcycled stencils, and host workshop dropups.',
    ctaText: 'Apply to Union',
    emoji: '🤝',
    category: 'Advocacy',
    badge: 'Global Network',
    rewardCoins: 5,
  },
];

interface AdBlockProps {
  pageId: 'shop' | 'custom-lab' | 'feed' | 'arcade' | 'impact' | 'rewards' | 'cart' | 'ranks' | 'admin' | 'all';
  onEarnCoins?: (amount: number, xp: number) => void;
  inline?: boolean;
}

export default function AdBlock({ pageId, onEarnCoins, inline = false }: AdBlockProps) {
  const [clickedAds, setClickedAds] = useState<Record<string, boolean>>({});
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [viewAll, setViewAll] = useState(false);

  // Determine which ads to show
  let adsToShow: AdItem[] = [];
  const currentViewId = viewAll ? 'all' : pageId;

  if (currentViewId === 'all') {
    adsToShow = ADS_DATA;
  } else {
    // Show page-specific targeted ad first, and a secondary one
    const primaryIndex = {
      'shop': 0,
      'custom-lab': 1,
      'feed': 2,
      'arcade': 3,
      'ranks': 4,
      'impact': 5,
      'rewards': 6,
      'admin': 7,
      'cart': 8,
      'all': 0
    }[pageId] ?? 9;

    const primaryAd = ADS_DATA[primaryIndex];
    const secondaryAd = ADS_DATA[(primaryIndex + 1) % ADS_DATA.length];
    adsToShow = [primaryAd, secondaryAd];
  }

  const handleCtaClick = (ad: AdItem) => {
    if (clickedAds[ad.id]) {
      // Already clicked, show double-notice
      setShowNotification(`You already supported ${ad.sponsor} and grabbed your coins!`);
      setTimeout(() => setShowNotification(null), 3000);
      return;
    }

    setClickedAds(prev => ({ ...prev, [ad.id]: true }));
    setShowNotification(`Eco Bonus! Got +${ad.rewardCoins} Star Coins for supporting ${ad.sponsor}.`);
    
    // Auto-timeout notifier
    setTimeout(() => setShowNotification(null), 3500);

    // Call state callback to award user
    if (onEarnCoins) {
      onEarnCoins(ad.rewardCoins, 2); // 2 XP
    }
  };

  return (
    <div className={`w-full ${inline ? 'my-3' : 'my-8'} space-y-4 select-none`}>
      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm font-sans"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-450 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="animate-spin text-emerald-400" />
            </div>
            <div className="text-left text-xs">
              <p className="font-extrabold text-slate-100">Sponsored Action Token</p>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-0.5">{showNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-slate-150 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] bg-slate-200 border border-slate-300 text-slate-650 font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
            Sponsored
          </span>
          <h4 className="text-xs font-display font-bold text-slate-500">Conscious Partners Grid</h4>
        </div>
        <p className="text-[9px] text-emerald-600 font-mono font-bold flex items-center gap-1">
          <Eye size={10} /> Supports Circular Clothing Initiative
        </p>
      </div>

      <div className={`grid grid-cols-1 ${pageId === 'all' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
        {adsToShow.map((ad, idx) => {
          const isClicked = clickedAds[ad.id];
          return (
            <motion.div
              key={ad.id}
              className={`relative overflow-hidden bg-white border ${
                isClicked 
                  ? 'border-emerald-300/60 bg-emerald-50/10' 
                  : 'border-slate-200/80 hover:border-indigo-200'
              } rounded-2xl p-4.5 shadow-xs transition hover:shadow-md flex flex-col justify-between gap-3 text-left`}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header category / badge info */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[8.5px] font-mono font-black text-indigo-650 uppercase tracking-widest leading-none bg-indigo-50 border border-indigo-150/40 px-2 py-1 rounded">
                  {ad.category}
                </span>
                <span className="text-[9px] font-sans font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 whitespace-nowrap bg-slate-50/50">
                  {ad.emoji} {ad.badge}
                </span>
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <h5 className="text-[11.5px] font-mono font-semibold text-slate-400 capitalize pr-1 border-r border-slate-200 leading-none">
                    {ad.sponsor}
                  </h5>
                  <h5 className="text-xs font-display font-black text-slate-850 tracking-tight leading-snug">
                    {ad.title}
                  </h5>
                </div>
                <p className="text-[11px] text-slate-505 leading-relaxed font-sans">
                  {ad.description}
                </p>
              </div>

              {/* Bottom interactive rewards CTA */}
              <div className="flex items-center justify-between gap-4 mt-1 border-t border-slate-100/70 pt-3">
                <span className="text-[10px] font-mono text-emerald-650 font-bold flex items-center gap-1 leading-none">
                  {isClicked ? (
                    <span className="flex items-center gap-1 text-emerald-650 animate-bounce">
                      <CheckCircle2 size={11} /> Claimed +{ad.rewardCoins} ⭐
                    </span>
                  ) : (
                    <span className="text-emerald-700">⭐ Learn (+{ad.rewardCoins} coin)</span>
                  )}
                </span>

                <button
                  onClick={() => handleCtaClick(ad)}
                  id={`cta-ad-btn-${ad.id}`}
                  className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-[10.5px] font-bold tracking-tight cursor-pointer transition ${
                    isClicked
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-150'
                      : 'bg-slate-900 text-white hover:bg-slate-850 shadow-xs'
                  }`}
                >
                  <span>{ad.ctaText}</span>
                  <ArrowUpRight size={11} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {pageId !== 'all' && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setViewAll(!viewAll)}
            id="toggle-all-ads-btn"
            className="text-[10px] sm:text-[10.5px] font-mono font-bold text-slate-500 hover:text-indigo-700 hover:bg-slate-100 border border-slate-205 py-2 px-4 rounded-full flex items-center gap-2 transition bg-white/95 shadow-xs cursor-pointer"
          >
            {viewAll ? (
              <>
                <span>📁 Collapse to Page-Specific Ads</span>
              </>
            ) : (
              <>
                <span>♻️ View All 10 Sponsor Ads (+50 Stars Max!)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

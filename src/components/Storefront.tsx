/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { STORE_PRODUCTS } from '../data/products';
import { Star, ShieldAlert, Heart, ShoppingBag, SlidersHorizontal, Search, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  'All Products',
  'T-Shirts',
  'Hoodies',
  'Hats',
  'Joggers',
  'Jackets',
  'Corporate Apparel',
  'Charity Collections'
];

interface StorefrontProps {
  products?: Product[];
  onAddToCart: (p: Product, size: string) => void;
  cartItemsCount: number;
}

export default function Storefront({ products = STORE_PRODUCTS, onAddToCart, cartItemsCount }: StorefrontProps) {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeSelectorId, setSizeSelectorId] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All Products' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSizeClick = (productId: string, sz: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: sz }));
  };

  const handleQuickAdd = (p: Product) => {
    // If sizing exists, find active or default to "M" or open sizing Drawer
    const sizeNeeded = p.sizes && p.sizes.length > 0;
    const chosenSize = selectedSizes[p.id] || (sizeNeeded ? 'M' : 'One Size');
    
    onAddToCart(p, chosenSize);
    setFeedbackId(p.id);
    setTimeout(() => {
      setFeedbackId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* 1. Header Catalog Overview and Search Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 select-none font-sans">
        <div className="space-y-1">
          <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 font-mono text-[10px] font-bold">
            🛍️ OFFICIALLY SOURCED ORGANIC COTTON
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-800 tracking-tight mt-1.5">
            Explore Apparel Catalog
          </h2>
          <p className="text-xs text-slate-550 leading-relaxed">
            Choose our beautifully pre-designed clothing prints. Buying 1 matches another warm gift for local communities.
          </p>
        </div>

        {/* Searching block */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <input
            id="product-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hoodies, jerseys..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
          <Search size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* 2. Horizontal Tags Category Filters scroll */}
      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-thin select-none font-sans">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`category-filter-btn-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full shrink-0 transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Prebuilt Products Stream Grid Card */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-2xl max-w-md mx-auto space-y-3 font-sans">
          <p className="text-3xl">🧩</p>
          <p className="font-bold text-slate-800">No matching designs found.</p>
          <p className="text-xs text-slate-400">Try cleaning your searching parameters or selecting another tag category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const hasSizing = p.sizes && p.sizes.length > 0;
            const chosenSize = selectedSizes[p.id] || 'M';
            const isAdded = feedbackId === p.id;

            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:border-slate-350 select-none group relative overflow-hidden"
              >
                {/* Popular product badge */}
                {p.isPopular && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-indigo-650 text-white text-[8px] font-mono font-bold rounded-full select-none z-10 shadow-xs">
                    POPULAR MATCH
                  </span>
                )}

                <div className="space-y-4">
                  {/* Visual clothing image or emoji */}
                  <div className="w-full bg-slate-50 rounded-xl aspect-square flex justify-center items-center overflow-hidden shadow-inner relative group border border-slate-100">
                    {p.imageUrl.startsWith('http') ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition duration-300">
                        {p.imageUrl || '👕'}
                      </span>
                    )}
                    {/* Ambient visual shapes background to give premium look */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">{p.category}</span>
                      <div className="flex items-center text-amber-500 text-2xs font-bold gap-0.5">
                        <Star size={10} fill="currentColor" /> {p.rating}
                      </div>
                    </div>
                    <h4 className="font-display font-extrabold text-slate-800 text-sm tracking-tight leading-tight group-hover:text-indigo-600 transition">
                      {p.name}
                    </h4>
                    <p className="text-slate-400 text-[10px] leading-snug line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Sizes and actions columns selector panel */}
                <div className="space-y-4 pt-3.5 mt-4 border-t border-slate-100">
                  {hasSizing && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        Select Sizing
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {p.sizes?.map((sz) => (
                          <button
                            key={sz}
                            id={`quick-size-btn-${p.id}-${sz}`}
                            onClick={() => handleSizeClick(p.id, sz)}
                            className={`w-7 h-7 font-mono font-bold text-[9px] rounded-lg border transition ${
                              chosenSize === sz
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 cursor-pointer'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <div className="font-mono text-base font-extrabold text-slate-800 shrink-0">
                      ${p.price.toFixed(2)}
                    </div>

                    <button
                      id={`quick-add-btn-${p.id}`}
                      onClick={() => handleQuickAdd(p)}
                      disabled={isAdded}
                      className={`px-3.5 py-1.5 font-display text-[11px] font-bold rounded-lg shadow cursor-pointer transition flex items-center gap-1.5 transform active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-none'
                          : 'bg-indigo-650 hover:bg-indigo-750 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={11} />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={11} />
                          <span>Quick Add</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[9px] text-center font-semibold text-emerald-700 leading-none">
                    🌱 Matches +1 brand donation gift!
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom sustainability credentials */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 flex gap-4 max-w-2xl mx-auto items-start select-none font-sans">
        <p className="text-3xl">🤝</p>
        <div className="text-xs leading-normal text-slate-600">
          <p className="font-extrabold text-slate-850">Our GOTS Circular Textile Warranty</p>
          <p className="text-slate-500 mt-1">We maintain the absolute highest global organic standards. No plastic threading, water-based carbon-safe printing, with fully localized production and community delivery tracks.</p>
        </div>
      </div>
    </div>
  );
}

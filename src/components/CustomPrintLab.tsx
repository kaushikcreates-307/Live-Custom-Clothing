/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { CustomDesign, CustomPrintTemplate } from '../types';
import { Palette, Type, Sliders, ShoppingBag, Send, ImagePlus, CheckCircle, Flame, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = [
  { name: 'Pitch Black', hex: '#0f172a' },
  { name: 'Eco Charcoal', hex: '#334155' },
  { name: 'Pure White', hex: '#f8fafc' },
  { name: 'Charity Navy', hex: '#1e3a8a' },
  { name: 'Sappy Green', hex: '#166534' },
  { name: 'Sunset Terracotta', hex: '#c2410c' },
  { name: 'Mallow Yellow', hex: '#eab308' },
  { name: 'Soft Rose', hex: '#db2777' },
];

const TEXT_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Ebony', hex: '#0f172a' },
  { name: 'Sunshine', hex: '#facc15' },
  { name: 'Neon Green', hex: '#4ade80' },
  { name: 'Cyan Glow', hex: '#22d3ee' },
  { name: 'Muted Gray', hex: '#94a3b8' },
];

const STICKERS = [
  { id: 'earth', emoji: '🌍', name: 'Eco Earth' },
  { id: 'heart', emoji: '❤️', name: 'Pure Love' },
  { id: 'smile', emoji: '😊', name: 'Happy Day' },
  { id: 'recycle', emoji: '🔄', name: 'Circular' },
  { id: 'star', emoji: '⭐', name: 'Star Citizen' },
  { id: 'flame', emoji: '🔥', name: 'Spirit Flame' },
  { id: 'none', emoji: '🚫', name: 'No Decal' },
];

interface CustomPrintLabProps {
  onAddCustomToCart: (design: CustomDesign, price: number) => void;
  onPostToFeed: (design: CustomDesign) => void;
  currentCoins: number;
}

export default function CustomPrintLab({ onAddCustomToCart, onPostToFeed, currentCoins }: CustomPrintLabProps) {
  const [template, setTemplate] = useState<CustomPrintTemplate>('tshirt');
  const [color, setColor] = useState({ name: 'Charity Navy', hex: '#1e3a8a' });
  const [text, setText] = useState('MORE THAN CLOTHING');
  const [textColor, setTextColor] = useState({ name: 'White', hex: '#ffffff' });
  const [textSize, setTextSize] = useState(22);
  const [textYPosition, setTextYPosition] = useState(45);
  const [selectedSticker, setSelectedSticker] = useState('recycle');
  const [uploadedLogo, setUploadedLogo] = useState<string | undefined>(undefined);
  const [size, setSize] = useState('M');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [isPostFeedback, setIsPostFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'product' | 'design' | 'adjust'>('product');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUploadedLogo(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getPrice = () => {
    switch (template) {
      case 'tshirt': return 29.99;
      case 'hoodie': return 54.99;
      case 'mug': return 19.99;
      case 'hat': return 22.99;
      default: return 29.99;
    }
  };

  const currentDesignState: CustomDesign = {
    template,
    color: color.hex,
    text,
    textColor: textColor.hex,
    textSize,
    textYPosition,
    stickerUrl: selectedSticker !== 'none' ? selectedSticker : undefined,
    uploadedLogo,
    size
  };

  const handleAddToCart = () => {
    onAddCustomToCart(currentDesignState, getPrice());
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const handleShareToCommunity = () => {
    onPostToFeed(currentDesignState);
    setIsPostFeedback(true);
    setTimeout(() => setIsPostFeedback(false), 2500);
  };

  // Render clothing mock representation in solid pure SVGs with customizable colors
  const renderMock = () => {
    let baseStyle = {};
    const fillColor = color.hex;

    // Apply basic color to SVGs
    switch (template) {
      case 'tshirt':
        return (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-[340px]" id="tshirt-preview">
            <g transform="translate(0, 0)">
              {/* Sleeves and body */}
              <path
                d="M 120,40 C 130,55 145,60 160,60 C 176,60 190,55 200,40 M 200,40 C 210,55 225,60 240,60 C 255,60 270,55 280,40 L 370,100 L 330,160 L 290,140 L 290,360 L 110,360 L 110,140 L 70,160 L 30,100 Z"
                fill={fillColor}
                stroke="#475569"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Collar detail */}
              <path d="M 160,60 C 180,75 220,75 240,60" fill="none" stroke="#475569" strokeWidth="3" />
              {/* Dynamic Design Layer inside T-shirt borders */}
              <foreignObject x="115" y="90" width="170" height="230">
                <div className="w-full h-full relative flex flex-col justify-start items-center overflow-hidden font-display">
                  {/* Print Content Area */}
                  <div 
                    className="absolute w-full flex flex-col items-center select-none"
                    style={{ top: `${textYPosition}%`, transform: 'translateY(-50%)' }}
                  >
                    {/* Sticker Decal */}
                    {selectedSticker !== 'none' && (
                      <div className="text-4xl filter drop-shadow mb-2 transform hover:scale-110 transition">
                        {STICKERS.find(s => s.id === selectedSticker)?.emoji}
                      </div>
                    )}

                    {/* Uploaded Base64 Icon */}
                    {uploadedLogo && (
                      <img 
                        src={uploadedLogo} 
                        alt="logo" 
                        className="w-16 h-16 object-contain rounded-lg border border-dashed border-slate-400 p-1 bg-white mb-2" 
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Custom Text Print */}
                    {text && (
                      <p 
                        className="text-center font-bold break-words px-2 uppercase leading-tight select-none pointer-events-none drop-shadow-md"
                        style={{ color: textColor.hex, fontSize: `${textSize * 0.75}px` }}
                      >
                        {text}
                      </p>
                    )}
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        );

      case 'hoodie':
        return (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-[340px]" id="hoodie-preview">
            <g>
              {/* Sleeves and body */}
              <path
                d="M 120,60 L 150,90 M 280,60 L 250,90 M 200,85 L 200,360 M 350,110 L 300,170 L 275,150 L 275,360 L 125,360 L 125,150 L 100,170 L 50,110 L 140,50 L 260,50 Z"
                fill={fillColor}
                stroke="#475569"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Hood drawing overlay */}
              <path
                d="M 130,65 C 130,10 180,10 200,35 C 220,10 270,10 270,65 C 270,95 130,95 130,65 Z"
                fill={fillColor}
                stroke="#334155"
                strokeWidth="3.5"
              />
              {/* Drawstrings */}
              <path d="M 185,85 L 185,130" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
              <path d="M 215,85 L 215,130" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
              
              {/* Kangaroo Pocket */}
              <path
                d="M 150,330 L 170,270 L 230,270 L 250,330 Z"
                fill="none"
                stroke="#334155"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Dynamic Design Layer */}
              <foreignObject x="130" y="115" width="140" height="150">
                <div className="w-full h-full relative flex flex-col justify-start items-center overflow-hidden font-display">
                  <div 
                    className="absolute w-full flex flex-col items-center select-none"
                    style={{ top: `${textYPosition}%`, transform: 'translateY(-50%)' }}
                  >
                    {/* Sticker */}
                    {selectedSticker !== 'none' && (
                      <div className="text-4xl filter drop-shadow mb-1">
                        {STICKERS.find(s => s.id === selectedSticker)?.emoji}
                      </div>
                    )}
                    {/* Uploaded */}
                    {uploadedLogo && (
                      <img 
                        src={uploadedLogo} 
                        alt="logo" 
                        className="w-12 h-12 object-contain rounded-md border border-slate-400 p-1 bg-white mb-1" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {/* Custom text */}
                    {text && (
                      <p 
                        className="text-center font-extrabold uppercase leading-none px-1 py-0.5 break-all select-none drop-shadow-md"
                        style={{ color: textColor.hex, fontSize: `${textSize * 0.65}px` }}
                      >
                        {text}
                      </p>
                    )}
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        );

      case 'mug':
        return (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-[340px]" id="mug-preview">
            <g transform="translate(40, 20)">
              {/* Handle */}
              <path
                d="M 230,110 C 310,110 310,260 230,260"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                d="M 230,110 C 310,110 310,260 230,260"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="8"
                strokeLinecap="round"
              />
              
              {/* Mug Body */}
              <rect
                x="60"
                y="70"
                width="180"
                height="230"
                rx="20"
                fill={fillColor}
                stroke="#475569"
                strokeWidth="4"
              />
              <ellipse cx="150" cy="70" rx="90" ry="15" fill="#f1f5f9" stroke="#475569" strokeWidth="4" />
              
              {/* Dynamic Design Layer on Mug */}
              <foreignObject x="75" y="90" width="150" height="190">
                <div className="w-full h-full relative flex flex-col justify-start items-center overflow-hidden font-sans">
                  <div 
                    className="absolute w-full flex flex-col items-center"
                    style={{ top: `${textYPosition}%`, transform: 'translateY(-50%)' }}
                  >
                    {/* Sticker */}
                    {selectedSticker !== 'none' && (
                      <div className="text-3xl filter drop-shadow mb-1 animate-bounce">
                        {STICKERS.find(s => s.id === selectedSticker)?.emoji}
                      </div>
                    )}
                    {/* Uploaded */}
                    {uploadedLogo && (
                      <img 
                        src={uploadedLogo} 
                        alt="logo" 
                        className="w-10 h-10 object-contain rounded-md bg-white p-0.5 mb-1" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {text && (
                      <p 
                        className="text-center font-semibold text-xs leading-tight tracking-wider break-words px-2 uppercase select-none drop-shadow"
                        style={{ color: textColor.hex }}
                      >
                        {text}
                      </p>
                    )}
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        );

      case 'hat':
        return (
          <svg viewBox="0 0 400 400" className="w-full h-full max-h-[340px]" id="hat-preview">
            <g transform="translate(10, 40)">
              {/* Hat dome cap */}
              <path
                d="M 60,240 C 60,110 320,110 320,240 Z"
                fill={fillColor}
                stroke="#475569"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              
              {/* Brim/Visor */}
              <path
                d="M 50,230 C 50,230 10,270 200,270 C 390,270 350,230 350,230 C 290,225 110,225 50,230 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              {/* Button of top of cap */}
              <circle cx="190" cy="115" r="10" fill="#334155" />

              {/* Adjustable clip line at back */}
              <path d="M 120,240 C 130,220 250,220 260,240" fill="none" stroke="#475569" strokeWidth="2" />

              {/* Dynamic Design Layer - Front logo label of hat */}
              <foreignObject x="130" y="145" width="120" height="75">
                <div className="w-full h-full relative flex flex-col justify-center items-center overflow-hidden font-display bg-white/10 rounded border border-white/20 p-1">
                  <div className="w-full flex flex-col items-center justify-center select-none scale-90">
                    {/* Sticker */}
                    {selectedSticker !== 'none' && (
                      <div className="text-2xl filter drop-shadow">
                        {STICKERS.find(s => s.id === selectedSticker)?.emoji}
                      </div>
                    )}
                    {/* Uploaded */}
                    {uploadedLogo && (
                      <img 
                        src={uploadedLogo} 
                        alt="logo" 
                        className="w-7 h-7 object-contain bg-white rounded p-0.5" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {text && (
                      <p 
                        className="text-center font-black uppercase text-xs truncate leading-none overflow-ellipsis w-full max-w-[100px]"
                        style={{ color: textColor.hex }}
                      >
                        {text}
                      </p>
                    )}
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div id="custom-print-lab-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-4">
      {/* Visual Live Preview Column */}
      <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm sticky top-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 font-mono">
              <Flame size={12} className="text-emerald-600" /> YOU BUY 1, WE DONATE 1
            </span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-800">
            Real-Time Design Lab
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Preview updates instantly. Built with high-frequency responsive rendering.
          </p>
        </div>

        {/* Outer rendering frame with active subtle shadow */}
        <div className="w-full my-6 flex justify-center items-center py-6 min-h-[350px] bg-white rounded-xl border border-slate-100 shadow-inner relative group overflow-hidden">
          {/* Highlight rings */}
          <div className="absolute inset-0 bg-radial-at-t from-slate-100/50 to-transparent pointer-events-none" />
          
          <motion.div
            key={`${template}_${color.hex}_${selectedSticker}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-full max-w-[340px] flex justify-center items-center"
          >
            {renderMock()}
          </motion.div>
          
          {/* Subtle info label */}
          <div className="absolute bottom-2 font-mono text-[10px] text-slate-400 font-medium">
            3D PREVIEW MODEL • {template.toUpperCase()} • {color.name}
          </div>
        </div>

        {/* Pricing, impact, & add-to-cart row */}
        <div className="w-full border-t border-slate-200 pt-5 mt-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-widest">Pricing</div>
              <div className="text-3xl font-display font-bold text-slate-800 tracking-tight">
                ${getPrice()} <span className="text-xs text-slate-400 font-sans font-normal">USD</span>
              </div>
            </div>
            <div className="text-right bg-indigo-50/50 border border-indigo-100/50 rounded-xl px-4 py-2">
              <div className="text-[10px] font-mono font-bold text-indigo-500 uppercase tracking-wider">Matched Impact</div>
              <div className="text-sm font-sans font-bold text-indigo-700 flex items-center justify-end gap-1">
                👕 +1 Donation Gift
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="add-custom-design-cart-btn"
              onClick={handleAddToCart}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-medium px-4 py-3 rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-2 transform active:scale-[98%]"
            >
              {isAddedFeedback ? (
                <>
                  <CheckCircle size={18} className="animate-bounce" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add Custom Design to Cart</span>
                </>
              )}
            </button>

            <button
              id="share-custom-design-feed-btn"
              onClick={handleShareToCommunity}
              disabled={isPostFeedback}
              className="px-4 py-3 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transform active:scale-[98%]"
            >
              {isPostFeedback ? (
                <>
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-emerald-700">Id Shared!</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Share Concept</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2.5">
            💡 Sharing code concepts gives you <span className="font-bold text-emerald-600">+75 Star Coins</span> instantly!
          </p>
        </div>
      </div>

      {/* Editor Controls Column */}
      <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Step Tabs header */}
        <div className="flex border-b border-slate-100 mb-6 pb-2 font-display">
          <button
            id="tab-product-select"
            onClick={() => setActiveTab('product')}
            className={`flex-1 text-center py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'product'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Palette size={16} /> 1. Select Garment
            </span>
          </button>
          <button
            id="tab-design-text"
            onClick={() => setActiveTab('design')}
            className={`flex-1 text-center py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'design'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Type size={16} /> 2. Print & Colors
            </span>
          </button>
          <button
            id="tab-adjust-placement"
            onClick={() => setActiveTab('adjust')}
            className={`flex-1 text-center py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'adjust'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Sliders size={16} /> 3. Placements
            </span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="flex-1 min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'product' && (
              <motion.div
                key="product-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* 1. Base Clothing Template Select */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Choose Blank Canvas Item
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'tshirt', name: 'Classic T-Shirt', emoji: '👕', desc: 'Premium heavy shirt' },
                      { id: 'hoodie', name: 'Cozy Hoodie', emoji: '🧥', desc: 'Relaxed zip pullover' },
                      { id: 'mug', name: 'Ceramic Mug', emoji: '☕', desc: 'Solid print gloss' },
                      { id: 'hat', name: 'Retro Snapback', emoji: '🧢', desc: 'Structured panels' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        id={`template-btn-${item.id}`}
                        onClick={() => setTemplate(item.id as CustomPrintTemplate)}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 text-center transition cursor-pointer ${
                          template === item.id
                            ? 'border-indigo-600 bg-indigo-50/40'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <span className="text-4xl mb-2 filter drop-shadow">{item.emoji}</span>
                        <span className="text-xs font-display font-bold text-slate-800 leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 leading-none">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Choice Grid */}
                {template !== 'mug' && (
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                      Select Base Size
                    </label>
                    <div className="flex gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          id={`size-btn-${sz}`}
                          onClick={() => setSize(sz)}
                          className={`w-12 h-12 rounded-xl border-2 font-mono font-bold text-xs flex items-center justify-center transition cursor-pointer ${
                            size === sz
                              ? 'bg-slate-800 text-white border-slate-800'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fabric Material Info Banner */}
                <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex gap-3 text-slate-600">
                  <div className="text-xl">🌿</div>
                  <div className="text-xs font-sans">
                    <p className="font-bold text-slate-800 mb-0.5">Eco-Friendly Material Match</p>
                    <p className="leading-snug text-slate-500">
                      We use 100% GOTS-certified organic cotton and water-based biodegradable non-toxic inks. Soft on sensitive skin, soft on our carbon-neutral soil trackers.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'design' && (
              <motion.div
                key="design-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* A. Colors of Base */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Garment Base Shade: <span className="text-indigo-600 font-sans font-bold">{color.name}</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {COLORS.map((col) => (
                      <button
                        key={col.hex}
                        id={`base-color-${col.name.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setColor(col)}
                        title={col.name}
                        className={`w-10 h-10 rounded-full border-2 relative cursor-pointer flex items-center justify-center transition hover:scale-105 ${
                          color.hex === col.hex ? 'border-amber-500 shadow-md ring-2 ring-slate-100' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {col.hex === '#f8fafc' && (
                          <div className="absolute inset-0 rounded-full border border-slate-200 pointer-events-none" />
                        )}
                        {color.hex === col.hex && (
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              col.hex === '#f8fafc' ? 'bg-slate-800' : 'bg-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* B. Slogan/Text input Customizer */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                      Custom Slogan Print text
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {text.length}/32 chars
                    </span>
                  </div>
                  <input
                    id="custom-design-text-input"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value.substring(0, 32))}
                    placeholder="Type your positive motto..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium placeholder-slate-400"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {[
                      'YOU WEAR IT. WE SHARE IT.',
                      'MORE THAN CLOTHING',
                      'BUY 1 / DONATE 1',
                      'ECO CREATOR HERO',
                      'KIDS FOR CLIMATE',
                    ].map((sloganPreset) => (
                      <button
                        key={sloganPreset}
                        onClick={() => setText(sloganPreset)}
                        className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full cursor-pointer transition"
                      >
                        {sloganPreset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* C. Typography Font Shade picker */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Print Text Color
                  </label>
                  <div className="flex gap-2">
                    {TEXT_COLORS.map((txcol) => (
                      <button
                        key={txcol.hex}
                        id={`text-color-${txcol.name.toLowerCase()}`}
                        onClick={() => setTextColor(txcol)}
                        title={txcol.name}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${
                          textColor.hex === txcol.hex ? 'border-slate-800' : 'border-slate-200'
                        }`}
                        style={{ backgroundColor: txcol.hex }}
                      >
                        {textColor.hex === txcol.hex && (
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              txcol.hex === '#ffffff' ? 'bg-slate-800' : 'bg-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'adjust' && (
              <motion.div
                key="adjust-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {/* 1. Draggable/Slider controls */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                      Print Position (Y-Axis)
                    </label>
                    <span className="text-xs font-mono text-indigo-600 font-bold">{textYPosition}%</span>
                  </div>
                  <input
                    id="position-y-slider"
                    type="range"
                    min="15"
                    max="80"
                    value={textYPosition}
                    onChange={(e) => setTextYPosition(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>TOP (Collar)</span>
                    <span>CENTER</span>
                    <span>BOTTOM (Pocket)</span>
                  </div>
                </div>

                {/* 2. Text styling dimensions */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                      Print Font Scale
                    </label>
                    <span className="text-xs font-mono text-indigo-600 font-bold">{textSize}px</span>
                  </div>
                  <input
                    id="font-size-slider"
                    type="range"
                    min="14"
                    max="32"
                    value={textSize}
                    style={{ backgroundSize: '70% 100%' }}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="w-full h-2 rounded bg-slate-100 accent-indigo-600 appearance-none cursor-pointer"
                  />
                </div>

                {/* 3. Prebuilt Stickers Decal Choose */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Add Graphic Stamp Sticker
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STICKERS.map((st) => (
                      <button
                        key={st.id}
                        id={`sticker-btn-${st.id}`}
                        onClick={() => setSelectedSticker(st.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium font-sans cursor-pointer transition ${
                          selectedSticker === st.id
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="text-base">{st.emoji}</span>
                        <span>{st.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Upload Core Brand Logo File */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-display font-bold text-slate-700">Upload Your Own Logo/Drawings</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Supports PNG or JPG. Drag inside or select relative files.</p>
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <button
                        id="choose-custom-logo-file"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 cursor-pointer flex items-center gap-1.5 font-medium transition"
                      >
                        <ImagePlus size={14} />
                        <span>Select File</span>
                      </button>
                    </div>
                  </div>
                  {uploadedLogo && (
                    <div className="flex items-center gap-2 mt-3 bg-white border border-slate-200/80 rounded-lg p-2 max-w-sm">
                      <img src={uploadedLogo} alt="Preview" className="w-10 h-10 object-contain rounded" />
                      <div className="flex-1 truncate">
                        <span className="text-[10px] font-mono text-slate-500">custom_upload_preview.png</span>
                      </div>
                      <button
                        onClick={() => setUploadedLogo(undefined)}
                        className="text-[10px] hover:underline text-rose-500 font-bold cursor-pointer px-1.5"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prototyped print lab info footnotes */}
        <div className="border-t border-slate-100 pt-4 mt-6 text-slate-400 text-[10px] flex justify-between items-center font-mono">
          <span>Active Coins: <b className="text-emerald-700">💰 {currentCoins} Stars</b></span>
          <span className="flex items-center gap-0.5"><CheckCircle size={10} className="text-indigo-500" /> Vector Print Prepared</span>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Sparkles, Wand2, Star, Heart, Flame, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import BrandLogo from './BrandLogo';
import { auth, isFirebaseSupported, signInWithPopup, GoogleAuthProvider } from '../firebase';

interface LoginScreenProps {
  onLoginSuccess: (profile: UserProfile, userId?: string) => void;
}

const AVATARS = [
  { char: '👦', name: 'Eco Boy' },
  { char: '👧', name: 'Green Girl' },
  { char: '🦁', name: 'Forest Lion' },
  { char: '🐨', name: 'Leaf Koala' },
  { char: '🦄', name: 'Rainbow Unicorn' },
  { char: '🐼', name: 'Circular Panda' },
  { char: '🦊', name: 'Outreach Fox' },
  { char: '🐯', name: 'Eco Tiger' }
];

const ECO_ADJECTIVES = ['Sappy', 'Solar', 'Circular', 'Eco', 'Rainforest', 'Ocean', 'Windy', 'Panda', 'Green', 'Forest', 'River', 'Star'];
const ECO_NOUNS = ['Ranger', 'Scout', 'Outfitter', 'Guardian', 'Champion', 'Helper', 'Warrior', 'Pioneer', 'Beast', 'Innovator', 'Friend', 'Hero'];

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [name, setName] = useState('Kaushik Creates');
  const [email, setEmail] = useState('kaushikcreates@gmail.com');
  const [selectedAvatar, setSelectedAvatar] = useState('👦');
  const [customPassword, setCustomPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const generateEcoName = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const adj = ECO_ADJECTIVES[Math.floor(Math.random() * ECO_ADJECTIVES.length)];
      const noun = ECO_NOUNS[Math.floor(Math.random() * ECO_NOUNS.length)];
      setName(`${adj} ${noun}`);
      setIsGenerating(false);
    }, 400);
  };

  const handleGoogleLogin = async () => {
    if (!agreeTerms) {
      setAuthError('Please agree to the Local Clothing Outreach Rules first.');
      return;
    }
    setAuthError(null);
    if (!isFirebaseSupported || !auth) {
      // In offline mode, make a nice simulated login with the email & custom name
      onLoginSuccess({
        name: name.trim() || 'Google Advocate',
        email: email.trim(),
        level: 1,
        xp: 0,
        maxXp: 100,
        starCoins: 150,
        avatar: selectedAvatar,
        totalImpactCount: 0,
        rankName: 'Eco Novice'
      }, 'offline-google-user');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      onLoginSuccess({
        name: user.displayName || 'Google Eco Advocate',
        email: user.email || 'guest@livecustomclothing.com',
        level: 1,
        xp: 0,
        maxXp: 100,
        starCoins: 200, // 200 bonus coins for actual secure Google sign-in!
        avatar: selectedAvatar || '👦',
        totalImpactCount: 0,
        rankName: 'Eco Novice'
      }, user.uid);
    } catch (err: any) {
      console.error('Google Auth Popup Error:', err);
      setAuthError(err?.message || 'Failed to authenticate with Google. Please try nickname login instead.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLoginSuccess({
      name: name.trim(),
      email: email.trim() || 'guest@livecustomclothing.com',
      level: 1,
      xp: 0,
      maxXp: 100,
      starCoins: 150, // Starting bonus balance
      avatar: selectedAvatar,
      totalImpactCount: 0,
      rankName: 'Eco Novice'
    }, 'local-advocate-' + name.trim().toLowerCase().replace(/\s+/g, '-'));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 font-sans select-none relative overflow-hidden">
      {/* Dynamic kinetic colorful circles blurred in background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Frame Card with beautiful gradients */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 relative z-10"
      >
        {/* Left column - Information, graphics, values branding */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-650 via-indigo-700 to-indigo-850 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Backing visual designs */}
          <div className="absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(rgba(255,255,255,0.03)_2px,transparent_2px)] bg-[size:100%_12px] opacity-20 pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="w-20 h-11 bg-white/15 backdrop-blur-md border border-white/10 rounded-xl" iconOnly />
              <div>
                <h2 className="font-display font-black text-xl leading-none text-white">Live Custom Clothing</h2>
                <p className="text-[9px] font-mono tracking-widest uppercase text-emerald-300 mt-1">Wear It. We Share It.</p>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <span className="bg-brand-orange/20 text-brand-orange font-bold text-[9px] font-mono px-2.5 py-1 rounded-full border border-brand-orange/30 inline-block uppercase tracking-wider">
                COMMUNITY OVER GLASSES
              </span>
              <h3 className="text-xl md:text-2xl font-display font-black leading-tight tracking-tight">
                Empowering Kids through Circular Fashion
              </h3>
              <p className="text-xs text-indigo-100 leading-relaxed font-light">
                Welcome to the Charity Clothing Hub! Every customized t-shirt or hoodie purchased matches an organic cotton item delivered directly into the hands of local children in shelters.
              </p>
            </div>
          </div>

          {/* Social and Game value checklists */}
          <div className="space-y-3 pt-6 relative z-10 border-t border-indigo-500/20 mt-6 md:mt-0 font-sans">
            <div className="flex gap-2.5 items-start text-xs">
              <div className="w-5 h-5 bg-emerald-500/20 text-emerald-300 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Heart size={12} fill="currentColor" />
              </div>
              <p className="leading-snug text-indigo-100"><b>You Buy 1, We Donate 1</b>: Track donation map spots and specific neighborhood outfitting campaigns live.</p>
            </div>
            <div className="flex gap-2.5 items-start text-xs">
              <div className="w-5 h-5 bg-amber-500/20 text-amber-300 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Star size={12} fill="currentColor" />
              </div>
              <p className="leading-snug text-indigo-100"><b>Arcade Star Balance</b>: Play custom captchas, memory matches, and trivia to earn Rewards Ecostore coupons!</p>
            </div>
          </div>

          <p className="text-[10px] text-indigo-300 font-mono select-none mt-6 relative z-10">
            🔒 Pure GOTS Organic Certification Certified
          </p>
        </div>

        {/* Right column - Main Signup interactive block */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          <div className="space-y-1 mb-6">
            <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
              Create Your Team Profile
            </h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Kids, Parents, and Advocates: Setup your customized level badge and eco credentials to begin!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Email and Nickname inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  Support Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-850 font-medium"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center block">
                  <span>Eco Nickname</span>
                  {isGenerating && <span className="text-[8px] text-indigo-500 font-bold font-mono">Rolling...</span>}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value.substring(0, 24))}
                    placeholder="Enter custom handle"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-850 font-medium font-display"
                  />
                  <button
                    type="button"
                    onClick={generateEcoName}
                    title="Generate cute Eco Name"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                  >
                    <Wand2 size={13} className={isGenerating ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom mock password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Profile Password (Optional)
              </label>
              <input
                type="password"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-850"
              />
            </div>

            {/* 2. Choose Avatar selection row */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Select Team Champion Avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av.char}
                    type="button"
                    onClick={() => setSelectedAvatar(av.char)}
                    title={av.name}
                    className={`w-9 h-9 text-lg rounded-xl border flex items-center justify-center transition transform cursor-pointer ${
                      selectedAvatar === av.char
                        ? 'bg-indigo-50 border-indigo-500 shadow-md scale-110'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:scale-105'
                    }`}
                  >
                    {av.char}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Agree checkboxes */}
            <div className="flex items-start gap-2 pt-1 font-sans">
              <input
                type="checkbox"
                id="login-agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-indigo-650 rounded cursor-pointer"
              />
              <label htmlFor="login-agree-terms" className="text-[10px] text-slate-405 leading-tight cursor-pointer select-none">
                I agree to the <b>Local Clothing Outreach Rules</b>, committing to recycling education, carbon matching objectives, GOTS organic standards safety, and positive community comments.
              </label>
            </div>

            {/* 4. Giant Vibrant Launch Button */}
            <button
              id="submit-champion-signup-btn"
              type="submit"
              disabled={!agreeTerms}
              className="w-full bg-gradient-to-r from-brand-pink via-brand-orange to-indigo-650 hover:opacity-95 disabled:opacity-40 text-white font-display font-bold text-xs py-3 px-5 rounded-xl shadow-lg transition transform active:scale-[99%] flex items-center justify-center gap-1.5 cursor-pointer mt-4"
            >
              <span>Explore Ecostore catalog & Join Outreach</span>
              <ArrowRight size={13} />
            </button>

            {/* Google Authentication Divider and Quick Button */}
            <div className="relative my-4 flex py-1 items-center justify-center select-none text-[10px] font-mono text-slate-400 font-black uppercase tracking-widest leading-none">
              <div className="flex-grow border-t border-slate-150"></div>
              <span className="flex-shrink mx-4">OR USE GOOGLE</span>
              <div className="flex-grow border-t border-slate-150"></div>
            </div>

            <button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleLogin}
              disabled={!agreeTerms}
              className="w-full bg-white border border-slate-205 flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-45 transition transform active:scale-[99%] cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Get Connected via Google Account</span>
            </button>

            {authError && (
              <div className="bg-red-50 text-red-650 border border-red-200 text-[11px] rounded-xl px-4 py-2.5 font-medium leading-relaxed">
                🚨 {authError}
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}

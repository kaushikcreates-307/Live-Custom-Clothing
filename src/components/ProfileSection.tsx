import React, { useState } from 'react';
import { UserProfile, ShippingAddress, SimulatedOrder } from '../types';
import { motion } from 'motion/react';
import { User, MapPin, ClipboardList, Coins, Award, Sparkles, Phone, Mail, Settings2, Trash2, CheckCircle2, Package, Save } from 'lucide-react';

interface ProfileSectionProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function ProfileSection({ userProfile, onUpdateProfile }: ProfileSectionProps) {
  const [activeSection, setActiveSection] = useState<'info' | 'address' | 'orders'>('info');
  
  // Nickname/Settings form states
  const [newName, setNewName] = useState(userProfile.name);
  const [newPhone, setNewPhone] = useState(userProfile.phone || '');
  const [newBio, setNewBio] = useState(userProfile.bio || '');
  const [newAvatar, setNewAvatar] = useState(userProfile.avatar);

  // Address form states
  const [street, setStreet] = useState(userProfile.shippingAddress?.street || '');
  const [city, setCity] = useState(userProfile.shippingAddress?.city || '');
  const [state, setState] = useState(userProfile.shippingAddress?.state || '');
  const [zip, setZip] = useState(userProfile.shippingAddress?.zip || '');
  const [country, setCountry] = useState(userProfile.shippingAddress?.country || 'United States');

  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...userProfile,
      name: newName.trim() || userProfile.name,
      phone: newPhone.trim(),
      bio: newBio.trim(),
      avatar: newAvatar,
    };
    onUpdateProfile(updated);
    triggerSuccess('Settings updated successfully!');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: ShippingAddress = {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      country: country.trim(),
    };
    const updated = {
      ...userProfile,
      shippingAddress: address,
    };
    onUpdateProfile(updated);
    triggerSuccess('Shipping reference address saved!');
  };

  const triggerSuccess = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => {
      setSavedSuccessMsg(null);
    }, 3000);
  };

  const AVATARS_OPTIONS = ['👦', '👧', '🦁', '🐨', '🦄', '🐼', '🦊', '🐯', '👽', '🦖', '🌟'];

  // Default Mock Orders if none exist to make sure the tab has beautiful, realistic content initially
  const defaultMockOrders: SimulatedOrder[] = [
    {
      id: 'LCC-6902-SH',
      date: 'June 02, 2026',
      items: [
        { parentProductTitle: 'Zero-Waste Organic Cotton Tee - Warm Clay', quantity: 1, details: 'Color: Terra Cotta, Size: L', price: 29.99 }
      ],
      totalAmount: 29.99,
      status: 'Completed',
      trackingNumber: 'TRK-BIKE-94109',
      shippingAddress: userProfile.shippingAddress || {
        street: '1540 Mission St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        country: 'United States'
      }
    },
    {
      id: 'LCC-1249-PT',
      date: 'June 08, 2026',
      items: [
        { parentProductTitle: 'Custom Printed GOTS Hoodie', quantity: 1, details: 'Text: "Eco Warrior Status", Color: Sage, Size: M', price: 54.99 }
      ],
      totalAmount: 54.99,
      status: 'Shipped to Shelter',
      trackingNumber: 'TRK-CO2-38102',
      shippingAddress: userProfile.shippingAddress || {
        street: '1540 Mission St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        country: 'United States'
      }
    }
  ];

  const activeOrdersList = userProfile.orders && userProfile.orders.length > 0 
    ? userProfile.orders 
    : defaultMockOrders;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left" id="profile-container">
      {/* Profile Decorative Top Grid Section */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-805 to-indigo-900 p-8 text-white relative">
        <div className="absolute top-0 right-0 min-w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 select-none">
          {/* Avatar sphere */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl hover:scale-105 transition duration-300">
              {userProfile.avatar}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 border-2 border-indigo-800 text-[9px] font-mono font-black font-extrabold px-1.5 py-0.5 rounded-full uppercase text-white shadow-md">
              ONLINE
            </span>
          </div>

          {/* Identity details */}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-display font-black text-white leading-none tracking-tight">
                {userProfile.name}
              </h2>
              {userProfile.isAdmin && (
                <span className="self-center bg-rose-500 border border-rose-400 text-white text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider leading-none shadow-xs">
                  🔒 System Admin
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-200 flex items-center justify-center md:justify-start gap-1.5">
              <Mail size={12} /> {userProfile.email}
            </p>
            {userProfile.bio ? (
              <p className="text-xs text-slate-200 mt-1 italic font-sans max-w-md">"{userProfile.bio}"</p>
            ) : (
              <p className="text-xs text-slate-350 mt-1 italic font-sans">"No bio set. Customize your sustainable story below!"</p>
            )}

            {/* Level badge */}
            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start items-center">
              <span className="bg-brand-orange text-white text-[9.5px] font-display font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                <Award size={11} /> {userProfile.rankName}
              </span>
              <span className="bg-indigo-950/40 border border-indigo-600 text-indigo-200 font-mono text-[9px] font-bold px-2 py-1 rounded-lg">
                Level {userProfile.level} • {userProfile.xp}/{userProfile.maxXp} XP
              </span>
            </div>
          </div>

          {/* Quick Coins Stat block */}
          <div className="bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[160px] text-center space-y-1 self-center md:self-start">
            <div className="flex justify-center text-amber-300">
              <Coins size={22} className="animate-pulse" />
            </div>
            <p className="text-[9px] font-mono text-indigo-200 tracking-wider font-extrabold uppercase leading-none">Star Balance</p>
            <p className="text-xl font-display font-black text-amber-300">💰 {userProfile.starCoins} Stars</p>
            <p className="text-[9.5px] text-emerald-300 font-mono leading-none font-bold">+{userProfile.totalImpactCount} Clothing Gifts Matched</p>
          </div>
        </div>
      </div>

      {/* Tabs navigation sub-strip */}
      <div className="border-b border-slate-200 bg-slate-50 flex overflow-x-auto">
        <button
          onClick={() => setActiveSection('info')}
          id="profile-tab-info"
          className={`px-6 py-4 text-xs font-bold font-display cursor-pointer transition flex items-center gap-2 shrink-0 border-b-2 ${
            activeSection === 'info'
              ? 'border-indigo-650 text-indigo-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User size={13} />
          <span>Account Settings</span>
        </button>
        <button
          onClick={() => setActiveSection('address')}
          id="profile-tab-address"
          className={`px-6 py-4 text-xs font-bold font-display cursor-pointer transition flex items-center gap-2 shrink-0 border-b-2 ${
            activeSection === 'address'
              ? 'border-indigo-650 text-indigo-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin size={13} />
          <span>Shipping Addresses</span>
        </button>
        <button
          onClick={() => setActiveSection('orders')}
          id="profile-tab-orders"
          className={`px-6 py-4 text-xs font-bold font-display cursor-pointer transition flex items-center gap-2 shrink-0 border-b-2 ${
            activeSection === 'orders'
              ? 'border-indigo-650 text-indigo-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList size={13} />
          <span>My Orders & Outreaches</span>
          <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full select-none">
            {activeOrdersList.length}
          </span>
        </button>
      </div>

      {/* Success notification banner toast */}
      {savedSuccessMsg && (
        <div className="bg-emerald-50 border-y border-emerald-150 p-3 px-6 text-emerald-750 text-xs font-bold flex items-center gap-2 transition select-none">
          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Dynamic Content Panel */}
      <div className="p-8">
        {activeSection === 'info' && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <h3 className="text-sm font-display font-black text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
              Personal Information & Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  Eco Nickname / Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  Phone (for Delivery Alerts)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Sustainable Stencil Bio
              </label>
              <textarea
                rows={3}
                placeholder="Share your organic custom prints mission goals..."
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>

            {/* Custom Avatar swap list */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Switch Avatar Badge
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATARS_OPTIONS.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => setNewAvatar(char)}
                    className={`w-10 h-10 text-xl border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      newAvatar === char
                        ? 'bg-indigo-55 border-indigo-550 shadowscale-105 ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                id="profile-save-settings-btn"
                className="bg-indigo-650 hover:bg-indigo-750 text-white font-sans text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
              >
                <Save size={13} />
                <span>Save Profile Settings</span>
              </button>
            </div>
          </form>
        )}

        {activeSection === 'address' && (
          <form onSubmit={handleSaveAddress} className="space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-display font-black text-slate-800 uppercase tracking-wide">
                  Shipping Reference Address
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Define your local delivery drop location for matched GOTS garments.</p>
              </div>
              <MapPin className="text-slate-400" size={18} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Street Address
              </label>
              <input
                type="text"
                required
                placeholder="1540 Mission Road, Unit 105"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  City
                </label>
                <input
                  type="text"
                  required
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  State / Territory
                </label>
                <input
                  type="text"
                  required
                  placeholder="CA"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="94103"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                Country
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-4 py-2.5 text-xs text-slate-850 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                id="profile-save-address-btn"
                className="bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
              >
                <Save size={13} />
                <span>Save Shipping Address</span>
              </button>
            </div>
          </form>
        )}

        {activeSection === 'orders' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-display font-black text-slate-800 uppercase tracking-wide">
                Purchase History & Real-time Gift Mapping
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Every purchase here matches custom gear directly to regional shelters.</p>
            </div>

            <div className="space-y-4">
              {activeOrdersList.map((order) => (
                <div key={order.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  {/* Order header bar */}
                  <div className="bg-slate-50 border-b border-slate-150 px-5 py-3 flex flex-wrap justify-between items-center gap-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-mono text-slate-400 font-black tracking-widest leading-none">ORDER REFERENCE</p>
                      <p className="text-xs font-mono font-black text-slate-805 leading-none mt-1">{order.id}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-mono text-slate-400 leading-none">PURCHASE DATE</p>
                      <p className="text-[11px] font-sans text-slate-650 font-semibold leading-none mt-1">{order.date}</p>
                    </div>

                    <div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
                        order.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-150 animate-pulse'
                      }`}>
                        <Package size={11} />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order internal breakdown */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-3">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-4">
                          <div className="space-y-0.5 max-w-md">
                            <h4 className="text-xs font-display font-black text-slate-800 leading-snug">
                              {it.parentProductTitle} <span className="text-slate-400 font-normal">x{it.quantity}</span>
                            </h4>
                            <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
                              {it.details}
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700 whitespace-nowrap">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping breakdown */}
                    {order.shippingAddress && (
                      <div className="p-3 bg-slate-50 border border-slate-150/40 rounded-xl text-[11px] font-sans text-slate-550 flex items-start gap-2 max-w-xl">
                        <MapPin size={11} className="mt-0.5 shrink-0 text-slate-400" />
                        <div>
                          <span className="font-extrabold text-slate-700">Matched Recipient Outlets: </span>
                          <span>
                            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}, {order.shippingAddress.country}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Order cost summarized info */}
                    <div className="border-t border-slate-100 pt-4 flex flex-wrap justify-between items-center gap-3">
                      <div className="text-xs font-sans text-slate-400">
                        {order.trackingNumber && (
                          <p className="font-mono text-[10px]">
                            📡 Bike tracking: <span className="font-bold text-slate-700 select-all">{order.trackingNumber}</span>
                          </p>
                        )}
                        <p className="text-[10px] text-emerald-650 font-bold flex items-center gap-0.5 mt-0.5">
                          🎁 Buy-1 Give-1 Matching Outreached!
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 mr-2 uppercase">TOTAL</span>
                        <span className="text-sm font-black text-slate-800">${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { Product, DonationStats, UserProfile, SocialPost, ImpactCampaign } from '../types';
import { 
  Settings, Edit2, Plus, Trash2, Upload, Save, HelpCircle, Star, 
  Sparkles, Check, MapPin, Compass, Sliders, ChevronDown, RefreshCw, X, Eye, EyeOff, Users, MessageSquare, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTED_PRESETS = [
  { name: 'Navy T-Shirt', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600' },
  { name: 'Green Garden Tee', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600' },
  { name: 'Charity Orange Tee', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600' },
  { name: 'White Fleece Hoodie', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600' },
  { name: 'Gray Crewneck Sweater', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600' },
  { name: 'Black Full-Zip Eco Hoodie', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600' },
  { name: 'Retro Snapback Hat', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600' },
  { name: 'Slouchy Beanie Hat', url: 'https://images.unsplash.com/photo-1576871337622-98d48d4353d3?auto=format&fit=crop&q=80&w=600' },
  { name: 'Eco Canvas Tote Bag', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600' },
  { name: 'Dynamic Sticker Pack', url: 'https://images.unsplash.com/photo-1572375995501-4b0894d50c69?auto=format&fit=crop&q=80&w=600' },
  { name: 'Official Medal Badge', url: 'https://images.unsplash.com/photo-1578351619284-8d298bc6597a?auto=format&fit=crop&q=80&w=600' }
];

const CATEGORIES = [
  'T-Shirts',
  'Hoodies',
  'Hats',
  'Joggers',
  'Jackets',
  'Corporate Apparel',
  'Charity Collections'
];

interface AdminPanelProps {
  storeProducts: Product[];
  setStoreProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  rewardsProducts: Product[];
  setRewardsProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  donationStats: DonationStats;
  setDonationStats: React.Dispatch<React.SetStateAction<DonationStats>>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  campaigns: ImpactCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<ImpactCampaign[]>>;
  posts: SocialPost[];
  setPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
}

export default function AdminPanel({
  storeProducts,
  setStoreProducts,
  rewardsProducts,
  setRewardsProducts,
  donationStats,
  setDonationStats,
  userProfile,
  setUserProfile,
  campaigns,
  setCampaigns,
  posts,
  setPosts
}: AdminPanelProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'campaigns' | 'metrics' | 'posts'>('catalog');
  const [editingStoreProduct, setEditingStoreProduct] = useState<Product | null>(null);
  const [editingRewardsProduct, setEditingRewardsProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [newProductType, setNewProductType] = useState<'store' | 'rewards'>('store');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 19.99,
    pointsPrice: 100,
    category: 'T-Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    stock: 50,
    rating: 4.8,
    isPopular: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#0f172a', '#1e3a8a', '#16a34a']
  });

  // Target campaign edit state
  const [editingCampaign, setEditingCampaign] = useState<ImpactCampaign | null>(null);
  const [isAddingCampaign, setIsAddingCampaign] = useState<boolean>(false);
  const [newCampaign, setNewCampaign] = useState<Partial<ImpactCampaign>>({
    title: '',
    description: '',
    location: '',
    itemsDonated: 500,
    date: '2026-06-08',
    imageUrl: 'https://images.unsplash.com/photo-1489516408517-0c0a15662682?auto=format&fit=crop&q=80&w=600',
    partners: []
  });

  // Action status triggers
  const [bannerNotice, setBannerNotice] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showNotice = (text: string, type: 'success' | 'info' = 'success') => {
    setBannerNotice({ text, type });
    setTimeout(() => setBannerNotice(null), 3000);
  };

  // Base64 file reader logic
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'editingStore' | 'editingRewards' | 'newProduct' | 'editingCampaign' | 'newCampaign') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        if (target === 'editingStore' && editingStoreProduct) {
          setEditingStoreProduct(p => ({ ...p!, imageUrl: base64Url }));
        } else if (target === 'editingRewards' && editingRewardsProduct) {
          setEditingRewardsProduct(p => ({ ...p!, imageUrl: base64Url }));
        } else if (target === 'newProduct') {
          setNewProduct(p => ({ ...p, imageUrl: base64Url }));
        } else if (target === 'editingCampaign' && editingCampaign) {
          setEditingCampaign(c => ({ ...c!, imageUrl: base64Url }));
        } else if (target === 'newCampaign') {
          setNewCampaign(c => ({ ...c, imageUrl: base64Url }));
        }
        showNotice('📷 Image uploaded & converted successfully to Base64!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes on existing Storefront Product
  const handleSaveStoreProduct = () => {
    if (!editingStoreProduct) return;
    setStoreProducts(prev => 
      prev.map(p => p.id === editingStoreProduct.id ? editingStoreProduct : p)
    );
    setEditingStoreProduct(null);
    showNotice(`🛍️ "${editingStoreProduct.name}" content images & pricing updated!`, 'success');
  };

  // Save changes on existing Rewards Store Product
  const handleSaveRewardsProduct = () => {
    if (!editingRewardsProduct) return;
    setRewardsProducts(prev => 
      prev.map(p => p.id === editingRewardsProduct.id ? editingRewardsProduct : p)
    );
    setEditingRewardsProduct(null);
    showNotice(`🎁 "${editingRewardsProduct.name}" rewards details updated!`, 'success');
  };

  // Add brand new product
  const handleAddNewProduct = () => {
    if (!newProduct.name || !newProduct.description) {
      showNotice('Please fill out Product Name and Description fields.', 'info');
      return;
    }
    const createdProduct: Product = {
      id: `${newProductType}-${Date.now()}`,
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price) || 0,
      pointsPrice: Number(newProduct.pointsPrice) || 0,
      category: newProduct.category || 'T-Shirts',
      imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
      rating: Number(newProduct.rating) || 4.8,
      isPopular: !!newProduct.isPopular,
      stock: Number(newProduct.stock) || 50,
      sizes: newProduct.sizes || ['S', 'M', 'L', 'XL'],
      colors: newProduct.colors || ['#0f172a'],
      isRewardOnly: newProductType === 'rewards'
    };

    if (newProductType === 'store') {
      setStoreProducts([createdProduct, ...storeProducts]);
    } else {
      setRewardsProducts([createdProduct, ...rewardsProducts]);
    }

    setIsAddingProduct(false);
    setNewProduct({
      name: '',
      description: '',
      price: 19.99,
      pointsPrice: 100,
      category: 'T-Shirts',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
      stock: 50,
      rating: 4.8,
      isPopular: false,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#0f172a', '#1e3a8a']
    });
    showNotice(`🔥 Product "${createdProduct.name}" created and placed into active catalog!`, 'success');
  };

  // Delete product
  const handleDeleteProduct = (productId: string, type: 'store' | 'rewards') => {
    if (confirm('Are you absolutely sure you want to delete this product? This action cannot be undone.')) {
      if (type === 'store') {
        setStoreProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        setRewardsProducts(prev => prev.filter(p => p.id !== productId));
      }
      showNotice('🗑️ Product removed from catalogs.', 'info');
    }
  };

  // Live tester metrics modifier
  const handleUpdateStat = (key: keyof DonationStats, val: number) => {
    setDonationStats(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Profile override configurer
  const handleUpdateUserCoin = (amount: number) => {
    setUserProfile(prev => ({
      ...prev,
      starCoins: Math.max(0, prev.starCoins + amount)
    }));
  };

  const handleSetUserLevel = (lvl: number) => {
    setUserProfile(prev => ({
      ...prev,
      level: lvl
    }));
    showNotice(`👑 Level overridden to Lv. ${lvl}! (Will trigger congratulations)`, 'success');
  };

  // Save changes on existing Campaign Drop
  const handleSaveCampaign = () => {
    if (!editingCampaign) return;
    setCampaigns(prev => 
      prev.map(c => c.id === editingCampaign.id ? editingCampaign : c)
    );
    setEditingCampaign(null);
    showNotice(`📍 Regional spot "${editingCampaign.location}" updated!`, 'success');
  };

  // Add whole new camp drop
  const handleAddNewCampaign = () => {
    if (!newCampaign.title || !newCampaign.location) {
      showNotice('Please fill out campaign Title and Location.', 'info');
      return;
    }
    const createdCamp: ImpactCampaign = {
      id: `camp-${Date.now()}`,
      title: newCampaign.title,
      description: newCampaign.description || 'Active clothing drops supplying warm kids wardrobes GOTS.',
      location: newCampaign.location,
      itemsDonated: Number(newCampaign.itemsDonated) || 400,
      date: newCampaign.date || '2026-06-08',
      imageUrl: newCampaign.imageUrl || 'https://images.unsplash.com/photo-1489516408517-0c0a15662682?auto=format&fit=crop&q=80&w=600',
      partners: newCampaign.partners && newCampaign.partners.length > 0 ? newCampaign.partners : ['Local Shelter Network']
    };

    setCampaigns([...campaigns, createdCamp]);
    setIsAddingCampaign(false);
    setNewCampaign({
      title: '',
      description: '',
      location: '',
      itemsDonated: 500,
      date: '2026-06-08',
      imageUrl: 'https://images.unsplash.com/photo-1489516408517-0c0a15662682?auto=format&fit=crop&q=80&w=600',
      partners: []
    });
    showNotice(`📍 Added new Regional spot "${createdCamp.title}" to Map!`, 'success');
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you absolutely sure you want to remove this campaign spot?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      showNotice('🗑️ Campaign spot removed.', 'info');
    }
  };

  // Social feed moderator
  const handleDeletePost = (postId: string) => {
    if (confirm('Moderate/Delete this user feed post permanently?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      showNotice('🛡️ Feed post moderated & removed successfully.', 'info');
    }
  };

  const handleAddOfficialAnnouncement = () => {
    const text = prompt('Enter your Official Admin announcement:');
    if (!text) return;

    const newAnn: SocialPost = {
      id: `post-admin-${Date.now()}`,
      isCommunityCampaign: true,
      userId: 'lh-brand',
      userName: 'Live Custom Team (Admin)',
      userAvatar: '👑',
      userBadge: '🌟 Official Co.',
      timestamp: 'Just now',
      text: text,
      likes: 12,
      comments: [],
      shares: 3
    };

    setPosts([newAnn, ...posts]);
    showNotice('📢 Official announcement posted on Community Feed!', 'success');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 font-sans select-none text-left">
      
      {/* Alert Notices */}
      <AnimatePresence>
        {bannerNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-6 py-4 shadow-xl text-white font-bold flex items-center gap-2 max-w-md text-xs border ${
              bannerNotice.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500' 
              : 'bg-indigo-900 border-indigo-750'
            }`}
          >
            <Sparkles size={16} className="animate-spin" />
            <span>{bannerNotice.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Title Jumbotron */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-950 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px]" />
        
        <div className="space-y-1.5 relative z-10">
          <span className="px-2.5 py-0.5 bg-indigo-500 text-indigo-100 font-mono text-[9px] font-bold rounded-full uppercase tracking-wider">
            ⚙️ ROOT ACCESS INGRESS ROUTE
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight flex items-center gap-2">
            Admin Console Portal
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xl">
            Live administrative management modules. Upload catalog images, manage description copy, adjust active pricing, relocate regional campaign pins, moderate feed threads, and test gamified loops instantaneously.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl shrink-0 font-mono text-center select-none flex items-center gap-3.5 relative z-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Settings size={20} className="animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="text-left font-sans">
            <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase leading-none">Security Level</div>
            <div className="text-sm font-black text-emerald-400 mt-1">Superuser Authorized</div>
            <p className="text-[9px] text-slate-400 leading-none mt-1">IP Ref: 127.0.0.1 (Sandbox Mode)</p>
          </div>
        </div>
      </div>

      {/* Sub-Navigations tabs for admin */}
      <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-0.5 select-none scrollbar-none">
        {[
          { id: 'catalog', label: 'Store & Reward Catalogs', icon: Sliders },
          { id: 'campaigns', label: 'Regional Map Campaigns', icon: MapPin },
          { id: 'metrics', label: 'Interactive Metrics Tester', icon: Award },
          { id: 'posts', label: 'Community Feed Moderator', icon: Users }
        ].map((sub) => {
          const SubIcon = sub.icon;
          const isActive = activeSubTab === sub.id;

          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubTab(sub.id as any);
                setEditingStoreProduct(null);
                setEditingRewardsProduct(null);
                setIsAddingProduct(false);
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-display text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <SubIcon size={14} />
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCT CATALOG MANAGER */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">

          {/* Catalog top bar controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border rounded-2xl gap-3">
            <div>
              <p className="font-extrabold text-slate-800 text-sm">Product Catalog Overview</p>
              <p className="text-slate-400 text-xs mt-0.5">Edit store items, overwrite pricing coordinates, or upload brand custom designs.</p>
            </div>
            <button
              onClick={() => {
                setIsAddingProduct(true);
                setEditingStoreProduct(null);
                setEditingRewardsProduct(null);
              }}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow hover:scale-[1.02] active:scale-95"
            >
              <Plus size={13} />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Interactive ADD PRODUCT Overlay/Panel */}
          <AnimatePresence>
            {isAddingProduct && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-3xl p-6 overflow-hidden"
              >
                <div className="flex justify-between items-center pb-4 border-b border-indigo-100 mb-5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2.5 bg-indigo-105 text-indigo-700 text-[10px] font-mono font-bold rounded-lg uppercase">STAGE NEW ITEM</span>
                    <h4 className="font-display font-black text-slate-800 text-base">Add Brand New Product</h4>
                  </div>
                  <button 
                    onClick={() => setIsAddingProduct(false)}
                    className="p-1.5 hover:bg-indigo-100 text-slate-400 hover:text-rose-500 rounded-xl transition cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Catalog Placement</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setNewProductType('store')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            newProductType === 'store' 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          👚 Store Apparel (Cash Sales)
                        </button>
                        <button
                          onClick={() => setNewProductType('rewards')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            newProductType === 'rewards' 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          🎁 Rewards Ecostore (Points)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Product Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Classic Organic Sweater - Sunrise Coral"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Category Tag</label>
                      <select
                        value={newProduct.category}
                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="Stickers">Stickers (Rewards)</option>
                        <option value="Coupons">Coupons (Rewards)</option>
                        <option value="Badges">Badges (Rewards)</option>
                        <option value="Accessories">Accessories (Rewards)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {newProductType === 'store' ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Price ($ USD) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Coins Price (Stars) *</label>
                          <input
                            type="number"
                            value={newProduct.pointsPrice}
                            onChange={e => setNewProduct({ ...newProduct, pointsPrice: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Stock Count</label>
                        <input
                          type="number"
                          value={newProduct.stock}
                          onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Description Copy *</label>
                      <textarea
                        rows={3}
                        placeholder="Detail the organic parameters, GOTS certifications, and comfort stats..."
                        value={newProduct.description}
                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Image section of add product */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block text-left">Product Image Preview</label>
                      <div className="w-full border border-slate-200 rounded-2xl bg-white aspect-video flex items-center justify-center relative overflow-hidden group">
                        {newProduct.imageUrl ? (
                          <img 
                            src={newProduct.imageUrl} 
                            alt="preview" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-4xl">👕</span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 backdrop-blur-xs py-2 text-white text-[10px] font-mono text-center">
                          Image URL bound indeed
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Assign Content Image Link</label>
                      <input
                        type="text"
                        placeholder="Unsplash HTTP address link..."
                        value={newProduct.imageUrl}
                        onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Local browser file selector base64 upload helper */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Or Upload Custom Catalog Image File</label>
                      <div className="flex gap-2">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, 'newProduct')}
                          className="hidden" 
                          id="new-prod-image-file" 
                        />
                        <label 
                          htmlFor="new-prod-image-file"
                          className="flex-1 border bg-white hover:bg-slate-50 py-2 rounded-xl text-center text-xs font-semibold cursor-pointer border-slate-200 flex items-center justify-center gap-1"
                        >
                          <Upload size={13} />
                          Browse File & Auto-Convert (PNG/JPG)
                        </label>
                      </div>
                      <p className="text-[9px] text-slate-400">Loads local assets directly to preview inside client catalog using Base64 stringification.</p>
                    </div>

                    {/* Presets Gallery Quick Assign */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Quick Presets Library (Unsplash GOTS)</label>
                      <div className="grid grid-cols-4 gap-1">
                        {SUGGESTED_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setNewProduct({ ...newProduct, imageUrl: preset.url })}
                            className="text-[9px] font-medium border rounded-lg p-1 text-center bg-white hover:bg-indigo-50 border-slate-200 text-slate-600 truncate hover:text-indigo-650"
                            title={preset.name}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-indigo-100 mt-5">
                  <button
                    onClick={handleAddNewProduct}
                    className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 transition"
                  >
                    <Check size={14} />
                    <span>Confirm Launch into Catalog</span>
                  </button>
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="px-6 py-3 bg-white text-slate-500 font-semibold rounded-xl text-xs border border-slate-200 cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Catalog grid split side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            
            {/* Left side: STORE catalog products */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b mb-1">
                <div>
                  <h3 className="font-display font-black text-slate-800 text-sm">Storefront Catalogs (Apparel)</h3>
                  <p className="text-[10.5px] text-slate-400">Total counted: {storeProducts.length} premium products.</p>
                </div>
                <span className="p-1 px-2.5 bg-indigo-50 text-indigo-700 text-[9px] font-mono font-bold rounded-full">Cash Shop</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {storeProducts.map((p) => {
                  return (
                    <div key={p.id} className="border border-slate-150 rounded-xl p-3 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                      <div className="flex items-center gap-3 w-full md:w-3/4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border overflow-hidden shrink-0">
                          <img src={p.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate space-y-0.5">
                          <h4 className="font-display font-bold text-slate-800 text-xs truncate">{p.name}</h4>
                          <div className="flex items-center gap-2 font-mono text-[9px] text-slate-450">
                            <span className="text-indigo-600 font-extrabold uppercase">{p.category}</span>
                            <span>•</span>
                            <span className="font-extrabold text-slate-700">${p.price.toFixed(2)}</span>
                            <span>•</span>
                            <span>Stock: {p.stock || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 md:self-center">
                        <button
                          onClick={() => {
                            setEditingStoreProduct(p);
                            setEditingRewardsProduct(null);
                            setIsAddingProduct(false);
                          }}
                          className="p-1.5 hover:bg-indigo-50 text-indigo-650 hover:text-indigo-850 rounded-lg border border-slate-200 transition cursor-pointer"
                          title="Edit Images & Metadata"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, 'store')}
                          className="p-1.5 hover:bg-rose-50 text-rose-550 hover:text-rose-750 border border-rose-200 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side: REWARDS catalog products */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b mb-1">
                <div>
                  <h3 className="font-display font-black text-slate-800 text-sm">Rewards Ecostore Catalogs (Digital/Totes)</h3>
                  <p className="text-[10.5px] text-slate-400">Total counted: {rewardsProducts.length} rewards.</p>
                </div>
                <span className="p-1 px-2.5 bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold rounded-full">Gaming Stars Shop</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {rewardsProducts.map((p) => (
                  <div key={p.id} className="border border-slate-150 rounded-xl p-3 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex items-center gap-3 w-full md:w-3/4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-50/40 border border-emerald-100 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                        {p.imageUrl.startsWith('http') ? (
                          <img src={p.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span>{p.imageUrl || '🎁'}</span>
                        )}
                      </div>
                      <div className="truncate space-y-0.5">
                        <h4 className="font-display font-bold text-slate-800 text-xs truncate">{p.name}</h4>
                        <div className="flex items-center gap-2 font-mono text-[9px] text-slate-450">
                          <span className="text-emerald-600 font-extrabold uppercase">{p.category}</span>
                          <span>•</span>
                          <span className="font-extrabold text-emerald-800">💰 {p.pointsPrice || 100} Stars</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 md:self-center">
                      <button
                        onClick={() => {
                          setEditingRewardsProduct(p);
                          setEditingStoreProduct(null);
                          setIsAddingProduct(false);
                        }}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-800 rounded-lg border border-slate-200 transition cursor-pointer"
                        title="Edit Images & Pricing"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, 'rewards')}
                        className="p-1.5 hover:bg-rose-50 text-rose-550 hover:text-rose-750 border border-rose-200 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* EDIT STORE PRODUCT FORM */}
          {editingStoreProduct && (
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-3xl p-6 text-left space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-indigo-150">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-white font-mono text-[9px] font-bold rounded-lg uppercase">ACTIVE EDIT</span>
                  <p className="font-display font-black text-slate-800 text-sm">Modify Storefront Product: {editingStoreProduct.name}</p>
                </div>
                <button onClick={() => setEditingStoreProduct(null)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Product Title</label>
                    <input
                      type="text"
                      value={editingStoreProduct.name}
                      onChange={e => setEditingStoreProduct({ ...editingStoreProduct, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-550 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Price ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingStoreProduct.price}
                        onChange={e => setEditingStoreProduct({ ...editingStoreProduct, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-550"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Category Tag</label>
                      <select
                        value={editingStoreProduct.category}
                        onChange={e => setEditingStoreProduct({ ...editingStoreProduct, category: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-550 focus:outline-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Stock Count</label>
                      <input
                        type="number"
                        value={editingStoreProduct.stock || 0}
                        onChange={e => setEditingStoreProduct({ ...editingStoreProduct, stock: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-550"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Promote</label>
                      <div className="flex h-10 items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={!!editingStoreProduct.isPopular}
                            onChange={e => setEditingStoreProduct({ ...editingStoreProduct, isPopular: e.target.checked })}
                            className="rounded border-slate-350 text-indigo-650 focus:ring-indigo-550 w-4 h-4"
                          />
                          Show "POPULAR MATCH" Tag Badge
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Description Copy</label>
                    <textarea
                      rows={3}
                      value={editingStoreProduct.description}
                      onChange={e => setEditingStoreProduct({ ...editingStoreProduct, description: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-550 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Product Banner Image</label>
                    <div className="w-full aspect-video border rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center relative">
                      <img src={editingStoreProduct.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 py-2.5 text-center text-white text-[10px] font-mono">
                        Base URL Length: {editingStoreProduct.imageUrl.substring(0, 36)}... ({editingStoreProduct.imageUrl.length} bytes)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Image URL Address</label>
                    <input
                      type="text"
                      value={editingStoreProduct.imageUrl}
                      onChange={e => setEditingStoreProduct({ ...editingStoreProduct, imageUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-550 focus:outline-none"
                    />
                  </div>

                  {/* Local browser file selector base64 upload helper */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Or Upload Custom Catalog Image File</label>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'editingStore')}
                        className="hidden" 
                        id="editing-store-image-file" 
                      />
                      <label 
                        htmlFor="editing-store-image-file"
                        className="flex-1 border bg-white hover:bg-slate-50 py-2 rounded-xl text-center text-xs font-semibold cursor-pointer border-slate-200 flex items-center justify-center gap-1"
                      >
                        <Upload size={13} />
                        Browse File & Auto-Convert (PNG/JPG)
                      </label>
                    </div>
                  </div>

                  {/* Presets Gallery Quick Assign */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Choose standard Unsplash GOTS presets</label>
                    <div className="grid grid-cols-4 gap-1">
                      {SUGGESTED_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setEditingStoreProduct({ ...editingStoreProduct, imageUrl: preset.url })}
                          className={`text-[9px] font-semibold border rounded-lg p-1 text-center truncate ${
                            editingStoreProduct.imageUrl === preset.url 
                              ? 'bg-indigo-600 text-white border-indigo-600' 
                              : 'bg-white hover:bg-indigo-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-indigo-150">
                <button
                  onClick={handleSaveStoreProduct}
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 transition"
                >
                  <Save size={14} />
                  <span>Save Product Design Modifications</span>
                </button>
                <button
                  onClick={() => setEditingStoreProduct(null)}
                  className="px-6 py-3 bg-white text-slate-500 font-semibold rounded-xl text-xs border border-slate-200 cursor-pointer hover:bg-slate-50"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* EDIT REWARDS PRODUCT FORM */}
          {editingRewardsProduct && (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 text-left space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-emerald-150">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[9px] font-bold rounded-lg uppercase">REWARD EDIT</span>
                  <p className="font-display font-black text-slate-800 text-sm">Modify Reward Store Product: {editingRewardsProduct.name}</p>
                </div>
                <button onClick={() => setEditingRewardsProduct(null)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Reward Title</label>
                    <input
                      type="text"
                      value={editingRewardsProduct.name}
                      onChange={e => setEditingRewardsProduct({ ...editingRewardsProduct, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-emerald-550 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Coins Price (Stars)</label>
                      <input
                        type="number"
                        value={editingRewardsProduct.pointsPrice}
                        onChange={e => setEditingRewardsProduct({ ...editingRewardsProduct, pointsPrice: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-550"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Reward Category</label>
                      <input
                        type="text"
                        value={editingRewardsProduct.category}
                        onChange={e => setEditingRewardsProduct({ ...editingRewardsProduct, category: e.target.value })}
                        placeholder="e.g. Coupons, Accessories, Sticks"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-555 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Reward Description</label>
                    <textarea
                      rows={3}
                      value={editingRewardsProduct.description}
                      onChange={e => setEditingRewardsProduct({ ...editingRewardsProduct, description: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-emerald-550 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Reward Content Illustration</label>
                    <div className="w-24 h-24 border rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center relative text-3xl select-none">
                      {editingRewardsProduct.imageUrl.startsWith('http') ? (
                        <img src={editingRewardsProduct.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <span>{editingRewardsProduct.imageUrl || '🎁'}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Image Link URL or Emoji Character</label>
                    <input
                      type="text"
                      value={editingRewardsProduct.imageUrl}
                      onChange={e => setEditingRewardsProduct({ ...editingRewardsProduct, imageUrl: e.target.value })}
                      placeholder="Enter HTTP link, or single emoji character..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-emerald-550 focus:outline-none"
                    />
                  </div>

                  {/* Local file conversion to base64 for rewards */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Or Upload Custom Catalog Image File</label>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'editingRewards')}
                        className="hidden" 
                        id="editing-rewards-image-file" 
                      />
                      <label 
                        htmlFor="editing-rewards-image-file"
                        className="flex-1 border bg-white hover:bg-slate-50 py-2 rounded-xl text-center text-xs font-semibold cursor-pointer border-slate-200 flex items-center justify-center gap-1"
                      >
                        <Upload size={13} />
                        Browse File & Auto-Convert (PNG/JPG)
                      </label>
                    </div>
                  </div>

                  {/* Presets Quick selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Quick suggested GOTS vectors</label>
                    <div className="grid grid-cols-4 gap-1">
                      {SUGGESTED_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setEditingRewardsProduct({ ...editingRewardsProduct, imageUrl: preset.url })}
                          className={`text-[9px] font-semibold border rounded-lg p-1 text-center truncate ${
                            editingRewardsProduct.imageUrl === preset.url 
                              ? 'bg-emerald-600 text-white border-emerald-600' 
                              : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-emerald-150">
                <button
                  onClick={handleSaveRewardsProduct}
                  className="flex-1 py-3 bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 transition"
                >
                  <Save size={14} />
                  <span>Save Reward Configurations</span>
                </button>
                <button
                  onClick={() => setEditingRewardsProduct(null)}
                  className="px-6 py-3 bg-white text-slate-500 font-semibold rounded-xl text-xs border border-slate-200 cursor-pointer hover:bg-slate-50"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: INTERACTIVE MAP SPOT CAMPAIGNS */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border rounded-2xl gap-3">
            <div>
              <p className="font-extrabold text-slate-800 text-sm">Rel relocate active spots on the vector map</p>
              <p className="text-slate-400 text-xs mt-0.5">Control the position dots, delivery counts, titles, descriptions, and partnering shelters in the US Outreach spots list.</p>
            </div>
            <button
              onClick={() => {
                setIsAddingCampaign(true);
                setEditingCampaign(null);
              }}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow hover:scale-[1.02] active:scale-95"
            >
              <Plus size={13} />
              <span>Add New Regional Spot</span>
            </button>
          </div>

          {/* Interactive ADD CAMPAIGN Panel */}
          <AnimatePresence>
            {isAddingCampaign && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-3xl p-6 overflow-hidden text-left"
              >
                <div className="flex justify-between items-center pb-4 border-b border-indigo-100 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2.5 bg-indigo-100 text-indigo-700 text-[10px] font-mono font-bold rounded-lg uppercase">NEW MAP PIN</span>
                    <h4 className="font-display font-black text-slate-800 text-base">Stage New Location Spot</h4>
                  </div>
                  <button onClick={() => setIsAddingCampaign(false)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                    <X size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Campaign Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Seattle Green Park Drop-off"
                        value={newCampaign.title}
                        onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Location Tag (City, ST) *</label>
                        <input
                          type="text"
                          placeholder="e.g. Seattle, WA"
                          value={newCampaign.location}
                          onChange={e => setNewCampaign({ ...newCampaign, location: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Items Donated Count</label>
                        <input
                          type="number"
                          value={newCampaign.itemsDonated}
                          onChange={e => setNewCampaign({ ...newCampaign, itemsDonated: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Outreach Date</label>
                        <input
                          type="date"
                          value={newCampaign.date}
                          onChange={e => setNewCampaign({ ...newCampaign, date: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Key Partners (Comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Seattle Hope Club, YMCA"
                          onChange={e => setNewCampaign({ ...newCampaign, partners: e.target.value.split(',').map(s => s.trim()) })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Outreach Description Details</label>
                      <textarea
                        rows={3}
                        placeholder="Detail the target shelter group, apparel items provided, and outcome achievements..."
                        value={newCampaign.description}
                        onChange={e => setNewCampaign({ ...newCampaign, description: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Scenic Campaign Photo</label>
                      <div className="w-full aspect-video border rounded-2xl bg-white overflow-hidden relative">
                        <img src={newCampaign.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Scenic Photo address URL</label>
                      <input
                        type="text"
                        value={newCampaign.imageUrl}
                        onChange={e => setNewCampaign({ ...newCampaign, imageUrl: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block text-left">Or Custom Photo upload</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'newCampaign')}
                        className="hidden" 
                        id="new-campaign-image-file" 
                      />
                      <label 
                        htmlFor="new-campaign-image-file"
                        className="w-full border bg-white hover:bg-slate-50 py-2.5 rounded-xl text-center text-xs font-semibold cursor-pointer border-slate-200 block text-center"
                      >
                        Upload local photo & convert base64
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-indigo-100 mt-5">
                  <button
                    onClick={handleAddNewCampaign}
                    className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition"
                  >
                    <Check size={14} />
                    <span>Deploy Location Point to Map</span>
                  </button>
                  <button
                    onClick={() => setIsAddingCampaign(false)}
                    className="px-6 py-3 bg-white text-slate-500 font-semibold rounded-xl text-xs border border-slate-200 cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map spots list */}
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4 text-left">
            <h3 className="font-display font-black text-slate-800 text-sm pb-2 border-b">Active Outreach Locations Placements ({campaigns.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((camp) => (
                <div key={camp.id} className="border border-slate-150 rounded-2xl p-4 flex gap-4 items-start relative bg-slate-50/50">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border shrink-0 bg-slate-200">
                    <img src={camp.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate space-y-1">
                    <h4 className="font-display font-bold text-slate-800 text-xs truncate">{camp.title}</h4>
                    <p className="font-mono text-[9px] text-slate-500 font-extrabold flex items-center gap-1">
                      <MapPin size={10} className="text-rose-500" /> {camp.location} • {camp.date}
                    </p>
                    <p className="text-[10px] text-slate-450 line-clamp-2">{camp.description}</p>
                    <div className="flex gap-1 items-center font-mono text-[9px] text-indigo-650 font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-100 mt-1 max-w-max">
                      👔 {camp.itemsDonated} Delivered
                    </div>
                  </div>

                  <div className="absolute top-2.5 right-2.5 flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setEditingCampaign(camp)}
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-650 cursor-pointer"
                      title="Edit coordinates/copy"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(camp.id)}
                      className="p-1 hover:bg-rose-50 rounded-lg text-rose-500"
                      title="Delete Campaign Spot"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT CAMPAIGN MODAL FORM */}
          {editingCampaign && (
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-3xl p-6 text-left space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-indigo-150">
                <p className="font-display font-black text-slate-800 text-sm">Edit regional Spot Map Settings</p>
                <button onClick={() => setEditingCampaign(null)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Campaign Title</label>
                    <input
                      type="text"
                      value={editingCampaign.title}
                      onChange={e => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-550 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Location (City, ST)</label>
                      <input
                        type="text"
                        value={editingCampaign.location}
                        onChange={e => setEditingCampaign({ ...editingCampaign, location: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-550"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Donation counts</label>
                      <input
                        type="number"
                        value={editingCampaign.itemsDonated}
                        onChange={e => setEditingCampaign({ ...editingCampaign, itemsDonated: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 font-sans">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Overview Copy</label>
                    <textarea
                      rows={3}
                      value={editingCampaign.description}
                      onChange={e => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-550 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Banner Illustration</label>
                    <div className="w-full aspect-video border rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center relative">
                      <img src={editingCampaign.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Image Address URL</label>
                    <input
                      type="text"
                      value={editingCampaign.imageUrl}
                      onChange={e => setEditingCampaign({ ...editingCampaign, imageUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-indigo-550 focus:outline-none"
                    />
                  </div>

                  {/* Local image conversion for campaigns */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Or Upload Custom Image File</label>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'editingCampaign')}
                        className="hidden" 
                        id="editing-campaign-image-file" 
                      />
                      <label 
                        htmlFor="editing-campaign-image-file"
                        className="flex-1 border bg-white hover:bg-slate-50 py-2 rounded-xl text-center text-xs font-semibold cursor-pointer border-slate-200 flex items-center justify-center gap-1"
                      >
                        <Upload size={13} />
                        Browse File & Auto-Convert (PNG/JPG)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-indigo-150">
                <button
                  onClick={handleSaveCampaign}
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Save size={14} />
                  <span>Save Location details</span>
                </button>
                <button
                  onClick={() => setEditingCampaign(null)}
                  className="px-6 py-3 bg-white text-slate-500 font-semibold rounded-xl text-xs border border-slate-200 cursor-pointer hover:bg-slate-50"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: SITE METRICS & USER LEVELS TESTER */}
      {activeSubTab === 'metrics' && (
        <div className="space-y-6">

          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-6">
            <h3 className="font-display font-black text-slate-800 text-sm pb-2.5 border-b flex items-center gap-2">
              <Award size={16} className="text-amber-500" /> Virtual Impact Metrics Live Override
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>衣服捐赠总数 (Total Clothing Donable Count)</span>
                    <span className="font-mono text-indigo-600 font-bold">{donationStats.totalDonated.toLocaleString()} Items</span>
                  </label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="500"
                      value={donationStats.totalDonated}
                      onChange={e => handleUpdateStat('totalDonated', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                    />
                    <input
                      type="number"
                      value={donationStats.totalDonated}
                      onChange={e => handleUpdateStat('totalDonated', parseInt(e.target.value) || 0)}
                      className="w-20 bg-slate-50 border px-2 py-1 text-xs font-mono text-right rounded-lg focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Instantly drives the big primary dashboard badge on the "Donation Impact Map" tab!</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>支持的家庭数 (Families Supported)</span>
                    <span className="font-mono text-emerald-700 font-bold">{donationStats.familiesSupported.toLocaleString()} Families</span>
                  </label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="range"
                      min="50"
                      max="30000"
                      step="100"
                      value={donationStats.familiesSupported}
                      onChange={e => handleUpdateStat('familiesSupported', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <input
                      type="number"
                      value={donationStats.familiesSupported}
                      onChange={e => handleUpdateStat('familiesSupported', parseInt(e.target.value) || 0)}
                      className="w-20 bg-slate-50 border px-2 py-1 text-xs font-mono text-right rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Outreach Spots Count</span>
                    <span className="font-mono text-rose-600 font-bold">{donationStats.activeCampaigns} Places</span>
                  </label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={donationStats.activeCampaigns}
                      onChange={e => handleUpdateStat('activeCampaigns', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-550"
                    />
                    <input
                      type="number"
                      value={donationStats.activeCampaigns}
                      onChange={e => handleUpdateStat('activeCampaigns', parseInt(e.target.value) || 0)}
                      className="w-20 bg-slate-50 border px-2 py-1 text-xs font-mono text-right rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex justify-between">
                    <span>Distributed Star Coins</span>
                    <span className="font-mono text-amber-700 font-bold">{donationStats.pointsDistributed.toLocaleString()} Stars</span>
                  </label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="range"
                      min="500"
                      max="50000"
                      step="500"
                      value={donationStats.pointsDistributed}
                      onChange={e => handleUpdateStat('pointsDistributed', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <input
                      type="number"
                      value={donationStats.pointsDistributed}
                      onChange={e => handleUpdateStat('pointsDistributed', parseInt(e.target.value) || 0)}
                      className="w-20 bg-slate-50 border px-2 py-1 text-xs font-mono text-right rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4 text-left">
            <h3 className="font-display font-black text-slate-800 text-sm pb-2 border-b">Active User Account Simulator Settings</h3>
            <p className="text-slate-400 text-xs">Simulate user profile details dynamically to test coins logic, levels rewards modal triggers, and ranks configurations easily.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-sans">
              
              <div className="p-4 border rounded-2xl space-y-3 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-800">Star Coins Wallet Balance</div>
                <div className="text-xl font-mono text-indigo-650 font-black">💰 {userProfile.starCoins} Stars</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateUserCoin(200)}
                    className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer text-center"
                  >
                    +200 Coins
                  </button>
                  <button
                    onClick={() => handleUpdateUserCoin(-200)}
                    className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg cursor-pointer text-center"
                  >
                    -200 Coins
                  </button>
                </div>
              </div>

              <div className="p-4 border rounded-2xl space-y-3 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-800">Kid Level Override Simulator</div>
                <div className="text-xl font-mono text-amber-600 font-extrabold">👑 Level {userProfile.level}</div>
                <div className="flex gap-1.5">
                  {[2, 4, 7, 10].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => handleSetUserLevel(lvl)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        userProfile.level === lvl 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      Lv.{lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border rounded-2xl space-y-3 bg-slate-50/50">
                <div className="text-xs font-bold text-slate-800">Simulated Profile Avatar</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border flex items-center justify-center text-xl shadow-inner select-none">
                    {userProfile.avatar}
                  </div>
                  <div className="text-xs font-bold text-slate-850 truncate">{userProfile.name}</div>
                </div>
                <div className="flex gap-1">
                  {['👦', '👧', '🐨', '🦄', '🦁', '🐼'].map(av => (
                    <button
                      key={av}
                      onClick={() => setUserProfile(p => ({ ...p, avatar: av }))}
                      className={`w-7 h-7 text-xs flex items-center justify-center border rounded-lg hover:bg-slate-100 cursor-pointer ${
                        userProfile.avatar === av ? 'border-indigo-600 bg-indigo-50/25' : 'border-slate-200 bg-white'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 4: COMMUNITY POST MODERATOR */}
      {activeSubTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border rounded-2xl gap-3 text-left">
            <div>
              <p className="font-extrabold text-slate-800 text-sm">Community feed moderator stream</p>
              <p className="text-slate-400 text-xs mt-0.5">Edit community timeline updates, delete unrequested notes, or draft official admin announcements instantly.</p>
            </div>
            <button
              onClick={handleAddOfficialAnnouncement}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow hover:scale-[1.02] active:scale-95"
            >
              <Plus size={13} />
              <span>Post Official Announcement</span>
            </button>
          </div>

          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4 text-left">
            <h3 className="font-display font-black text-slate-800 text-sm pb-2 border-b">Moderate Feed Stream Posts ({posts.length})</h3>
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="border border-slate-150 rounded-2xl p-4 flex justify-between items-start bg-slate-50/40 hover:bg-slate-50 transition">
                  <div className="flex items-start gap-3 w-5/6">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-xs mt-0.5 border shrink-0">
                      {post.userAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-850">{post.userName}</span>
                        {post.userBadge && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold rounded-md">
                            {post.userBadge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">{post.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-650 mt-1.5 leading-relaxed font-sans">{post.text}</p>
                      
                      {post.imageUrl && (
                        <div className="w-24 mt-2.5 rounded-lg border overflow-hidden bg-slate-200 max-h-16">
                          <img src={post.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      {post.customDesign && (
                        <div className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 font-mono inline-block mt-2 font-bold">
                          🎨 Saved Custom {post.customDesign.template.toUpperCase()} Model
                        </div>
                      )}

                      <div className="flex items-center gap-3.5 text-slate-400 text-[10px] font-mono mt-3.5">
                        <span className="flex items-center gap-1">❤️ {post.likes} Likes</span>
                        <span className="flex items-center gap-1">💬 {post.comments?.length || 0} Comments</span>
                        <span className="flex items-center gap-1">🔁 {post.shares || 0} Shares</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-550 rounded-lg text-[10px] font-mono font-extrabold border border-rose-200 transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Usage Warning */}
      <div className="bg-slate-50 border rounded-2xl p-4 flex gap-3 text-slate-500 text-xs font-sans max-w-xl mx-auto">
        <span className="text-lg">📢</span>
        <div>
          <p className="font-bold text-slate-800">Administrative Sandbox Scope Notice</p>
          <p className="text-slate-400 mt-1 leading-relaxed">All changes made through this control panel write directly to active react states. No remote databases are harmed, which enables seamless live demonstrations of the buying catalogs, map hot-spots, and level congratulation loops!</p>
        </div>
      </div>

    </div>
  );
}

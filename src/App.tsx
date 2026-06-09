/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, SocialPost, DailyTask, DonationStats, UserProfile, CustomDesign } from './types';
import { STORE_PRODUCTS, REWARDS_PRODUCTS, INITIAL_POSTS, INITIAL_TASKS, INITIAL_LEADERBOARD, HERO_CAMPAIGNS } from './data/products';

import Storefront from './components/Storefront';
import AdminPanel from './components/AdminPanel';
import CustomPrintLab from './components/CustomPrintLab';
import CommunityFeed from './components/CommunityFeed';
import Arcade from './components/Arcade';
import ImpactTracker from './components/ImpactTracker';
import RewardsStore from './components/RewardsStore';
import Cart from './components/Cart';
import Leaderboard from './components/Leaderboard';
import LoginScreen from './components/LoginScreen';
import BrandLogo from './components/LiveLogo';
import AdBlock from './components/AdBlock';
import ProfileSection from './components/ProfileSection';

import { ShoppingBag, Palette, Users, Trophy, Compass, Award, Gift, LogIn, ChevronRight, UserCircle, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Firebase core sync capabilities
import { auth, isFirebaseSupported, signOut } from './firebase';
import { 
  syncUserProfile, 
  saveUserProfile, 
  syncProducts, 
  saveProduct, 
  deleteProduct, 
  syncPosts, 
  savePost, 
  deletePost, 
  syncCampaigns, 
  saveCampaign, 
  deleteCampaign, 
  syncTasks, 
  saveTask, 
  syncDonationStats, 
  saveDonationStats 
} from './lib/dbSync';

export default function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'custom-lab' | 'feed' | 'arcade' | 'impact' | 'rewards' | 'cart' | 'ranks' | 'admin' | 'profile'>('shop');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('curr-user');
  
  // Dynamic administrative state containers
  const [storeProducts, setStoreProducts] = useState<Product[]>(STORE_PRODUCTS);
  const [rewardsProducts, setRewardsProducts] = useState<Product[]>(REWARDS_PRODUCTS);
  const [campaigns, setCampaigns] = useState<any[]>(HERO_CAMPAIGNS);
  
  // User profile credentials states
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Kaushik Creates',
    email: 'kaushikcreates@gmail.com',
    level: 3,
    xp: 40,
    maxXp: 100,
    starCoins: 420,
    avatar: '👦',
    totalImpactCount: 14,
    rankName: 'Community Advocate'
  });

  // Shopping list cart states
  const [cart, setCart] = useState<CartItem[]>([]);

  // Social updates timelines posts state list
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);

  // Daily gaming tasks challenge checklists states
  const [tasks, setTasks] = useState<DailyTask[]>(INITIAL_TASKS);

  // Unlocked marketplace assets redeemed state lists
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [levelUpCongrats, setLevelUpCongrats] = useState<number | null>(null);

  // Donation Stats matches counter states
  const [donationStats, setDonationStats] = useState<DonationStats>({
    totalDonated: 14821,
    familiesSupported: 3705,
    activeCampaigns: 3,
    pointsDistributed: 12560
  });

  // Real-time synchronization setup
  useEffect(() => {
    if (!isLoggedIn) return;

    // 1. Sync User Profile
    const unsubProfile = syncUserProfile(currentUserId, userProfile, (profile) => {
      setUserProfile(profile);
    });

    // 2. Sync Products (both storefront catalogs & kids rewards catalogs)
    const unsubProducts = syncProducts((store, rewards) => {
      setStoreProducts(store);
      setRewardsProducts(rewards);
    });

    // 3. Sync Social Feed Updates
    const unsubPosts = syncPosts((loadedPosts) => {
      setPosts(loadedPosts);
    });

    // 4. Sync Outreach Impact Campaigns
    const unsubCampaigns = syncCampaigns((loadedCamps) => {
      setCampaigns(loadedCamps);
    });

    // 5. Sync Gaming Tasks Checklists
    const unsubTasks = syncTasks((loadedTasks) => {
      setTasks(loadedTasks);
    });

    // 6. Sync Global Donation Progress Stats
    const unsubStats = syncDonationStats((loadedStats) => {
      setDonationStats(loadedStats);
    });

    return () => {
      unsubProfile();
      unsubProducts();
      unsubPosts();
      unsubCampaigns();
      unsubTasks();
      unsubStats();
    };
  }, [isLoggedIn, currentUserId])  // Level Up logic handler
  const handleAddXp = (xpGained: number) => {
    setUserProfile((prev) => {
      let nextXp = prev.xp + xpGained;
      let nextLevel = prev.level;
      let nextMaxXp = prev.maxXp;

      if (nextXp >= nextMaxXp) {
        nextLevel += 1;
        nextXp = nextXp - nextMaxXp;
        nextMaxXp = Math.floor(nextMaxXp * 1.5);
        // Level up feedback
        setTimeout(() => setLevelUpCongrats(nextLevel), 400);
      }

      // Automatically update rank name based on level
      let rank = 'Community Helper';
      if (nextLevel >= 4) rank = 'Eco-Warrior';
      if (nextLevel >= 6) rank = 'Circular Master';
      if (nextLevel >= 8) rank = 'Outreach Hero';

      const updated = {
        ...prev,
        level: nextLevel,
        xp: nextXp,
        maxXp: nextMaxXp,
        rankName: rank
      };
      saveUserProfile(currentUserId, updated);
      return updated;
    });
  };

  // Award Coins directly from gaming operations
  const handleAwardCoins = (coins: number, xp: number) => {
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        starCoins: prev.starCoins + coins
      };
      saveUserProfile(currentUserId, updated);
      return updated;
    });
    handleAddXp(xp);
  };

  // Task progress list actions completion marker
  const handleCompleteTask = (taskId: string, coinsEarned: number, xpEarned: number) => {
    setTasks((prev) => {
      const next = prev.map((tk) => {
        if (tk.id === taskId && !tk.isCompleted) {
          const finished = {
            ...tk,
            progress: tk.maxProgress,
            isCompleted: true
          };
          saveTask(finished);
          return finished;
        }
        return tk;
      });
      return next;
    });
    // Award coins and experience
    handleAwardCoins(coinsEarned, xpEarned);
  };

  // Social feed activities: Like post
  const handleLikePost = (postId: string) => {
    setPosts((prev) => {
      const next = prev.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByUser;
          // Award coins for first liking to engage
          if (liked && !post.likedByUser) {
            setUserProfile(u => {
              const updated = { ...u, starCoins: u.starCoins + 10 };
              saveUserProfile(currentUserId, updated);
              return updated;
            });
          }
          const updatedPost = {
            ...post,
            likedByUser: liked,
            likes: liked ? post.likes + 1 : post.likes - 1
          };
          savePost(updatedPost);
          return updatedPost;
        }
        return post;
      });
      return next;
    });
  };

  // Social feed comments
  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: 'comment-' + Date.now(),
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      text: commentText,
      timestamp: 'Just now'
    };
    setPosts((prev) => {
      const next = prev.map((post) => {
        if (post.id === postId) {
          const updatedPost = {
            ...post,
            comments: [...post.comments, newComment]
          };
          savePost(updatedPost);
          return updatedPost;
        }
        return post;
      });
      return next;
    });
    // Give 15 coins for commenting
    setUserProfile(u => {
      const updated = { ...u, starCoins: u.starCoins + 15 };
      saveUserProfile(currentUserId, updated);
      return updated;
    });
  };

  // Create customized posts in Social Feed
  const handleAddPost = (text: string) => {
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      userId: currentUserId,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      userBadge: '🌟 ' + userProfile.rankName,
      timestamp: 'Just now',
      text: text,
      likes: 0,
      comments: [],
      shares: 0
    };
    savePost(newPost);
    setPosts([newPost, ...posts]);
    setUserProfile(u => {
      const updated = { ...u, starCoins: u.starCoins + 75 };
      saveUserProfile(currentUserId, updated);
      return updated;
    });
    handleAddXp(40);
  };

  // When they custom design inside Print Lab and share as draft
  const handlePostCustomDesign = (design: CustomDesign) => {
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      userId: currentUserId,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      userBadge: '🎨 ' + userProfile.rankName,
      timestamp: 'Just now',
      text: `Drafted a custom ${design.template} model in the design lab! Base shade is "${design.color}". Stitched the Slogan phrase "${design.text || 'None'}" over the Y-axis. Matching +1 clothing donation drop! Organic GOTS quality guaranteed.`,
      customDesign: design,
      likes: 0,
      comments: [],
      shares: 0
    };
    savePost(newPost);
    setPosts([newPost, ...posts]);
    setUserProfile(u => {
      const updated = { ...u, starCoins: u.starCoins + 75 };
      saveUserProfile(currentUserId, updated);
      return updated;
    });
    handleAddXp(45);
    handleCompleteTask('task-feed-post', 75, 40);
  };

  // Redemptions from reward stores
  const handleSpendCoins = (amount: number, rewardName: string) => {
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        starCoins: prev.starCoins - amount
      };
      saveUserProfile(currentUserId, updated);
      return updated;
    });
    // Note: unblocking coupons doesn't occupy clothes cart space, but tracks rewards unlocked list
    setUnlockedRewards([...unlockedRewards, rewardName]);
  };

  // eCommerce Add item to Cart
  const handleAddToCart = (p: Product, size: string) => {
    const cartLineId = `${p.id}_${size}`;
    setCart((prev) => {
      const existing = prev.find((it) => it.id === cartLineId);
      if (existing) {
        return prev.map((it) => (it.id === cartLineId ? { ...it, quantity: it.quantity + 1 } : it));
      }
      return [
        ...prev,
        {
          id: cartLineId,
          product: p,
          selectedSize: size,
          quantity: 1
        }
      ];
    });
  };

  // Print Lab Add custom item to Cart
  const handleAddCustomToCart = (design: CustomDesign, price: number) => {
    const customProd: Product = {
      id: `custom_${design.template}_${Date.now()}`,
      name: `Custom Lab GOTS ${design.template.toUpperCase()}`,
      description: `Specially customized organic breathable apparel. Custom printed text: "${design.text}"`,
      price: price,
      category: 'Custom Prints',
      imageUrl: design.template === 'mug' ? '☕' : design.template === 'hat' ? '🧢' : '👕',
      rating: 5.0
    };

    setCart((prev) => [
      ...prev,
      {
        id: `custom_line_${Date.now()}`,
        product: customProd,
        selectedSize: design.size || 'M',
        selectedColor: design.color,
        quantity: 1,
        customDesign: design
      }
    ]);
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart(cart.filter((it) => it.id !== itemId));
  };

  const handleUpdateCartQty = (itemId: string, qty: number) => {
    setCart(cart.map((it) => (it.id === itemId ? { ...it, quantity: qty } : it)));
  };

  // Finalize order simulator checkout
  const handleCheckout = () => {
    const itemsCount = cart.reduce((acc, it) => acc + it.quantity, 0);
    const totalOrderAmount = cart.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);
    
    // Updates donation stats
    const nextStats = {
      ...donationStats,
      totalDonated: donationStats.totalDonated + itemsCount,
      familiesSupported: donationStats.familiesSupported + Math.ceil(itemsCount / 3),
      pointsDistributed: donationStats.pointsDistributed + (itemsCount * 150)
    };
    setDonationStats(nextStats);
    saveDonationStats(nextStats);

    const orderItems = cart.map(it => ({
      parentProductTitle: it.product.name,
      quantity: it.quantity,
      details: `${it.selectedColor ? 'Color: ' + it.selectedColor + ', ' : ''}${it.selectedSize ? 'Size: ' + it.selectedSize : ''}`,
      price: it.product.price,
    }));

    const newOrder = {
      id: `LCC-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      items: orderItems,
      totalAmount: totalOrderAmount,
      status: 'Outreach Processing' as const,
      trackingNumber: `TRK-CO2-${Math.floor(10000 + Math.random() * 90000)}`,
      shippingAddress: userProfile.shippingAddress
    };

    // Award rewards profile coins/XP and add order to purchase history
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        starCoins: prev.starCoins + 150,
        totalImpactCount: prev.totalImpactCount + itemsCount,
        orders: [newOrder, ...(prev.orders || [])]
      };
      saveUserProfile(currentUserId, updated);
      return updated;
    });
    handleAddXp(80);

    // Clears active cart
    setCart([]);
    setActiveTab('profile'); // Switch tab to show the placed order!
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans overflow-x-hidden antialiased text-slate-800">
      
      {/* Top Notification Promo banner for Charity */}
      <div className="bg-slate-900 text-white py-2 text-center text-[11px] font-mono select-none tracking-wider font-semibold border-b border-indigo-950 flex items-center justify-center gap-1">
        👕 EVERY PURCHASE MATCHES A NEW APPAREL GIFT TO OTHERS INDEED • <span className="text-emerald-400">YOU BUY 1, WE DONATE 1</span> 🌱
      </div>

      {!isLoggedIn ? (
        <LoginScreen 
          onLoginSuccess={(profile, userId) => {
            if (userId) {
              setCurrentUserId(userId);
            }
            setUserProfile(profile);
            setIsLoggedIn(true);
          }}
        />
      ) : (
        <>
          {/* Main Core Brand Header navbar panel */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Brand Logo and Title */}
              <div onClick={() => setActiveTab('shop')} className="cursor-pointer hover:opacity-90 transition shrink-0">
                <BrandLogo />
              </div>

              {/* Top-Right Actions (Profile Progress, Cart and Account Button) */}
              <div className="flex flex-wrap items-center justify-end gap-3 ml-auto w-full md:w-auto select-none">
                
                {/* Gamified Kids Level Progress Ribbon banner (Clickable to view Profile) */}
                <div 
                  onClick={() => setActiveTab('profile')}
                  title="View your Detailed Environmental Profile & Orders"
                  className={`flex gap-3 items-center bg-slate-50/90 hover:bg-slate-100 border transition rounded-2xl px-3.5 py-1.5 text-xs cursor-pointer ${
                    activeTab === 'profile' ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-150 flex items-center justify-center text-lg shrink-0">
                    {userProfile.avatar}
                  </div>
                  <div className="space-y-0.5 pr-1">
                    <div className="flex justify-between items-center gap-3 text-[10px] font-mono leading-none">
                      <span className="font-extrabold text-slate-800 truncate max-w-[100px]">{userProfile.name}</span>
                      <span className="text-indigo-650 font-black">Lv.{userProfile.level}</span>
                    </div>
                    <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-pink via-brand-orange to-indigo-650 transition-all duration-700"
                        style={{ width: `${(userProfile.xp / userProfile.maxXp) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-l border-slate-200 pl-3 shrink-0 font-mono text-center flex flex-col items-center">
                    <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">STARS</span>
                    <span className="text-xs font-black text-emerald-700">💰{userProfile.starCoins}</span>
                  </div>
                </div>

                {/* Always-Visible Top Right Cart Button */}
                <button
                  id="top-header-cart-btn"
                  onClick={() => setActiveTab('cart')}
                  className={`relative flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-extrabold font-display cursor-pointer transition border shrink-0 ${
                    activeTab === 'cart'
                      ? 'bg-indigo-650 border-indigo-650 text-white hover:bg-indigo-750'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>🛒</span>
                  <span className="hidden sm:inline text-[11px]">Cart</span>
                  <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] text-white font-mono font-black ${
                    cart.length > 0 ? 'bg-rose-500 animate-bounce' : 'bg-slate-400'
                  }`}>
                    {cart.reduce((ac, it) => ac + it.quantity, 0)}
                  </span>
                </button>

                {/* Always-Visible Top Right Profile & Settings Button */}
                <button
                  id="top-header-profile-btn"
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-1 py-2 px-3.5 rounded-xl text-[11px] font-extrabold font-display cursor-pointer transition border shrink-0 ${
                    activeTab === 'profile'
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <UserCircle size={13} />
                  <span className="hidden sm:inline">Profile</span>
                </button>

                {/* Small Logout shortcut */}
                <button 
                  onClick={() => {
                    if (isFirebaseSupported && auth) {
                      signOut(auth).catch((err) => console.error('SignOut error:', err));
                    }
                    setIsLoggedIn(false);
                  }}
                  title="Log out of Profile"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition cursor-pointer shrink-0"
                >
                  <LogOut size={13} />
                </button>

              </div>

            </div>

        {/* Categories Tab Navigation Header Grid */}
        <div className="bg-slate-50 border-t border-slate-100 font-display">
          <nav className="max-w-6xl mx-auto px-4 flex flex-wrap gap-2 py-2.5 items-center justify-start select-none">
            {[
              { id: 'shop', label: 'Store Catalog', icon: ShoppingBag },
              { id: 'custom-lab', label: 'Custom Print Lab', icon: Palette },
              { id: 'feed', label: 'Community Feed', icon: Users },
              { id: 'arcade', label: 'Arcade Arena', icon: Trophy },
              { id: 'ranks', label: 'Leaderboard Tiers', icon: Award },
              { id: 'impact', label: 'Donation Impact Map', icon: Compass },
              { id: 'rewards', label: 'Rewards Ecostore', icon: Gift },
            ].concat(userProfile.isAdmin ? [{ id: 'admin', label: 'Admin Panel ⚙️', icon: Shield }] : []).map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-bold cursor-pointer shrink-0 transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs animate-pulse-once'
                      : 'text-slate-505 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent hover:border-slate-200/40'
                  }`}
                >
                  <TabIcon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container contents panel */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {activeTab === 'shop' && (
              <Storefront products={storeProducts} onAddToCart={handleAddToCart} cartItemsCount={cart.length} />
            )}

            {activeTab === 'custom-lab' && (
              <CustomPrintLab
                onAddCustomToCart={handleAddCustomToCart}
                onPostToFeed={handlePostCustomDesign}
                currentCoins={userProfile.starCoins}
              />
            )}

            {activeTab === 'feed' && (
              <CommunityFeed
                posts={posts}
                onAddPost={handleAddPost}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                userAvatar={userProfile.avatar}
                userName={userProfile.name}
              />
            )}

            {activeTab === 'arcade' && (
              <Arcade
                tasks={tasks}
                onCompleteTask={handleCompleteTask}
                userCoins={userProfile.starCoins}
                onAwardCoins={handleAwardCoins}
              />
            )}

            {activeTab === 'ranks' && (
              <Leaderboard
                entries={INITIAL_LEADERBOARD}
                currentUserScore={userProfile.starCoins}
                onRewardCoins={(c) => handleAwardCoins(c, 10)}
              />
            )}

            {activeTab === 'impact' && (
              <ImpactTracker stats={donationStats} campaigns={campaigns} />
            )}

            {activeTab === 'rewards' && (
              <RewardsStore
                products={rewardsProducts}
                currentCoins={userProfile.starCoins}
                onSpendCoins={handleSpendCoins}
                unlockedRewards={unlockedRewards}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                storeProducts={storeProducts}
                setStoreProducts={setStoreProducts}
                rewardsProducts={rewardsProducts}
                setRewardsProducts={setRewardsProducts}
                donationStats={donationStats}
                setDonationStats={setDonationStats}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                campaigns={campaigns}
                setCampaigns={setCampaigns}
                posts={posts}
                setPosts={setPosts}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileSection
                userProfile={userProfile}
                onUpdateProfile={(updated) => {
                  setUserProfile(updated);
                  saveUserProfile(currentUserId, updated);
                }}
              />
            )}

            {activeTab === 'cart' && (
              <Cart
                items={cart}
                onRemoveItem={handleRemoveCartItem}
                onUpdateQty={handleUpdateCartQty}
                onCheckout={handleCheckout}
                userCoins={userProfile.starCoins}
              />
            )}

            {/* Premium, eco-conscious non-intrusive Sponsorship Ad blocks on each page */}
            <div className="mt-12 pt-6 border-t border-slate-150">
              <AdBlock pageId={activeTab} onEarnCoins={(c, x) => handleAwardCoins(c, x)} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
        </>
      )}

      {/* Ground Brand footer info layouts */}
      <footer className="bg-slate-900 text-slate-100 border-t border-slate-950 py-12 px-6 mt-16 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Footers Branding */}
          <div className="space-y-3.5 select-none text-left">
            <BrandLogo />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We leverage local textile printing shops, organic materials standard rules, and gamified community outreach systems to establish real-time item matching programs.
            </p>
            <p className="font-mono text-[9px] text-indigo-400 font-bold tracking-widest uppercase">
              "MORE THAN CLOTHING" • "YOU WEAR IT. WE SHARE IT."
            </p>
          </div>

          {/* 2. Footers GOTS certifications */}
          <div className="space-y-2.5 text-left text-xs text-slate-400">
            <h4 className="font-display font-bold text-slate-200">GOTS Organic Credentials</h4>
            <p className="leading-relaxed">All standard raw cotton is certified to Global Organic Textile Standards, insuring fair wages, water retention, and circular chemical safety.</p>
            <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px] font-semibold text-indigo-400">
              <span>#ZeroPlastic</span>
              <span>•</span>
              <span>#BiodegradableInk</span>
              <span>•</span>
              <span>#LocalPrinting</span>
            </div>
          </div>

          {/* 3. Footers Outreach details contact */}
          <div className="space-y-2.5 text-left text-xs text-slate-400">
            <h4 className="font-display font-bold text-slate-200">Charity & Drop Outreach</h4>
            <p className="leading-relaxed">Need custom print packages for local groups, corporate volunteering drops, or sheltering program drops? Reach out directly via email.</p>
            <p className="font-mono text-indigo-305 font-bold mt-1 block">💌 team@livecustomclothing.com</p>
          </div>

        </div>

        {/* Underlay legal copyright */}
        <div className="max-w-6xl mx-auto border-t border-slate-850 mt-10 pt-4 text-center text-slate-400 text-[10px] font-mono flex flex-col sm:flex-row justify-between items-center select-none gap-2">
          <span>© 12026 Live Custom Clothing. All Rights Reserved.</span>
          <span className="flex items-center gap-1">🔒 256-bit Simulated Payment Escrow Verified</span>
        </div>
      </footer>

      {/* Level Up Congrats Modal */}
      <AnimatePresence>
        {levelUpCongrats !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-5 animate-in fade-in duration-300"
            >
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-4xl mx-auto shadow-md animate-bounce">
                👑
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-black text-xl text-slate-850">Level Up Complete!</h3>
                <p className="text-xs font-mono font-bold text-indigo-650 uppercase tracking-widest">YOU REACHED STAR LEVEL {levelUpCongrats}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Awesome effort! You've unlocked higher premium print lab colors and unique sticker drop presets. Keep up the amazing circular outreach!
              </p>
              <button
                onClick={() => setLevelUpCongrats(null)}
                className="w-full bg-indigo-650 hover:bg-indigo-750 text-white font-sans text-xs font-bold py-3.5 px-4 rounded-xl cursor-pointer transition shadow active:scale-95"
              >
                Awesome, Keep Going!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

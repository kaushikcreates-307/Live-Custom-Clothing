/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const STORE_PRODUCTS: Product[] = [
  {
    id: 'ct-navy',
    name: 'Unisex Classic Tee - Organic Navy',
    description: 'Ultra-soft 100% GOTS organic cotton tee. Double-stitched seams and ringspun fabric for exceptional durability and comfort. Breathable, non-toxic water-based color perfect for sensitive skin.',
    price: 24.99,
    category: 'T-Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    isPopular: true,
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#1e3a8a', '#1e293b', '#dc2626']
  },
  {
    id: 'ct-unisex-gray',
    name: 'Crewneck Sweater - Heather Gray',
    description: 'Cozy combed organic fleece sweatshirt, perfect for cool days and casual layered outfits. Features double-knit rib cuffs, active collar line, and natural cotton insulation.',
    price: 39.99,
    category: 'Hoodies',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    isPopular: true,
    stock: 28,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#94a3b8', '#0f172a', '#15803d']
  },
  {
    id: 'ct-hoodie-black',
    name: 'Signature Full-Zip Eco Hoodie',
    description: 'Relaxed-fit everyday heavyweight full-zip hoodie made with recycled cotton and polyester blend. Incredibly plush double-brushed inner fleece, utility pockets, and premium metal hardware.',
    price: 49.99,
    category: 'Hoodies',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600',
    stock: 35,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#0f172a', '#b91c1c', '#0369a1']
  },
  {
    id: 'ct-joggers-dark',
    name: 'Active Joggers - Charcoal',
    description: 'Tailored-fit athletic joggers designed from premium circular organic cotton with a touch of flexibility. Built with secure zip pockets, flat-drawstring waistband, and soft ankle cuffs.',
    price: 34.99,
    category: 'Joggers',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    stock: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#334155', '#0f172a']
  },
  {
    id: 'ct-jacket-wind',
    name: 'Eco-Weave Weatherproof Jacket',
    description: 'Fully seam-sealed waterproof windbreaker created entirely from recycled ocean plastics. Packed with safety reflector highlights, adjustable hood stabilizers, and breathable underarm vents.',
    price: 59.99,
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    stock: 18,
    sizes: ['M', 'L', 'XL'],
    colors: ['#111827', '#0284c7', '#059669']
  },
  {
    id: 'ct-hat-snap',
    name: 'Vintage Recycled Snapback Hat',
    description: 'Retro structured six-panel baseball cap. Features dynamic moisture-wicking certified organic sweatband, structured matching visor, and adjustable double-snapback clasp.',
    price: 18.99,
    category: 'Hats',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    stock: 50,
    sizes: ['One Size'],
    colors: ['#0f172a', '#1e3a8a', '#eab308']
  },
  {
    id: 'ct-corporate-polos',
    name: 'Classic Organic Piqué Polo',
    description: 'Executive-quality double-knit cotton polo, customized for business campaigns, school programs, or team matching. Extremely soft, structured lay-flat collar, and wood-derived bio buttons.',
    price: 29.99,
    category: 'Corporate Apparel',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    stock: 120,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colors: ['#1e3a8a', '#ffffff', '#1e293b']
  },
  {
    id: 'ct-charity-green',
    name: 'Earth First Garden Charity Tee',
    description: 'Special edition Heavyweight 240GSM cotton tee with custom hand-stenciled botanical forest illustration. 100% of purchase margin funds urban youth fruit orchard initiatives in local city centers.',
    price: 28.00,
    category: 'Charity Collections',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    isPopular: true,
    stock: 40,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#166534', '#0f172a']
  }
];

export const REWARDS_PRODUCTS: Product[] = [
  {
    id: 'reward-sticker-pack',
    name: 'Community Impact Sticker Pack',
    description: 'Adorn your folders, bottles, or laptops with gorgeous glossy die-cut eco stickers displaying our brand circular slogans.',
    price: 0,
    pointsPrice: 150,
    category: 'Stickers',
    imageUrl: 'https://images.unsplash.com/photo-1572375995501-4b0894d50c69?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    isRewardOnly: true
  },
  {
    id: 'reward-badge-cleanup',
    name: 'Cleanup Hero Profile Badge',
    description: 'Add a spectacular glowing volunteer badge with special animations and sparkles directly to your user team card.',
    price: 0,
    pointsPrice: 300,
    category: 'Badges',
    imageUrl: 'https://images.unsplash.com/photo-1578351619284-8d298bc6597a?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    isRewardOnly: true
  },
  {
    id: 'reward-coupon-10',
    name: 'Custom Lab $10 Discount Coupon',
    description: 'Get $10.00 off of any item in our Custom Print Lab! Earn coins inside the interactive games to get real apparel savings.',
    price: 0,
    pointsPrice: 500,
    category: 'Coupons',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    isRewardOnly: true
  },
  {
    id: 'reward-tote-bag',
    name: 'Handcrafted Eco Tote Bag',
    description: 'Generous 12oz durable organic canvas tote bag with reinforced handles, perfect for grocery shopping, books, or beach accessories.',
    price: 0,
    pointsPrice: 800,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    isRewardOnly: true
  },
  {
    id: 'reward-beanie-wool',
    name: 'Slouchy Watch Beanie',
    description: 'Ultra-warm, ribbed knit beanie that is double-layered. Double your warmth and share your impact.',
    price: 0,
    pointsPrice: 1200,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d4353d3?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    isRewardOnly: true
  }
];

export const HERO_CAMPAIGNS = [
  {
    id: 'camp-chicago',
    title: 'Winter Warmth Outreach',
    description: 'Distributed 1,200 organic sweaters and heavy fleece knit joggers accompanied by hot community meals to three family shelter networks in critical housing districts.',
    location: 'Chicago, IL',
    itemsDonated: 1200,
    date: '2025-11-20',
    imageUrl: 'https://images.unsplash.com/photo-1489516408517-0c0a15662682?auto=format&fit=crop&q=80&w=600',
    partners: ['Englewood Hope Foundation', 'Local Shelter Alliance']
  },
  {
    id: 'camp-atlanta',
    title: 'Back to School Uniforms Drive',
    description: 'Supplied organic cotton polo shirts and comfortable circular wear to student clusters, fostering uniform equity and confidence before autumn classes start.',
    location: 'Atlanta, GA',
    itemsDonated: 950,
    date: '2025-08-15',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600',
    partners: ['Atlanta Kids Coalition', 'Metro Education Alliance']
  },
  {
    id: 'camp-detroit',
    title: 'Detroit Youth Athletics Sponsor',
    description: 'Printed bright sustainable jerseys and active athletic wear for newly launched outdoor recreational centers and sports matches in city parks.',
    location: 'Detroit, MI',
    itemsDonated: 600,
    date: '2026-04-10',
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=600',
    partners: ['Detroit Youth Athletic Club', 'Motor City Wellness']
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-captcha',
    title: 'Solve Mini-Game Captcha',
    description: 'Verify your human spirit by completing a playful Charity-themed Captcha puzzle.',
    pointsReward: 30,
    xpReward: 15,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    icon: 'ShieldCheck'
  },
  {
    id: 'task-spin',
    title: 'Try Your Luck on Spin Wheel',
    description: 'Spin the dynamic sustainability spinner to see what daily challenge you match with!',
    pointsReward: 25,
    xpReward: 10,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    icon: 'Disc'
  },
  {
    id: 'task-feed-post',
    title: 'Share a Custom Creator Idea',
    description: 'Create a custom shirt model in the Print Lab and share it to the community Feed.',
    pointsReward: 75,
    xpReward: 40,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    icon: 'Share2'
  },
  {
    id: 'task-memory-match',
    title: 'Card Memory Match Master',
    description: 'Find matching clothing category cards in the arcade flip-card game.',
    pointsReward: 40,
    xpReward: 25,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    icon: 'BrainCircuit'
  },
  {
    id: 'task-quiz-clean',
    title: 'Sustainability Quiz Extra',
    description: 'Test your green tech and circular textile recycling awareness with a quick question.',
    pointsReward: 35,
    xpReward: 20,
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    icon: 'BookOpen'
  }
];

export const INITIAL_POSTS: any[] = [
  {
    id: 'post-1',
    userId: 'user-jenny',
    userName: 'Jenny S.',
    userAvatar: '👧',
    userBadge: '🎨 Creator Pro',
    timestamp: '2 hours ago',
    text: 'Designed my first eco-friendly custom printed hoodie! 🌿 Stitched "YOU WEAR IT. WE SHARE IT." across the back in nice bright yellow. Best of all: buying it means another cozy shirt goes directly to children in local shelter shelters! 🥰',
    likes: 18,
    likedByUser: false,
    comments: [
      {
        id: 'c1',
        userName: 'Marcus K.',
        userAvatar: '👦',
        text: 'That looks so awesome! Love the custom color combination.',
        timestamp: '1 hour ago'
      }
    ],
    shares: 3,
    customDesign: {
      template: 'hoodie',
      color: '#1e293b',
      text: 'YOU WEAR IT. WE SHARE IT.',
      textColor: '#eab308',
      textSize: 20,
      textYPosition: 45
    }
  },
  {
    id: 'post-2',
    isCommunityCampaign: true,
    userId: 'lh-brand',
    userName: 'Live Custom Team (Admin)',
    userAvatar: '👑',
    userBadge: '🌟 Official Co.',
    timestamp: 'Yesterday',
    text: '🚨 AMAZING NEWS! Because of your purchases during the Earth Day Drop last month, we were able to deliver exactly 1,200 brand-new warm sweaters and custom caps to the Detroit Youth Athletics programs! Run more sports, connect kids safely. Check out the impact photos below, and track your active custom orders to see your buy-1-donate-1 live! 🏀🎒',
    likes: 124,
    likedByUser: false,
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
    comments: [
      {
        id: 'c2',
        userName: 'Parent Advocate Alliance',
        userAvatar: '👩',
        text: 'Our boys and girls are absolutely thrilled with their brand new uniforms. It unified their team and boosted self-esteem incredibly! THANK YOU!',
        timestamp: 'Yesterday'
      },
      {
        id: 'c3',
        userName: 'Spiritual Volunteer',
        userAvatar: '👨',
        text: 'Incredible work team. Lets aim for 5,000 donations next drop!',
        timestamp: '18 hours ago'
      }
    ],
    shares: 42
  },
  {
    id: 'post-3',
    userId: 'user-tommy',
    userName: 'Tommy D.',
    userAvatar: '👦',
    userBadge: '⚽ Active Volunteer',
    timestamp: '3 days ago',
    text: 'Just loaded up on Star Coins by playing Memory Match and completing the Daily Captcha check. Redeemed them for a Community Hero Laptop Sticker Pack that just arrived! It looks epic!',
    likes: 9,
    likedByUser: false,
    comments: [],
    shares: 0
  }
];

export const INITIAL_LEADERBOARD: any[] = [
  { id: 'l1', rank: 1, name: 'Ava Mitchell', avatar: '👧', level: 12, score: 2450 },
  { id: 'l2', rank: 2, name: 'Lucas Green', avatar: '👦', level: 9, score: 1980 },
  { id: 'l3', rank: 3, name: 'Oliver Spark', avatar: '🦁', level: 10, score: 1840 },
  { id: 'l4', rank: 4, name: 'Emma Cooper', avatar: '🐨', level: 8, score: 1540 },
  { id: 'l5', rank: 5, name: 'Mia Sun', avatar: '🦄', level: 7, score: 1320 },
  { id: 'l6', rank: 6, name: 'William Stone', avatar: '🐼', level: 6, score: 1150 }
];

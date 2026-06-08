/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in USD
  pointsPrice?: number; // in Live Coins (for kids rewards marketplace)
  category: string;
  imageUrl: string;
  rating: number;
  isPopular?: boolean;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  isRewardOnly?: boolean; // Available only for Live Coins
}

export type CustomPrintTemplate = 'tshirt' | 'hoodie' | 'mug' | 'hat';

export interface CustomDesign {
  template: CustomPrintTemplate;
  color: string;
  text: string;
  textColor: string;
  textSize: number;
  textYPosition: number; // percentage from top 10-90
  stickerUrl?: string;
  uploadedLogo?: string; // base64 data url from local preview upload
  size?: string;
}

export interface CartItem {
  id: string; // unique for this cart line (e.g. product_id + "_" + selectedSize + "_" + hashOfCustomDesign)
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  customDesign?: CustomDesign;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  xpReward: number;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  icon: string; // lucide icon identifier
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  timestamp: string;
  text: string;
  imageUrl?: string;
  customDesign?: CustomDesign;
  likes: number;
  likedByUser?: boolean;
  comments: Comment[];
  shares: number;
  isCommunityCampaign?: boolean;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface DonationStats {
  totalDonated: number;
  familiesSupported: number;
  activeCampaigns: number;
  pointsDistributed: number;
}

export interface ImpactCampaign {
  id: string;
  title: string;
  description: string;
  location: string;
  itemsDonated: number;
  date: string;
  imageUrl: string;
  partners: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  level: number;
  xp: number;
  maxXp: number;
  starCoins: number; // also called Live Coins
  avatar: string;
  totalImpactCount: number; // total clothes donated through their orders
  rankName: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  level: number;
  score: number; // Star Coins earned
  isCurrentUser?: boolean;
}

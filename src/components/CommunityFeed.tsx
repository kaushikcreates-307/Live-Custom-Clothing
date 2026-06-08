/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SocialPost, Comment } from '../types';
import { Heart, MessageCircle, Share2, Send, Shield, Users, Sparkles, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommunityFeedProps {
  posts: SocialPost[];
  onAddPost: (postText: string, imageBase64?: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  userAvatar: string;
  userName: string;
}

export default function CommunityFeed({
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
  userAvatar,
  userName
}: CommunityFeedProps) {
  const [newPostText, setNewPostText] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitPostFeedback, setIsSubmitPostFeedback] = useState(false);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onAddPost(newPostText);
    setNewPostText('');
    setIsSubmitPostFeedback(true);
    setTimeout(() => setIsSubmitPostFeedback(false), 2000);
  };

  const handleCommentSubmit = (postId: string) => {
    if (!newCommentText.trim()) return;
    onAddComment(postId, newCommentText);
    setNewCommentText('');
  };

  // Miniature clothing rendering for community posts containing custom creations
  const renderMiniClothing = (design: any) => {
    const fill = design.color || '#1e3a8a';
    const textFill = design.textColor || '#ffffff';
    
    // Draw miniature tshirt or hoodie vector outline
    if (design.template === 'hoodie') {
      return (
        <div className="w-24 h-24 bg-slate-900 rounded-xl p-2 border border-slate-800 flex items-center justify-center relative shadow-sm overflow-hidden group">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 30,15 L 37.5,22.5 M 70,15 L 62.5,22.5 M 50,21 L 50,90 M 87.5,27.5 L 75,42.5 L 68.7,37.5 L 68.7,90 L 31.2,90 L 31.2,37.5 L 25,42.5 L 12.5,27.5 L 35,12.5 L 65,12.5 Z"
              fill={fill}
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path
              d="M 32.5,16.2 C 32.5,2.5 45,2.5 50,8.7 C 55,2.5 67.5,2.5 67.5,16.2 C 67.5,23.7 32.5,23.7 32.5,16.2 Z"
              fill={fill}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-[10px] filter drop-shadow">🌱</span>
            <p className="text-[5px] font-bold text-center uppercase tracking-widest leading-none max-w-[50px] truncate" style={{ color: textFill }}>
              {design.text || 'Print'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-24 h-24 bg-slate-900 rounded-xl p-2 border border-slate-800 flex items-center justify-center relative shadow-sm overflow-hidden group">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M 30,10 C 32.5,13.7 36.2,15 40,15 C 44,15 47.5,13.7 50,10 M 50,10 C 52.5,13.7 56.2,15 60,15 C 63.7,15 67.5,13.7 70,10 L 92.5,25 L 82.5,40 L 72.5,35 L 72.5,90 L 27.5,90 L 27.5,35 L 17.5,40 L 7.5,25 Z"
            fill={fill}
            stroke="#cbd5e1"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          {design.stickerUrl && <span className="text-[10px] mb-0.5">🌍</span>}
          <p className="text-[5px] font-black text-center uppercase tracking-normal leading-tight max-w-[50px] break-all" style={{ color: textFill }}>
            {design.text || 'Print'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div id="community-feed-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto py-4">
      {/* 1. Share/Create New Post Side Pane */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
            <span className="font-display font-bold text-slate-800 text-sm">Create New Post</span>
          </div>
          
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div className="relative">
              <textarea
                id="feed-post-textarea"
                rows={4}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value.substring(0, 240))}
                placeholder="Share your custom print ideas or environmental feedback with our circular fashion community..."
                className="w-full bg-slate-50 border border-slate-200/85 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium placeholder-slate-400 resize-none leading-relaxed"
              />
              <span className="absolute bottom-2 right-3 font-mono text-[9px] text-slate-400">
                {newPostText.length}/240
              </span>
            </div>

            <button
              id="submit-feed-post-btn"
              type="submit"
              disabled={!newPostText.trim() || isSubmitPostFeedback}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-sans text-xs font-semibold py-2.5 px-4 rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              {isSubmitPostFeedback ? (
                <>
                  <Sparkles size={13} className="text-amber-300 animate-spin" />
                  <span>Shared Successfully! +75 Coins</span>
                </>
              ) : (
                <>
                  <PlusCircle size={13} />
                  <span>Publish to Creator Feed</span>
                </>
              )}
            </button>
          </form>

          {/* Social Guidelines footnotes */}
          <div className="border-t border-slate-100 mt-5 pt-4 space-y-3 font-sans text-xs text-slate-500">
            <div className="flex gap-2 items-start">
              <Shield size={14} className="text-indigo-500 shrink-0 mt-0.5" />
              <p className="leading-tight text-[11px] text-slate-400">Our feed is dedicated to positive climate advocacy, community cleanup coordination, and apparel creators.</p>
            </div>
            <div className="flex gap-2 items-start">
              <Users size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="leading-tight text-[11px] text-slate-400">Earn up to <b className="text-emerald-700">75 Live Coins</b> per creative concept post. Let community members rate your design drafts!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Feed Timeline Stream */}
      <div className="lg:col-span-8 space-y-5">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white border rounded-2xl p-5 shadow-xs relative transition duration-300 ${
                post.isCommunityCampaign
                  ? 'border-indigo-200 bg-radial-at-t from-indigo-50/20 via-white to-white ring-1 ring-indigo-50 shadow-sm'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Card Badge marker */}
              {post.isCommunityCampaign && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-mono font-bold rounded-full flex items-center gap-0.5 shadow-sm">
                  📢 CAMPAIGN UPDATE
                </span>
              )}

              {/* User Avatar header row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50 text-xl flex items-center justify-center shadow-inner select-none">
                  {post.userAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-slate-800 text-sm leading-none">
                      {post.userName}
                    </h4>
                    {post.userBadge && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/50 text-[9px] text-slate-500 font-medium font-sans">
                        {post.userBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {post.timestamp}
                  </span>
                </div>
              </div>

              {/* Text Area block */}
              <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4 whitespace-pre-line select-text">
                {post.text}
              </p>

              {/* Media Attachments Block if any */}
              {(post.imageUrl || post.customDesign) && (
                <div className="mb-4 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden p-4 flex justify-center items-center">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Campaign Drop"
                      className="w-full max-h-[300px] object-cover rounded-lg shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {post.customDesign && (
                    <div className="flex items-center gap-4">
                      {renderMiniClothing(post.customDesign)}
                      <div className="text-left font-sans text-xs">
                        <p className="text-slate-800 font-bold capitalize">
                          Custom {post.customDesign.template} Design Draft
                        </p>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          Base shade: {post.customDesign.color} • Print scale: {post.customDesign.textSize}px
                        </p>
                        <p className="text-indigo-600 font-semibold text-[11px] mt-1">
                          👕 Matched to "Buy 1, Donate 1" donation initiative
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions Interaction panel */}
              <div className="flex items-center gap-5 border-t border-slate-50 pt-3 text-slate-400 font-sans text-[11px] font-semibold">
                <button
                  id={`like-post-btn-${post.id}`}
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 hover:text-rose-500 transition cursor-pointer ${
                    post.likedByUser ? 'text-rose-500 font-bold' : ''
                  }`}
                >
                  <Heart size={14} fill={post.likedByUser ? 'currentColor' : 'none'} />
                  <span>{post.likes} Likes</span>
                </button>

                <button
                  id={`comment-post-toggle-${post.id}`}
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>{post.comments.length} Comments</span>
                </button>

                <span className="flex items-center gap-1 ml-auto font-mono text-[10px] text-slate-400">
                  <Share2 size={11} /> {post.shares} shares • +15 Star Coins
                </span>
              </div>

              {/* Collapsible Comments Container section */}
              {activeCommentPostId === post.id && (
                <div className="mt-4 border-t border-slate-100 pt-4 space-y-3 bg-slate-50/50 rounded-xl p-3.5">
                  <div className="space-y-2.5">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2 items-start text-xs text-slate-600">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border text-sm shrink-0 shadow-xs">
                          {comment.userAvatar}
                        </div>
                        <div className="bg-white border border-slate-100 rounded-xl p-2 flex-1 relative">
                          <p className="font-bold font-display text-slate-800 text-[11px]">{comment.userName}</p>
                          <p className="leading-snug text-slate-500 text-[10px] mt-0.5">{comment.text}</p>
                          <span className="text-[8px] font-mono text-slate-400 absolute top-2 right-2">{comment.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      id={`comment-input-${post.id}`}
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value.substring(0, 100))}
                      placeholder="Write a supportive comment..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                    <button
                      id={`submit-comment-btn-${post.id}`}
                      onClick={() => handleCommentSubmit(post.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-xl cursor-pointer transition flex items-center justify-center shadow"
                    >
                      <Send size={12} className="rotate-45" />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

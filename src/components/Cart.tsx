/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem } from '../types';
import { 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  CreditCard, 
  ShoppingBag, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Phone, 
  Receipt, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQty: (itemId: string, qty: number) => void;
  onCheckout: () => void;
  userCoins: number;
}

export default function Cart({ items, onRemoveItem, onUpdateQty, onCheckout, userCoins }: CartProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'billing' | 'ordered'>('cart');
  
  // Payment Credit Card Details state
  const [cardName, setCardName] = useState('KAUSHIK CREATES');
  const [cardNumber, setNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setExpiry] = useState('12/28');
  const [cardCvc, setCvc] = useState('123');
  
  // Shipping details address forms state
  const [shippingName, setShippingName] = useState('Kaushik Creates');
  const [shippingAddress, setShippingAddress] = useState('1300 E Lafayette St, Apartment 14B');
  const [shippingCity, setShippingCity] = useState('Detroit');
  const [shippingState, setShippingState] = useState('MI');
  const [shippingZip, setShippingZip] = useState('48207');
  const [shippingPhone, setShippingPhone] = useState('(313) 555-0144');

  // Simulation indicators
  const [isSimulatingOrder, setIsSimulatingOrder] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string>('');

  // snapshot of items for invoice
  const [orderedItemsSnapshot, setOrderedItemsSnapshot] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState('');

  const activeItems = items.length > 0 ? items : orderedItemsSnapshot;
  const subtotal = activeItems.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);
  const donationCount = activeItems.reduce((acc, it) => acc + it.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Snap order items before parent wipes them
    setOrderedItemsSnapshot([...items]);
    setOrderId('LCC-' + Math.floor(100000 + Math.random() * 900000));
    setIsSimulatingOrder(true);
    
    // Trigger multi-phase simulation delay loops
    setSimulationStatus('Verifying GOTS-organic material allocation stock...');
    setTimeout(() => {
      setSimulationStatus('Matching Buy 1 Donate 1 outreach drops (Detroit Youth Shelter)...');
      setTimeout(() => {
        setSimulationStatus('Authorizing secure simulation transaction escrow logs...');
        setTimeout(() => {
          setIsSimulatingOrder(false);
          setSimulationStatus('');
          setCheckoutStep('ordered');
          onCheckout(); // clears parent active cart & updates coins/XP/donation counters
        }, 1500);
      }, 1500);
    }, 1200);
  };

  if (items.length === 0 && checkoutStep !== 'ordered') {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto shadow-sm tracking-tight space-y-4">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 mx-auto rounded-full flex items-center justify-center text-4xl shadow-inner mb-2 select-none">
          🛒
        </div>
        <h3 className="text-xl font-display font-black text-slate-800">
          Your Shopping Cart is Empty
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto font-sans">
          Explore our sustainable GOTS organic catalog or customize apparel designs inside the Print Lab to get matched Buy 1, Donate 1 outreach items!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Simulation loading spinner overlay mask */}
      <AnimatePresence>
        {isSimulatingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-5"
            >
              <div className="relative flex justify-center items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center relative">
                  <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
                </div>
                <div className="absolute top-0 right-1/3 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-black text-slate-800 text-base">Processing Simulated Order</h4>
                <p className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-widest">SECURE PAYMENT DISPATCH</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-250/20 rounded-xl leading-relaxed">
                <p className="text-[11.5px] font-medium text-slate-600 animate-pulse">{simulationStatus}</p>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">This leverages a simulated debit escrow log. No real funds are moved.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* VIEW 1: PRE-CHECKOUT SHOPPING LIST VIEW */}
        {checkoutStep === 'cart' && (
          <motion.div
            key="cart-step-container"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left list of items column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-black text-slate-800 text-base mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShoppingBag size={18} className="text-indigo-600 animate-pulse" /> Your Selected Items
                </h3>

                <div className="space-y-5 divide-y divide-slate-100">
                  {items.map((it) => (
                    <div key={it.id} className="pt-5 first:pt-0 flex gap-4 items-start select-none">
                      {/* Product Thumbnail photoreal or fallback */}
                      <div className="w-16 h-16 bg-slate-50 border rounded-xl overflow-hidden flex justify-center items-center relative shrink-0">
                        {it.product.imageUrl && it.product.imageUrl.startsWith('http') ? (
                          <img 
                            src={it.product.imageUrl} 
                            alt={it.product.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{it.product.imageUrl || '👕'}</span>
                        )}
                        {it.customDesign && (
                          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] font-mono px-1 rounded-full border border-white">
                            LAB
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-display font-bold text-slate-800 truncate leading-snug">
                          {it.product.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5 max-w-sm line-clamp-1">
                          {it.product.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2.5 mt-1.5 text-[10px] font-mono font-bold text-slate-500">
                          {it.selectedSize && <span className="bg-slate-100 px-1.5 py-0.5 rounded">Size: {it.selectedSize}</span>}
                          {it.selectedColor && (
                            <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                              Base: <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200" style={{ backgroundColor: it.selectedColor }} />
                            </span>
                          )}
                        </div>

                        {it.customDesign?.text && (
                          <span className="text-[9px] font-mono font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md mt-2 inline-block">
                            ★ Phrase: "{it.customDesign.text}"
                          </span>
                        )}
                      </div>

                      {/* Pricing and Qty edit */}
                      <div className="text-right flex flex-col justify-between items-end h-16 shrink-0 font-sans">
                        <span className="text-xs font-bold text-slate-850 font-mono">
                          ${(it.product.price * it.quantity).toFixed(2)}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5 items-center bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                            <button
                              onClick={() => onUpdateQty(it.id, Math.max(1, it.quantity - 1))}
                              className="text-xs text-slate-400 hover:text-slate-800 transition font-black px-1.5 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-black font-mono text-slate-705 shrink-0 w-3 text-center">{it.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(it.id, it.quantity + 1)}
                              className="text-xs text-slate-400 hover:text-slate-800 transition font-black px-1.5 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            id={`remove-cart-item-btn-${it.id}`}
                            onClick={() => onRemoveItem(it.id)}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50/50 cursor-pointer transition"
                            title="Remove unit item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GOTS Sustainable Matching Details */}
              <div className="bg-emerald-50 border border-emerald-100/60 rounded-2xl p-5 flex gap-4 text-emerald-800">
                <div className="text-3xl animate-bounce shrink-0">🎁</div>
                <div className="text-xs font-sans leading-relaxed">
                  <p className="font-black text-emerald-950 flex items-center gap-1.5 text-sm">
                    <HeartHandshake size={15} /> Verified Buy-One, Donate-One Matched Drop
                  </p>
                  <p className="text-emerald-700 font-medium mt-1">
                    Your cart contains exact <b>{donationCount} GOTS Organic piece{donationCount !== 1 ? 's' : ''}</b>. This matches and triggers the local manufacturing and delivery of <b>{donationCount} brand-new children's outerwear sweaters</b> directly into urban community shelters in Detroit, MI. Thank you!
                  </p>
                </div>
              </div>
            </div>

            {/* Right Summary column */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm font-sans space-y-6">
                <h4 className="font-display font-black text-slate-805 text-sm border-b pb-2 mb-4">
                  Order Totals
                </h4>

                <div className="space-y-3.5 text-xs text-slate-500 border-b pb-4">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal items list</span>
                    <span className="font-mono text-slate-850 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Shipping & Handling</span>
                    <span className="font-mono text-emerald-600 font-bold uppercase">FREE OUTREACH MEALS MATCH</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Sales Tax (Simulated)</span>
                    <span className="font-mono text-slate-850 font-bold">$0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 text-slate-850">
                  <span className="font-display font-black text-sm">Grand Total (USD)</span>
                  <span className="text-xl font-display font-black font-mono text-slate-900">${subtotal.toFixed(2)}</span>
                </div>

                <button
                  id="checkout-proceed-btn"
                  onClick={() => setCheckoutStep('billing')}
                  className="w-full bg-indigo-650 hover:bg-indigo-750 text-white font-display text-xs font-bold py-3.5 px-4 rounded-xl cursor-pointer transition shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  Proceed to Secure Checkout <ArrowLeft size={12} className="rotate-180 shrink-0" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: SPLIT COMPREHENSIVE SHIPPING & PAYMENT BILLING FORM */}
        {checkoutStep === 'billing' && (
          <motion.div
            key="billing-step-container"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left form Shipping Information column */}
            <div className="lg:col-span-7">
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                
                {/* Shipping info block */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-display font-black text-slate-800 text-sm flex items-center gap-2 pb-2 border-b">
                    <Truck size={15} className="text-indigo-600" /> Shipping & Delivery Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Receiver Full Name</label>
                      <input
                        type="text"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1.5">
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">State / Prov</label>
                      <input
                        type="text"
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">ZIP / Postal</label>
                      <input
                        type="text"
                        value={shippingZip}
                        onChange={(e) => setShippingZip(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl flex gap-2 text-indigo-850">
                    <span className="text-[14px]">🌱</span>
                    <p className="text-[10px] leading-relaxed"><b>Shipping Notice:</b> All logistics orders are batch processed. Standard delivery utilizes regional climate-neutral electric postal carriers.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition font-bold"
                >
                  <ArrowLeft size={12} /> Back to order list
                </button>
              </form>
            </div>

            {/* Right Column: payment and summary card checkout */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Payment details credit card dashboard */}
              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl text-white space-y-5 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <h4 className="font-display font-black text-sm text-slate-200 pb-2 border-b border-slate-800 flex items-center gap-2">
                  <CreditCard size={15} className="text-emerald-400" /> Simulated Invoice Payment
                </h4>

                {/* Card graphics representation */}
                <div className="w-full bg-gradient-to-tr from-indigo-650 to-indigo-850 rounded-2xl p-4 shadow-md flex flex-col justify-between h-36 font-mono border border-indigo-550 relative">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold tracking-widest text-indigo-200">LCC SECURE ECO-DEBIT</span>
                    <CreditCard size={18} className="text-amber-300" />
                  </div>
                  
                  <div className="text-sm font-bold tracking-widest text-slate-100 my-2">
                    {cardNumber}
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="min-w-0">
                      <div className="text-[7px] text-indigo-200 uppercase leading-none">Holder</div>
                      <div className="text-xs font-bold uppercase truncate max-w-[140px] mt-0.5">{cardName}</div>
                    </div>
                    <div>
                      <div className="text-[7px] text-indigo-200 uppercase leading-none">Expiry</div>
                      <div className="text-xs font-bold mt-0.5">{cardExpiry}</div>
                    </div>
                  </div>
                </div>

                {/* Form elements for payment */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">Holder Card Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.substring(0, 22).toUpperCase())}
                      required
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">Card Digi Line</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setNumber(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase mb-1">CVC Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        maxLength={3}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono font-medium"
                      />
                    </div>
                  </div>

                  <button
                    id="simulated-secure-payment-btn"
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-display font-black text-xs py-3.5 px-4 rounded-xl cursor-pointer transition shadow active:scale-95 text-center flex items-center justify-center gap-1.5 mt-2"
                  >
                    <ShieldCheck size={14} className="text-slate-950" />
                    <span>Authorize Pay Ledger (${subtotal.toFixed(2)})</span>
                  </button>
                </form>
              </div>

              {/* Connected Order Summary Preview */}
              <div className="bg-white border rounded-2xl p-5 text-xs text-slate-500 leading-normal font-sans">
                <p className="font-bold text-slate-800 mb-1.5">Direct Drop Beneficiary Spot:</p>
                <p className="flex items-center gap-1 font-mono font-semibold text-rose-500">
                  <MapPin size={12} /> Detroit Shelter Outreach Unit (Cass Community Services)
                </p>
                <p className="mt-1.5 text-slate-400 leading-relaxed">Confirming this checkout immediately prints and allocates GOTS-organic cotton clothing in Detroit for child relief.</p>
              </div>

            </div>
          </motion.div>
        )}

        {/* VIEW 3: RICH PROFESSIONAL COMPLETED TICKET INVOICE RECEIPT */}
        {checkoutStep === 'ordered' && (
          <motion.div
            key="receipt-invoice-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto select-none"
          >
            {/* Elegant Vintage styled Receipt Canvas Sheet header */}
            <div className="bg-white border-x border-t border-slate-250/90 rounded-t-3xl p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-500" />
              
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 mx-auto rounded-full flex items-center justify-center text-4xl shadow-sm animate-bounce">
                  🎉
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-display font-black text-slate-850">
                    Order Confirmed!
                  </h3>
                  <p className="text-emerald-700 text-xs font-mono font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} strokeWidth={2.5} /> Organic Stock Secured & Allocated
                  </p>
                </div>
              </div>

              {/* Order Metadata Details rows */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-dashed border-slate-200 py-5 text-xs font-sans text-slate-500">
                <div className="space-y-1.5">
                  <p className="font-mono text-[9px] uppercase font-bold text-slate-400">Transaction ID</p>
                  <p className="font-mono font-bold text-indigo-700">{orderId || 'LCC-582914'}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-mono text-[9px] uppercase font-bold text-slate-400">Carrier Tracker</p>
                  <p className="font-mono font-bold text-slate-800">USPS: {(Math.random() * 100000).toFixed(0)}-LCC</p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-mono text-[9px] uppercase font-bold text-slate-400">Estimated Delivery</p>
                  <p className="font-bold text-slate-805 flex items-center gap-0.5">
                    <Truck size={12} className="text-indigo-600 shrink-0" /> 3-5 Business Days
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="font-mono text-[9px] uppercase font-bold text-slate-400">Shipping Mode</p>
                  <p className="font-bold text-emerald-700 uppercase">Climate-Neutral Boxed</p>
                </div>
              </div>

              {/* Shipping Address summary block */}
              <div className="bg-slate-50 border border-slate-150/60 rounded-xl p-4 text-xs text-slate-600 space-y-1 font-sans text-left">
                <p className="font-black text-slate-800 mb-1.5 uppercase font-mono text-[9px] tracking-wider text-slate-405">Shipping Destination</p>
                <p className="font-bold text-slate-800">{shippingName}</p>
                <p>{shippingAddress}</p>
                <p>{shippingCity}, {shippingState} {shippingZip}</p>
                <p className="text-slate-400 mt-1 font-mono text-[10px] flex items-center gap-1">
                  <Phone size={10} /> {shippingPhone}
                </p>
              </div>

              {/* Items Table details listing with high-resolution photos! */}
              <div className="space-y-3.5">
                <p className="font-mono text-[9px] uppercase font-bold text-slate-450 tracking-wider">Ordered items overview</p>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                  {orderedItemsSnapshot.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-center justify-between text-xs font-sans gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* High resolution product thumbnail photo or fallback */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-50 flex items-center justify-center">
                          {it.product.imageUrl && it.product.imageUrl.startsWith('http') ? (
                            <img 
                              src={it.product.imageUrl} 
                              alt={it.product.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">{it.product.imageUrl || '👕'}</span>
                          )}
                        </div>
                        <div className="truncate min-w-0">
                          <p className="font-bold text-slate-800 truncate">{it.product.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Size: {it.selectedSize || 'M'} x {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 shrink-0">${(it.product.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Invoice Box */}
              <div className="pt-4 border-t border-dotted border-slate-200 text-xs font-sans space-y-2">
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Gross Subtotal</span>
                  <span className="font-mono text-slate-800 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-slate-500">
                  <span>Carbon-Free Postal Carrier</span>
                  <span className="text-emerald-700 font-bold">FREE OUTREACH</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t pt-2.5">
                  <span className="font-display">Receipt Ledger (Paid)</span>
                  <span className="font-mono text-base">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Companion Match Details Destination Card */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/40 text-emerald-805 text-left text-xs leading-relaxed font-sans mt-2 space-y-1.5">
                <p className="font-black text-emerald-950 flex items-center gap-1">
                  🎁 Companion Outreach Donation Allocated
                </p>
                <p className="font-medium text-emerald-700">
                  Because of your simulated order, <b>exactly {donationCount} organic outerwear children's hoodies</b> are now matched and shipped to:
                </p>
                <div className="bg-white border rounded-xl p-2.5 mt-1 text-[11px] font-mono leading-normal shadow-xs flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-rose-500 animate-bounce" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-850">Cass Community Social Services</p>
                    <p className="text-[10px] text-slate-400">11745 Rosa Parks Blvd, Detroit, MI 48206</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vintage style receipt jagged bottom cut out */}
            <div className="flex justify-between -mt-1 select-none pointer-events-none">
              {Array.from({ length: 24 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-4 h-3 bg-white border-b border-x border-slate-250/90" 
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    transform: 'rotate(180deg)'
                  }}
                />
              ))}
            </div>

            {/* Account benefits & Back trigger */}
            <div className="text-center mt-6 space-y-4">
              <div className="bg-slate-950 border border-slate-850 text-white rounded-2xl p-4 text-xs select-none shadow leading-relaxed font-mono">
                <p className="font-bold text-emerald-400">★ Gamified Star-Profile Upgraded:</p>
                <p>💰 +150 Daily Star Coins reward multiplier added</p>
                <p>🔥 +80 Outreach experience points processed</p>
              </div>

              <button
                id="receipt-store-back-btn"
                onClick={() => setCheckoutStep('cart')}
                className="bg-slate-850 hover:bg-slate-900 text-white font-sans text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition active:scale-95 inline-flex items-center gap-1 shadow"
              >
                Return to Store Catalog Page
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

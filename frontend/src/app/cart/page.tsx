"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import {
  Trash2, Minus, Plus, ArrowRight, ShieldCheck,
  X, ShoppingBag, AlertTriangle, CheckCircle2, Loader2, Package
} from 'lucide-react';
import Link from 'next/link';
import { createOrder } from '@/actions/orders';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
interface ConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  formData: { name: string; email: string; phone: string; address: string; instructions: string };
  items: { id: string; title: string; price: number; quantity: number; imageUrl: string }[];
  total: number;
}

function ConfirmModal({ isOpen, onCancel, onConfirm, isSubmitting, formData, items, total }: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-800 to-brand-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Confirm Your Order</h2>
              <p className="text-white/70 text-sm">Please review before submitting</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Delivery Info */}
          <div className="rounded-2xl bg-secondary/40 border border-border/40 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-3">Delivery Details</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <span className="text-foreground/60">Name</span>
              <span className="font-semibold text-right">{formData.name}</span>
              <span className="text-foreground/60">Email</span>
              <span className="font-semibold text-right truncate">{formData.email}</span>
              <span className="text-foreground/60">Phone</span>
              <span className="font-semibold text-right">{formData.phone}</span>
              <span className="text-foreground/60 self-start">Address</span>
              <span className="font-semibold text-right leading-snug">{formData.address}</span>
              {formData.instructions && (
                <>
                  <span className="text-foreground/60 self-start">Notes</span>
                  <span className="font-semibold text-right leading-snug text-xs">{formData.instructions}</span>
                </>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/50">Items ({items.length})</p>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{item.title}</p>
                  <p className="text-xs text-foreground/60">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-sm text-primary flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="font-bold text-lg">Order Total</span>
            <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-2 text-xs text-foreground/50 bg-secondary/30 rounded-xl px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Your order is secured. We'll contact you to confirm delivery details.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-secondary/20 border-t border-border/40 flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-2xl border-border/60 hover:border-primary/40"
          >
            Go Back
          </Button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Error Toast / Banner ─────────────────────────────────────────────────────
function ErrorBanner({ message, onClearCart }: { message: string; onClearCart: () => void }) {
  return (
    <div className="mb-6 rounded-2xl border border-red-400/40 bg-red-50 dark:bg-red-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-start gap-3 flex-1">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Order could not be placed</p>
          <p className="text-sm text-red-600/80 dark:text-red-300/70 mt-0.5">{message}</p>
        </div>
      </div>
      <button
        onClick={onClearCart}
        className="text-xs font-bold text-red-600 dark:text-red-400 border border-red-400/50 rounded-lg px-3 py-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors whitespace-nowrap flex-shrink-0"
      >
        Clear Cart
      </button>
    </div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    instructions: ''
  });

  useEffect(() => { setIsMounted(true); }, []);

  // Open the confirmation modal (HTML5 validation triggers before this)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowConfirm(true);
  };

  // Actual order submission from the confirmation modal
  const handleConfirmOrder = async () => {
    setIsSubmitting(true);

    const finishDetails = items
      .map(i => {
        const finishMatch = i.title.match(/\(([^)]+)\)/);
        const name = i.title.split(' (')[0];
        return finishMatch ? `${i.quantity}x ${name} [${finishMatch[1]}]` : `${i.quantity}x ${i.title}`;
      })
      .join(', ');

    const finalInstructions = formData.instructions
      ? `${formData.instructions} | Selected Finishes: ${finishDetails}`
      : `Selected Finishes: ${finishDetails}`;

    const result = await createOrder({
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      instructions: finalInstructions,
      totalAmount: getTotal(),
      items: items.map(i => ({ productId: i.id.split('-')[0], quantity: i.quantity, price: i.price }))
    });

    setIsSubmitting(false);
    setShowConfirm(false);

    if (result.success) {
      setOrderComplete(true);
      clearCart();
    } else {
      setErrorMessage(result.error || "There was an error placing your order. Please try again.");
    }
  };

  // ─── Success Screen ─────────────────────────────────────────────────────────
  if (orderComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          {/* Animated checkmark */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-black mb-3 text-foreground">Order Received!</h1>
          <p className="text-lg text-foreground/60 mb-2">
            Thank you, <span className="font-semibold text-primary">{formData.name || 'valued customer'}</span>!
          </p>
          <p className="text-foreground/50 mb-8 text-sm leading-relaxed">
            We've received your order and will contact you at{' '}
            <span className="font-medium text-foreground/70">{formData.email}</span> shortly
            to confirm delivery details and any custom instructions.
          </p>

          <div className="bg-card border border-border/40 rounded-2xl p-5 mb-8 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">What happens next?</p>
            {[
              { step: '1', text: 'We review your order and custom requirements' },
              { step: '2', text: 'Our artisans begin crafting your unique piece' },
              { step: '3', text: 'We contact you with delivery details & updates' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {step}
                </div>
                <span className="text-sm text-foreground/70">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto rounded-2xl">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl border-border/60">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Cart Page ──────────────────────────────────────────────────────────────
  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        onCancel={() => { if (!isSubmitting) setShowConfirm(false); }}
        onConfirm={handleConfirmOrder}
        isSubmitting={isSubmitting}
        formData={formData}
        items={items}
        total={getTotal()}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight">Shopping Cart</h1>
          {isMounted && items.length > 0 && (
            <p className="text-foreground/50 mt-2">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          )}
        </div>

        {errorMessage && (
          <ErrorBanner message={errorMessage} onClearCart={() => { clearCart(); setErrorMessage(null); }} />
        )}

        {!isMounted ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin opacity-40" />
            <span className="text-foreground/50">Loading cart...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 glass-effect rounded-3xl border border-border/50 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-foreground/30" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-foreground/50 mb-8 max-w-xs">Looks like you haven't added anything yet. Explore our handcrafted collection.</p>
            <Link href="/shop">
              <Button size="lg" className="rounded-2xl">Browse Products <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* ── Cart Items ── */}
            <div className="lg:col-span-3 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 p-5 glass-effect rounded-2xl border border-border/40 relative group transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg line-clamp-2 pr-8 leading-snug">{item.title}</h3>
                      <p className="text-primary font-bold mt-1 text-lg">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center bg-background rounded-xl border border-border/60 overflow-hidden h-9">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-9 h-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-secondary/60 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-secondary/60 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {/* Item subtotal */}
                      <span className="text-sm text-foreground/50 font-medium">
                        Subtotal: <span className="text-foreground font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-foreground/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Clear cart */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-foreground/40 hover:text-red-500 transition-colors flex items-center gap-1.5 underline underline-offset-2"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear entire cart
                </button>
              </div>
            </div>

            {/* ── Order Summary + Checkout Form ── */}
            <div className="lg:col-span-2">
              <div className="glass-effect rounded-3xl border border-border/50 overflow-hidden shadow-xl sticky top-24">
                {/* Summary header */}
                <div className="bg-gradient-to-r from-brand-800 to-brand-700 px-6 py-5">
                  <h2 className="text-white font-bold text-xl">Order Summary</h2>
                </div>

                <div className="p-6">
                  {/* Price breakdown */}
                  <div className="space-y-2.5 text-sm mb-5 pb-5 border-b border-border/40">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-foreground/70">
                        <span className="line-clamp-1 flex-1 pr-2">{item.title} ×{item.quantity}</span>
                        <span className="font-semibold text-foreground flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-foreground/50 pt-1">
                      <span>Shipping</span>
                      <span className="italic">Calculated separately</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-3xl font-black text-primary">${getTotal().toFixed(2)}</span>
                  </div>

                  {/* Checkout form */}
                  <form onSubmit={handleFormSubmit} className="space-y-3" noValidate>
                    {[
                      { key: 'name', type: 'text', placeholder: 'Full Name', required: true },
                      { key: 'email', type: 'email', placeholder: 'Email Address', required: true },
                      { key: 'phone', type: 'tel', placeholder: 'Phone Number', required: true },
                    ].map(field => (
                      <input
                        key={field.key}
                        required={field.required}
                        type={field.type}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40"
                      />
                    ))}
                    <textarea
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Delivery Address"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40 resize-none"
                    />
                    <textarea
                      value={formData.instructions}
                      onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                      placeholder="Custom Instructions (optional — colors, text, etc.)"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40 resize-none"
                    />

                    <button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Place Order
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>

                  {/* Trust badges */}
                  <div className="mt-5 flex items-center gap-2 justify-center text-xs text-foreground/40">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Secure checkout — We'll contact you to confirm
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

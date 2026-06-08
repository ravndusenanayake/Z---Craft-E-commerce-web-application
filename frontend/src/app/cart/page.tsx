"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { createOrder } from '@/actions/orders';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    instructions: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Package product variation details to include in instructions
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
    
    if (result.success) {
      setOrderComplete(true);
      clearCart();
    } else {
      alert(result.error || "There was an error placing your order. Please try again.");
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Received!</h1>
        <p className="text-xl text-foreground/70 mb-8">
          Thank you for your purchase. We will contact you shortly regarding delivery and any custom instructions.
        </p>
        <Link href="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-12">Shopping Cart</h1>

      {!isMounted ? (
        <div className="text-center py-16">Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 glass-effect rounded-2xl border border-border/50">
          <p className="text-xl text-foreground/60 mb-6">Your cart is empty.</p>
          <Link href="/shop">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 p-4 glass-effect rounded-2xl border border-border/50 relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1 pr-8">{item.title}</h3>
                    <p className="text-primary font-medium mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-background rounded-lg border border-border h-9">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-full flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-foreground/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl border border-border/50 p-6 sticky top-24 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border/50">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="font-medium">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Shipping</span>
                  <span className="font-medium">Calculated at next step</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-3xl font-bold text-primary">${getTotal().toFixed(2)}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Delivery Address" rows={3} className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"></textarea>
                </div>
                <div>
                  <textarea value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} placeholder="Custom Instructions (Optional: Colors, text for resin art)" rows={2} className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"></textarea>
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg mt-4">
                  {isSubmitting ? 'Processing...' : 'Place Order'} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

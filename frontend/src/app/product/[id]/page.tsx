"use client";

import { useState, useEffect, use } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { 
  Minus, Plus, ShoppingBag, ArrowLeft, Check, Truck, 
  ShieldCheck, Sparkles, CreditCard, Star, Share2, Heart, 
  MapPin, RotateCcw, Shield, Info, RefreshCw, HeartHandshake 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/actions/products';
import { Product } from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // Interactive product details states
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Custom design states
  const [activeView, setActiveView] = useState<'default' | 'macro' | 'flatlay' | 'golden'>('default');
  const [activeFinish, setActiveFinish] = useState<'gloss' | 'matte' | 'gold_rimmed'>('gloss');
  
  // Dynamic location states
  const [location, setLocation] = useState('Sabaragamuwa, Kegalle, Warakapola');
  const [shippingCost, setShippingCost] = useState(4.25);
  const [deliveryDates, setDeliveryDates] = useState('17-22 Jun');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const data = await getProductById(id);
      if (data) {
        setProduct(data as Product);
      }
      setIsLoading(false);
    }
    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-50"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-light">Product not found.</h2>
        <Link href="/shop">
          <Button variant="outline" className="rounded-full">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const finishLabels = {
    gloss: 'Original Gloss',
    matte: 'Satin Matte',
    gold_rimmed: 'Liquid Gold Trim'
  };

  const finishPrices = {
    gloss: 0,
    matte: 3.00,
    gold_rimmed: 12.00
  };

  const displayPrice = product.price + finishPrices[activeFinish];
  const originalPrice = displayPrice * 1.5;

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${activeFinish}`,
      title: `${product.title} (${finishLabels[activeFinish]})`,
      price: displayPrice,
      quantity,
      imageUrl: product.imageUrl,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handlePlaceOrder = () => {
    addItem({
      id: `${product.id}-${activeFinish}`,
      title: `${product.title} (${finishLabels[activeFinish]})`,
      price: displayPrice,
      quantity,
      imageUrl: product.imageUrl,
    });
    router.push('/cart');
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;

    setIsCalculatingShipping(true);
    setTimeout(() => {
      // Simulate dynamic shipping calculations
      const hash = newLocationInput.length + (newLocationInput.charCodeAt(0) || 0);
      const calculatedCost = 3.50 + (hash % 6) + 0.25;
      const minDays = 3 + (hash % 4);
      const maxDays = minDays + 3 + (hash % 2);
      
      const today = new Date();
      const deliveryStart = new Date(today);
      deliveryStart.setDate(today.getDate() + minDays);
      const deliveryEnd = new Date(today);
      deliveryEnd.setDate(today.getDate() + maxDays);
      
      const dateString = `${deliveryStart.getDate()} ${deliveryStart.toLocaleString('en-US', { month: 'short' })} - ${deliveryEnd.getDate()} ${deliveryEnd.toLocaleString('en-US', { month: 'short' })}`;

      setShippingCost(calculatedCost);
      setDeliveryDates(dateString);
      setLocation(newLocationInput);
      setIsCalculatingShipping(false);
      setIsEditingLocation(false);
    }, 1000);
  };

  // Helper classes for active main view
  const getViewClasses = () => {
    switch (activeView) {
      case 'macro':
        return 'scale-[1.8] origin-[50%_40%] object-cover';
      case 'flatlay':
        return 'scale-95 rotate-3 shadow-2xl';
      case 'golden':
        return 'sepia-[0.35] brightness-[1.08] contrast-[1.05]';
      default:
        return 'scale-100 hover:scale-[1.06]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Back navigation */}
      <Link 
        href="/shop" 
        className="inline-flex items-center text-foreground/50 hover:text-primary mb-8 transition-colors uppercase text-xs tracking-widest font-semibold"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collection
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        
        {/* Left Column: Interactive Product Images (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-3xl overflow-hidden bg-card border border-border/40 aspect-square relative glass-effect shadow-xl p-3">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-background/50 relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className={`w-full h-full object-cover transition-all duration-500 ease-out ${getViewClasses()}`}
              />
              
              {/* Corner Design Tag */}
              <div className="absolute top-4 left-4 bg-primary/95 backdrop-blur-md text-primary-foreground text-xs font-semibold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                Handcrafted
              </div>
              
              {/* Ambient lighting badge when golden hour view is active */}
              {activeView === 'golden' && (
                <div className="absolute bottom-4 right-4 bg-amber-500/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold py-1 px-2.5 rounded-md flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> Golden hour filter active
                </div>
              )}
              {activeView === 'macro' && (
                <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] uppercase tracking-widest font-bold py-1 px-2.5 rounded-md flex items-center gap-1.5 shadow-sm">
                  <Info className="w-3.5 h-3.5" /> Macro texture magnification
                </div>
              )}
            </div>
          </div>
          
          {/* Dynamic Interactive Thumbnails */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-foreground/40 font-semibold mb-1">Perspective Previews</span>
            <div className="grid grid-cols-4 gap-3">
              
              {/* Thumbnail 1: Standard */}
              <button 
                onClick={() => setActiveView('default')}
                className={`group relative rounded-xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-between p-1 bg-card transition-all ${activeView === 'default' ? 'border-primary shadow-md' : 'border-border/40 hover:border-primary/50'}`}
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img src={product.imageUrl} alt="Default View" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-primary/80 backdrop-blur-sm text-[8px] text-primary-foreground uppercase py-0.5 text-center font-semibold tracking-wider">
                  Main
                </div>
              </button>

              {/* Thumbnail 2: Macro Close-up */}
              <button 
                onClick={() => setActiveView('macro')}
                className={`group relative rounded-xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-between p-1 bg-card transition-all ${activeView === 'macro' ? 'border-primary shadow-md' : 'border-border/40 hover:border-primary/50'}`}
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img src={product.imageUrl} alt="Macro Detail" className="w-full h-full object-cover scale-150 origin-center group-hover:scale-175 transition-transform duration-300" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-primary/80 backdrop-blur-sm text-[8px] text-primary-foreground uppercase py-0.5 text-center font-semibold tracking-wider">
                  Macro
                </div>
              </button>

              {/* Thumbnail 3: Studio Flat-lay */}
              <button 
                onClick={() => setActiveView('flatlay')}
                className={`group relative rounded-xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-between p-1 bg-card transition-all ${activeView === 'flatlay' ? 'border-primary shadow-md' : 'border-border/40 hover:border-primary/50'}`}
              >
                <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center p-1 bg-muted/30">
                  <img src={product.imageUrl} alt="Flat Lay View" className="w-4/5 h-4/5 object-cover rotate-3 shadow-md group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-primary/80 backdrop-blur-sm text-[8px] text-primary-foreground uppercase py-0.5 text-center font-semibold tracking-wider">
                  Flat-Lay
                </div>
              </button>

              {/* Thumbnail 4: Golden Hour */}
              <button 
                onClick={() => setActiveView('golden')}
                className={`group relative rounded-xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-between p-1 bg-card transition-all ${activeView === 'golden' ? 'border-primary shadow-md' : 'border-border/40 hover:border-primary/50'}`}
              >
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <img src={product.imageUrl} alt="Golden Hour View" className="w-full h-full object-cover sepia-[0.35] brightness-[1.08] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-primary/80 backdrop-blur-sm text-[8px] text-primary-foreground uppercase py-0.5 text-center font-semibold tracking-wider">
                  Golden Hour
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Middle Column: Premium Product Details (4/12) */}
        <div className="lg:col-span-4 flex flex-col pt-2 lg:px-2">
          
          {/* Collection tag */}
          <span className="text-xs font-bold text-accent-600 uppercase tracking-widest mb-1.5">{product.category.replace('_', ' ')}</span>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-tight tracking-tight">
            {product.title}
          </h1>
          
          {/* Ratings & Share Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <div className="flex text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 text-border fill-current dark:text-zinc-800" />
              </div>
              <span className="text-xs font-medium text-foreground/50 bg-secondary/50 px-2 py-0.5 rounded-full">
                80 Reviews
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-foreground/50 hover:text-primary transition-colors p-1.5 hover:bg-secondary/40 rounded-full" title="Share Product">
                <Share2 className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`transition-colors p-1.5 hover:bg-secondary/40 rounded-full ${isWishlisted ? 'text-red-500' : 'text-foreground/50 hover:text-red-500'}`} 
                title="Add to Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Boutique Brand Stamp */}
          <div className="text-xs text-foreground/60 mb-6 flex items-center gap-2">
            <span className="font-semibold text-foreground">Artisan:</span>
            <span className="text-primary hover:underline cursor-pointer font-bold">Z Craft Studio</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-border" />
            <span className="text-foreground/60">Bespoke Production</span>
          </div>
          
          {/* Premium Pricing Panel */}
          <div className="bg-gradient-to-br from-secondary/40 to-transparent p-5 rounded-2xl border border-border/30 mb-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-accent-500/5 rounded-full blur-xl" />
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-black text-primary tracking-tight">
                ${displayPrice.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-accent-600 bg-accent-500/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                33% Off
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/40">
              <span>Original:</span>
              <span className="line-through">${originalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Interactive Variation Selection: Finishes */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2.5">
              <span>Finish Selection</span>
              <span className="text-primary font-bold">{finishLabels[activeFinish]}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Gloss Option */}
              <button 
                onClick={() => setActiveFinish('gloss')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${activeFinish === 'gloss' ? 'border-primary bg-primary/5 shadow-sm text-primary' : 'border-border/60 hover:border-primary/40 bg-card hover:bg-secondary/20 text-foreground/80'}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${activeFinish === 'gloss' ? 'border-primary bg-primary' : 'border-border'}`}>
                    {activeFinish === 'gloss' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  Original Gloss
                </span>
                <span className="text-xs text-foreground/40 font-normal">Included</span>
              </button>

              {/* Matte Option */}
              <button 
                onClick={() => setActiveFinish('matte')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${activeFinish === 'matte' ? 'border-primary bg-primary/5 shadow-sm text-primary' : 'border-border/60 hover:border-primary/40 bg-card hover:bg-secondary/20 text-foreground/80'}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${activeFinish === 'matte' ? 'border-primary bg-primary' : 'border-border'}`}>
                    {activeFinish === 'matte' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  Satin Matte
                </span>
                <span className="text-xs text-primary font-bold">+$3.00</span>
              </button>

              {/* Gold Rimmed Option */}
              <button 
                onClick={() => setActiveFinish('gold_rimmed')}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${activeFinish === 'gold_rimmed' ? 'border-primary bg-primary/5 shadow-sm text-primary animate-pulse-subtle' : 'border-border/60 hover:border-primary/40 bg-card hover:bg-secondary/20 text-foreground/80'}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${activeFinish === 'gold_rimmed' ? 'border-primary bg-primary' : 'border-border'}`}>
                    {activeFinish === 'gold_rimmed' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="flex items-center gap-1">
                    Liquid Gold Trim <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                  </span>
                </span>
                <span className="text-xs text-primary font-bold">+$12.00</span>
              </button>
            </div>
          </div>

          {/* Quantity Panel */}
          <div className="flex items-center justify-between mb-8 p-3 rounded-2xl bg-secondary/30 border border-border/20">
            <span className="text-xs uppercase tracking-wider text-foreground/50 font-bold ml-1">Quantity</span>
            <div className="flex items-center bg-card rounded-xl border border-border/40 p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/70 bg-muted/30 hover:bg-muted hover:text-foreground transition-all disabled:opacity-30"
                disabled={quantity <= 1}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/70 bg-muted/30 hover:bg-muted hover:text-foreground transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Premium Call to Action Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <Button 
              onClick={handlePlaceOrder} 
              size="lg" 
              className="w-full h-13 bg-primary hover:bg-primary/95 text-primary-foreground font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg hover-lift transition-all"
            >
              Buy Now
            </Button>
            
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className={`w-full h-13 font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all ${
                addedToCart 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-primary/20 hover-lift'
              }`}
            >
              {addedToCart ? (
                <span className="flex items-center justify-center gap-2 animate-scale-in">
                  <Check className="h-4.5 w-4.5 stroke-[3]" /> Added to Cart
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
                </span>
              )}
            </Button>
          </div>

          {/* Structured Product Description */}
          <div className="border-t border-border/40 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-3">Product Description</h3>
            <p className="text-sm font-light leading-relaxed text-foreground/75">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Delivery, Warranty & Trust Badges (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          
          {/* Interactive Delivery Options Card */}
          <div className="bg-card border border-border/40 rounded-2xl shadow-md p-5 glass-effect relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-foreground/50 uppercase tracking-widest">Delivery Info</h3>
              <Truck className="w-4.5 h-4.5 text-primary/75" />
            </div>
            
            {/* Interactive Location Display / Editor */}
            {isEditingLocation ? (
              <form onSubmit={handleSaveLocation} className="space-y-3 mb-4 animate-fade-in">
                <div className="relative">
                  <input
                    type="text"
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    placeholder="Enter city or address"
                    className="w-full text-xs bg-background rounded-lg border border-border px-3 py-2.5 focus:outline-none focus:border-primary/50 text-foreground pr-8"
                    autoFocus
                  />
                  {isCalculatingShipping && (
                    <RefreshCw className="w-3.5 h-3.5 text-primary/70 animate-spin absolute right-2.5 top-3" />
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsEditingLocation(false)} 
                    className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 px-2.5 py-1.5 rounded bg-muted/40 hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isCalculatingShipping || !newLocationInput.trim()}
                    className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground px-3 py-1.5 rounded bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    Calculate
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex gap-2.5 items-start mb-4">
                <MapPin className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-foreground/50 uppercase tracking-wider text-[9px] font-bold">Deliver to</div>
                  <div className="text-xs font-semibold text-foreground leading-tight line-clamp-2 mt-0.5">{location}</div>
                </div>
                <button 
                  onClick={() => {
                    setNewLocationInput(location);
                    setIsEditingLocation(true);
                  }}
                  className="text-[10px] text-primary uppercase font-bold hover:underline shrink-0 ml-1.5"
                >
                  Change
                </button>
              </div>
            )}
            
            {/* Custom Dynamic Shipping Cost */}
            <div className="py-4 border-t border-border/40 mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-foreground">Standard Handcrafted Delivery</div>
                  <div className="text-[10px] text-foreground/50 mt-0.5 flex items-center gap-1">
                    <span>Arrives by:</span>
                    <span className="font-semibold text-primary">{deliveryDates}</span>
                  </div>
                </div>
                <div className="text-xs font-extrabold text-primary">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2.5 items-center text-xs text-foreground/75">
              <CreditCard className="w-4.5 h-4.5 text-primary/75 shrink-0" />
              <span>Cash on Delivery available</span>
            </div>
          </div>

          {/* Boutique Return & Quality Assurances */}
          <div className="bg-card border border-border/40 rounded-2xl shadow-md p-5 glass-effect">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-foreground/50 uppercase tracking-widest">Quality Assurances</h3>
              <ShieldCheck className="w-4.5 h-4.5 text-primary/75" />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <RotateCcw className="w-4.5 h-4.5 text-primary/70 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold">14-Day Boutique Return</h4>
                  <p className="text-[10px] text-foreground/50 leading-relaxed mt-0.5">Easy returns if the artwork is damaged during delivery or doesn't meet expectations.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <HeartHandshake className="w-4.5 h-4.5 text-primary/70 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold">100% Satisfaction</h4>
                  <p className="text-[10px] text-foreground/50 leading-relaxed mt-0.5">Every piece is verified for heat resistance, UV durability, and structural finish quality.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Shield className="w-4.5 h-4.5 text-primary/70 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold">Safe & Secured Checkout</h4>
                  <p className="text-[10px] text-foreground/50 leading-relaxed mt-0.5">Your payments are fully encrypted and securely processed.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, use } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Truck, ShieldCheck, Sparkles, CreditCard, Star, Share2, Heart, MapPin, RotateCcw, Shield, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/actions/products';
import { Product } from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handlePlaceOrder = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link href="/shop" className="inline-flex items-center text-foreground/50 hover:text-primary mb-8 transition-colors uppercase text-sm tracking-widest font-semibold">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Images (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden bg-card border border-border/40 aspect-square relative group">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Mock Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md border-2 overflow-hidden flex-shrink-0 cursor-pointer ${i === 1 ? 'border-primary' : 'border-transparent'}`}>
                <img src={product.imageUrl} alt={`${product.title} view ${i}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Product Details (5/12) */}
        <div className="lg:col-span-5 flex flex-col pt-2 lg:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground mb-2 leading-tight">{product.title}</h1>
          
          {/* Ratings & Share */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">80 Ratings</span>
            </div>
            <div className="flex items-center gap-4 text-foreground/50">
              <button className="hover:text-foreground transition-colors"><Share2 className="w-5 h-5" /></button>
              <button className="hover:text-red-500 transition-colors"><Heart className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Brand Info */}
          <div className="text-sm text-foreground/70 mb-6">
            Brand: <span className="text-blue-600 hover:underline cursor-pointer">Artisan Crafted</span> | <span className="text-blue-600 hover:underline cursor-pointer">More {product.category.replace('_', ' ')} from Artisan Crafted</span>
          </div>
          
          {/* Price Section */}
          <div className="mb-6 pb-6 border-b border-border/40">
            <div className="text-3xl sm:text-4xl font-semibold text-primary mb-2">
              ${product.price.toFixed(2)}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="line-through text-foreground/40 font-light">${(product.price * 1.5).toFixed(2)}</span>
              <span className="text-foreground font-medium">-33%</span>
            </div>
          </div>

          {/* Variations (Color) */}
          <div className="mb-6">
            <div className="text-sm text-foreground/60 mb-2">Color Family: <span className="font-semibold text-foreground">Default</span></div>
            <div className="flex gap-3">
               <div className="w-10 h-10 rounded border-2 border-primary overflow-hidden cursor-pointer">
                 <img src={product.imageUrl} alt="Color 1" className="w-full h-full object-cover" />
               </div>
               <div className="w-10 h-10 rounded border border-border overflow-hidden cursor-pointer hover:border-primary opacity-60">
                 <img src={product.imageUrl} alt="Color 2" className="w-full h-full object-cover grayscale" />
               </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm text-foreground/60 w-16">Quantity</span>
            <div className="flex items-center bg-card rounded-sm border border-border/60 p-0.5">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-foreground/70 bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-12 text-center text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-foreground/70 bg-muted/50 hover:bg-muted transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            {product.inStock && <span className="text-xs text-orange-500 font-medium">Almost sold out, buy now!</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button 
              onClick={handlePlaceOrder} 
              size="lg" 
              className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-sm shadow-none"
            >
              Buy Now
            </Button>
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className={`flex-1 h-12 rounded-sm shadow-none ${addedToCart ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              {addedToCart ? "Added" : "Add to Cart"}
            </Button>
          </div>
          
          <div className="prose prose-sm dark:prose-invert text-foreground/70 mb-10 font-light leading-relaxed">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Product Description</h3>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Right Column: Delivery & Warranty (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Delivery Options */}
          <div className="bg-card border border-border/40 rounded-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Delivery Options</h3>
              <Info className="w-4 h-4 text-foreground/40" />
            </div>
            
            <div className="flex gap-3 items-start mb-4">
              <MapPin className="w-5 h-5 text-foreground/50 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <div className="text-foreground">Sabaragamuwa, Kegalle, Warakapola</div>
              </div>
              <button className="text-xs text-blue-600 uppercase font-medium hover:underline">Change</button>
            </div>
            
            <div className="py-4 border-y border-border/40 mb-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Truck className="w-5 h-5 text-foreground/50 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Standard Delivery</div>
                    <div className="text-xs text-foreground/50">Get by 17-22 Jun</div>
                  </div>
                </div>
                <div className="text-sm font-medium">$4.25</div>
              </div>
            </div>
            
            <div className="flex gap-3 items-center">
              <CreditCard className="w-5 h-5 text-foreground/50 shrink-0" />
              <div className="text-sm">Cash on Delivery Available</div>
            </div>
          </div>

          {/* Return & Warranty */}
          <div className="bg-card border border-border/40 rounded-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Return & Warranty</h3>
              <Info className="w-4 h-4 text-foreground/40" />
            </div>
            
            <div className="flex gap-3 items-center mb-4">
              <RotateCcw className="w-5 h-5 text-foreground/50 shrink-0" />
              <div className="text-sm">14 days easy return</div>
            </div>
            <div className="flex gap-3 items-center mb-4">
               <ShieldCheck className="w-5 h-5 text-foreground/50 shrink-0" />
               <div className="text-sm">Change of Mind applicable</div>
            </div>
            <div className="flex gap-3 items-center text-foreground/60">
              <Shield className="w-5 h-5 shrink-0" />
              <div className="text-sm">Warranty not available</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

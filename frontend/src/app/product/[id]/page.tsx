"use client";

import { useState, useEffect, use } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Truck, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/shop" className="inline-flex items-center text-foreground/50 hover:text-primary mb-10 transition-colors uppercase text-sm tracking-widest font-semibold">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Product Image */}
        <div className="rounded-3xl overflow-hidden bg-card border border-border/40 aspect-square relative shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50 z-10 pointer-events-none" />
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col pt-8">
          <span className="text-accent-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">
            {product.category.replace('_', ' ')}
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight leading-tight">{product.title}</h1>
          <p className="text-4xl font-light text-foreground/90 mb-8">
            ${product.price.toFixed(2)}
          </p>
          
          <div className="prose prose-lg dark:prose-invert text-foreground/70 mb-10 font-light leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 pb-10 border-b border-border/40">
             <div className="flex items-center text-sm text-foreground/70">
               <ShieldCheck className="w-5 h-5 mr-3 text-primary" /> Premium Materials
             </div>
             <div className="flex items-center text-sm text-foreground/70">
               <Sparkles className="w-5 h-5 mr-3 text-accent-500" /> Handcrafted
             </div>
             <div className="flex items-center text-sm text-foreground/70">
               <Truck className="w-5 h-5 mr-3 text-primary" /> Fast Shipping
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
            <div className="flex items-center justify-between bg-card rounded-full border border-border/60 shadow-sm p-1 shrink-0 h-16 w-full sm:w-auto">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 flex items-center justify-center rounded-full text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 flex items-center justify-center rounded-full text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-1 gap-4">
              <Button 
                onClick={handleAddToCart} 
                size="lg" 
                variant="outline"
                className={`flex-1 h-16 text-base rounded-full shadow-sm hover:shadow-md transition-all duration-300 ${addedToCart ? 'border-green-600 text-green-600 hover:bg-green-50' : 'hover:bg-muted'}`}
              >
                {addedToCart ? (
                  <><Check className="h-5 w-5 mr-2" /> Added</>
                ) : (
                  <><ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart</>
                )}
              </Button>
              <Button 
                onClick={handlePlaceOrder} 
                size="lg" 
                className="flex-1 h-16 text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90"
              >
                <CreditCard className="h-5 w-5 mr-2" /> Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

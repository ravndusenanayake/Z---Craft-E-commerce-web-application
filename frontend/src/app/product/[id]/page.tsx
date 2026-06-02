"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProductById } from '@/actions/products';
import { Product } from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      const data = await getProductById(params.id);
      if (data) {
        setProduct(data as Product);
      }
      setIsLoading(false);
    }
    loadProduct();
  }, [params.id]);

  if (isLoading) {
    return <div className="p-20 text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-20 text-center">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/shop" className="inline-flex items-center text-foreground/60 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="rounded-2xl overflow-hidden glass-effect border border-border/50 aspect-square relative shadow-lg">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2">
            {product.category.replace('_', ' ')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
          <p className="text-3xl font-light text-foreground/80 mb-6">
            ${product.price.toFixed(2)}
          </p>
          
          <div className="prose prose-lg dark:prose-invert text-foreground/70 mb-8">
            <p>{product.description}</p>
            <ul className="mt-4 space-y-2">
              <li>✨ Handcrafted with premium epoxy resin</li>
              <li>✨ Heat-resistant and highly durable</li>
              <li>✨ Unique, one-of-a-kind design</li>
            </ul>
          </div>

          <div className="flex items-center gap-6 mb-8 p-4 glass-effect rounded-xl border border-border/40 inline-block w-fit">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center bg-background rounded-full border border-border">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto h-14 text-lg rounded-full">
            <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}

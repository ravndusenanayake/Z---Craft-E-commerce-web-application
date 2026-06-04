"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard, { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/actions/products';

const CATEGORIES = [
  { id: 'ALL', label: 'All Products' },
  { id: 'GIFT_HAMPERS', label: 'Gift Hampers' },
  { id: 'RESIN_COASTERS', label: 'Resin Coasters' },
  { id: 'RESIN_JEWELRY', label: 'Resin Jewelry' },
  { id: 'CUSTOM_KEEPSAKES', label: 'Custom Keepsakes' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data as Product[]);
    }
    loadProducts();
  }, []);

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-600 inline-block pb-2">
          Shop Collection
        </h1>
        <p className="text-foreground/70 text-lg md:text-xl font-light max-w-2xl">
          Browse our unique collection of handcrafted resin items. Each piece is made with meticulous attention to detail.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-border/40 justify-center md:justify-start">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            className={`rounded-full px-6 py-5 text-sm uppercase tracking-wider font-semibold transition-all duration-300 ${activeCategory === cat.id ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'hover:border-primary hover:text-primary'}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-card rounded-3xl border border-border/40 shadow-sm">
          <p className="text-2xl text-foreground/50 font-light">No products found in this category.</p>
          <Button 
            className="mt-8 rounded-full" 
            variant="outline" 
            onClick={() => setActiveCategory('ALL')}
          >
            View All Products
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-50"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

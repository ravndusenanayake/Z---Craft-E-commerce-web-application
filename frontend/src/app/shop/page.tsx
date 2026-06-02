"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard, { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

// Mock Data for UI before DB is wired up
const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'Luxury Resin Hamper', price: 120.0, category: 'GIFT_HAMPERS', imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80' },
  { id: '2', title: 'Ocean Wave Coasters Set of 4', price: 45.0, category: 'RESIN_COASTERS', imageUrl: 'https://images.unsplash.com/photo-1629851722880-b26aeb8f2df9?w=800&q=80' },
  { id: '3', title: 'Botanical Resin Pendant', price: 35.0, category: 'RESIN_JEWELRY', imageUrl: 'https://images.unsplash.com/photo-1599643478514-4a888f615372?w=800&q=80' },
  { id: '4', title: 'Custom Floral Letters', price: 60.0, category: 'CUSTOM_KEEPSAKES', imageUrl: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=800&q=80' },
  { id: '5', title: 'Minimalist White Coasters', price: 40.0, category: 'RESIN_COASTERS', imageUrl: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&q=80' },
  { id: '6', title: 'Birthday Bash Hamper', price: 85.0, category: 'GIFT_HAMPERS', imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80' },
];

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

  const filteredProducts = activeCategory === 'ALL' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop</h1>
        <p className="text-foreground/70">Browse our unique collection of handcrafted resin items.</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-border/40 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground/50">
          <p className="text-xl">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

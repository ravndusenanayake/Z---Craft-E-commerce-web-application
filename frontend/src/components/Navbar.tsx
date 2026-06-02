"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full z-50 glass-effect border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Z Craft
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link>
            <Link href="/shop" className="text-foreground/80 hover:text-primary transition-colors">Shop</Link>
            <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-secondary rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-foreground/80 hover:text-primary">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-b border-border/40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md">Home</Link>
            <Link href="/shop" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md">Shop</Link>
            <Link href="/contact" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

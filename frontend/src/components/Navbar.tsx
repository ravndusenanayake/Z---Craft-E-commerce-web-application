"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

import { getSessionAction, logout } from '@/actions/auth';
import { User as UserIcon, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsMounted(true);
    getSessionAction().then(setSession);
  }, []);

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
            
            {session && session.role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="text-accent-600 font-semibold hover:text-accent-700 transition-colors">Admin Panel</Link>
            )}
          </div>

          {/* Cart, Auth & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-foreground/60">Hi, {session.name || session.username}</span>
                <button onClick={() => logout()} className="text-foreground/80 hover:text-red-500 transition-colors p-2" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex text-foreground/80 hover:text-primary transition-colors p-2" title="Login">
                <UserIcon className="h-5 w-5" />
              </Link>
            )}

            <Link href="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {isMounted && totalItems > 0 && (
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
            {session ? (
              <button onClick={() => { logout(); toggleMenu(); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-red-500/10 rounded-md">Logout</button>
            ) : (
              <Link href="/login" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

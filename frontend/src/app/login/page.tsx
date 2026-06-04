"use client";

import { useState } from 'react';
import { loginUser } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function UserLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-100),_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-900),_transparent_50%)] -z-10" />
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block mb-4">
            Z Craft
          </Link>
          <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h1>
          <p className="text-foreground/70">Sign in to your customer account</p>
        </div>

        <div className="glass-effect rounded-3xl border border-border/40 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-all"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-foreground/70">
            Don't have an account? <span className="text-primary font-semibold hover:underline cursor-pointer">Register (Coming soon)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

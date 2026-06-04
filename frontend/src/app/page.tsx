import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Gift, Droplets, Gem } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-100),_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-900),_transparent_50%)] -z-10" />
        
        {/* Abstract decorative blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob dark:bg-brand-800/40 dark:mix-blend-screen" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-accent-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 dark:bg-accent-900/40 dark:mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide bg-primary/10 text-primary mb-8 uppercase letter-spacing-wider shadow-sm border border-primary/20">
            <Sparkles className="h-4 w-4 mr-2 text-accent-500" /> Premium Craftsmanship
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
            Art in Every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-500 to-primary bg-[length:200%_auto] animate-gradient">
              Resin Drop
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-foreground/80 mb-12 font-light leading-relaxed">
            Discover our curated gift hampers and custom resin art pieces. 
            Elevate your gifting experience with bespoke, luxurious craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl hover-lift transition-all">
                Shop Collection <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full border-2 border-border/60 hover:bg-secondary/50 hover-lift transition-all">
                Custom Request
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections with Glassmorphism */}
      <section className="py-32 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Curated Collections</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg font-light">
              Explore our four core categories crafted to bring joy, luxury, and beauty into your everyday life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Gift Hampers', icon: <Gift className="h-10 w-10 text-primary" />, desc: 'Thoughtfully curated sets for every special occasion', link: '/shop?category=GIFT_HAMPERS' },
              { title: 'Resin Coasters', icon: <Droplets className="h-10 w-10 text-accent-500" />, desc: 'Elegant, durable, and unique tabletop art', link: '/shop?category=RESIN_COASTERS' },
              { title: 'Resin Jewelry', icon: <Gem className="h-10 w-10 text-primary" />, desc: 'Wearable bespoke miniature art pieces', link: '/shop?category=RESIN_JEWELRY' },
              { title: 'Custom Keepsakes', icon: <Sparkles className="h-10 w-10 text-accent-500" />, desc: 'Preserving your precious memories in clear resin', link: '/shop?category=CUSTOM_KEEPSAKES' },
            ].map((collection, index) => (
              <Link href={collection.link} key={index} className="group cursor-pointer block h-full">
                <div className="glass-effect p-10 rounded-3xl h-full border border-border/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-primary/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150" />
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm relative z-10">
                    {collection.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">{collection.title}</h3>
                  <p className="text-foreground/70 mb-8 font-light leading-relaxed relative z-10">{collection.desc}</p>
                  <span className="text-primary font-semibold group-hover:underline flex items-center relative z-10 uppercase tracking-wider text-sm">
                    Explore <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

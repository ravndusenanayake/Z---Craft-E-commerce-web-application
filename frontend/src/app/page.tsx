import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Gift, Droplets } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />
        
        {/* Abstract decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gold-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6">
            <Sparkles className="h-4 w-4 mr-2" /> Handcrafted with love
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Art in Every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Resin Drop
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-foreground/70 mb-10">
            Discover our curated gift hampers and custom resin art pieces. 
            Elevate your gifting experience with bespoke craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Shop Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Collections</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Explore our four core categories crafted to bring joy and beauty into your everyday life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Gift Hampers', icon: <Gift className="h-10 w-10 text-primary" />, desc: 'Curated sets for every occasion', link: '/shop?category=GIFT_HAMPERS' },
              { title: 'Resin Coasters', icon: <Droplets className="h-10 w-10 text-secondary" />, desc: 'Elegant and durable tableware', link: '/shop?category=RESIN_COASTERS' },
              { title: 'Resin Jewelry', icon: <Sparkles className="h-10 w-10 text-primary" />, desc: 'Wearable bespoke art pieces', link: '/shop?category=RESIN_JEWELRY' },
              { title: 'Custom Keepsakes', icon: <Gift className="h-10 w-10 text-secondary" />, desc: 'Preserving memories in resin', link: '/shop?category=CUSTOM_KEEPSAKES' },
            ].map((collection, index) => (
              <Link href={collection.link} key={index} className="group cursor-pointer">
                <div className="glass-effect p-8 rounded-2xl h-full border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {collection.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{collection.title}</h3>
                  <p className="text-foreground/60 mb-6">{collection.desc}</p>
                  <span className="text-primary font-medium group-hover:underline flex items-center">
                    Explore <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
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

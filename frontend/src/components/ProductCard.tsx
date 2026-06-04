import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { useCartStore } from '@/store/cartStore';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="group relative rounded-xl overflow-hidden glass-effect border border-border/40 hover-lift flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="block aspect-square relative overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors z-10" />
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
              {product.category.replace('_', ' ')}
            </span>
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                {product.title}
              </h3>
            </Link>
          </div>
          <span className="font-bold text-lg text-foreground">${product.price.toFixed(2)}</span>
        </div>
        <div className="mt-auto">
          <Button 
            onClick={handleAddToCart}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md hover:shadow-lg rounded-full"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

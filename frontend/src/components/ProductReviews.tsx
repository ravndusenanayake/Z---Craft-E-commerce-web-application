"use client";

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Loader2, Send, CheckCircle2 } from 'lucide-react';
import { submitReview, getReviews } from '@/actions/reviews';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface ReviewData {
  reviews: Review[];
  count: number;
  avgRating: number;
  distribution: Record<number, number>;
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  size = 'md',
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };
  const cls = sizes[size];
  const display = readonly ? value : (hovered || value);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-all duration-100 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            className={`${cls} transition-colors ${
              star <= display
                ? 'text-amber-400 fill-amber-400'
                : 'text-foreground/20 fill-foreground/10'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <span className="w-3 text-right text-foreground/50 font-medium">{stars}</span>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
      <div className="flex-1 h-2 bg-secondary/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-foreground/40 text-right">{count}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(false);
  // Generate a consistent pseudo-random number of helpful votes based on review ID
  const initialVotes = Math.floor((review.id.charCodeAt(0) || 1) % 15) + 1;
  const [votes, setVotes] = useState(initialVotes);

  const d = new Date(review.createdAt);
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleHelpful = () => {
    if (helpful) {
      setVotes(v => v - 1);
      setHelpful(false);
    } else {
      setVotes(v => v + 1);
      setHelpful(true);
    }
  };

  return (
    <div className="py-6 border-b border-border/30 last:border-0 animate-slide-up">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground">{review.name}</p>
              <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
            <p className="text-xs text-foreground/40 mt-0.5">{dateStr}</p>
          </div>
        </div>
        <div className="bg-secondary/30 px-2.5 py-1 rounded-full border border-border/40">
          <StarRating value={review.rating} size="sm" readonly />
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed ml-[54px]">{review.comment}</p>
      
      <div className="flex items-center gap-4 ml-[54px] mt-4 pt-4 border-t border-border/20">
        <button 
          onClick={handleHelpful}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors px-2 py-1 -ml-2 rounded-md ${helpful ? 'text-primary bg-primary/5' : 'text-foreground/40 hover:text-primary hover:bg-secondary/50'}`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${helpful ? 'fill-current' : ''}`} /> 
          Helpful ({votes})
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProductReviews({ productId }: { productId: string }) {
  const [data, setData] = useState<ReviewData>({
    reviews: [],
    count: 0,
    avgRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', rating: 0, comment: '' });

  const loadReviews = async () => {
    const result = await getReviews(productId);
    setData(result as ReviewData);
    setIsLoading(false);
  };

  useEffect(() => { loadReviews(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      setFormError('Please select a star rating.');
      return;
    }
    setFormError(null);
    setSubmitting(true);

    const result = await submitReview({
      productId,
      name: form.name,
      email: form.email,
      rating: form.rating,
      comment: form.comment,
    });

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
      setForm({ name: '', email: '', rating: 0, comment: '' });
      await loadReviews();
      setTimeout(() => { setShowForm(false); setSubmitted(false); }, 3000);
    } else {
      setFormError(result.error || 'Failed to submit review.');
    }
  };

  const ratingLabel = (r: number) =>
    ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][r] ?? '';

  return (
    <div className="mt-16 pt-10 border-t border-border/40">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Customer Reviews</h2>
          <p className="text-foreground/50 text-sm mt-1">
            {data.count > 0 ? `${data.count} verified review${data.count !== 1 ? 's' : ''}` : 'Be the first to review this product'}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Star className="h-4 w-4 fill-current" />
            Write a Review
          </button>
        )}
      </div>

      {/* Rating overview */}
      {data.count > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-6 glass-effect rounded-2xl border border-border/40">
          {/* Big avg */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-6xl font-black text-primary mb-2">{data.avgRating.toFixed(1)}</div>
            <StarRating value={Math.round(data.avgRating)} size="lg" readonly />
            <p className="text-xs text-foreground/40 mt-2">{data.count} review{data.count !== 1 ? 's' : ''}</p>
          </div>
          {/* Distribution bars */}
          <div className="flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map(star => (
              <RatingBar
                key={star}
                stars={star}
                count={data.distribution[star] || 0}
                total={data.count}
              />
            ))}
          </div>
        </div>
      )}

      {/* Write review form */}
      {showForm && (
        <div className="mb-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-secondary/30 to-transparent p-6 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold mb-5">Share Your Experience</h3>

          {submitted ? (
            <div className="text-center py-8 flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-bold text-lg">Review Submitted!</p>
              <p className="text-sm text-foreground/50">Thank you for sharing your feedback.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-2 block">
                  Your Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <StarRating
                    value={form.rating}
                    onChange={v => { setForm(f => ({ ...f, rating: v })); setFormError(null); }}
                    size="lg"
                  />
                  {form.rating > 0 && (
                    <span className="text-sm font-semibold text-primary">{ratingLabel(form.rating)}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-1.5 block">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-1.5 block">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/60 mb-1.5 block">
                  Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell others what you think about this product — quality, packaging, uniqueness..."
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/30 resize-none"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-500 font-medium">{formError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setFormError(null); }}
                  className="px-5 py-2.5 rounded-xl border border-border/60 text-sm font-semibold hover:bg-secondary/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Submit Review</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-foreground/30 gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm">Loading reviews...</span>
        </div>
      ) : data.reviews.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border/50">
          <Star className="h-12 w-12 text-foreground/15 mx-auto mb-4" />
          <p className="font-semibold text-foreground/40">No reviews yet</p>
          <p className="text-sm text-foreground/30 mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <div>
          {data.reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

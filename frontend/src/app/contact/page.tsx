"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, MapPin, Phone, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { submitInquiry } from '@/actions/inquiries';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const result = await submitInquiry({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      subject: fd.get('subject') as string,
      message: fd.get('message') as string,
    });

    setIsSubmitting(false);
    if (result.success) {
      setIsSubmitted(true);
      formRef.current?.reset();
    } else {
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-foreground/70 text-lg">
          Have a question about a custom resin piece or want to order a bulk gift hamper? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="glass-effect p-8 rounded-3xl border border-border/50">
            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mr-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Studio Location</h4>
                  <p className="text-foreground/70 mt-1">123 Artisan Avenue, Creative District<br/>Colombo, Sri Lanka</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0 mr-4">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Phone</h4>
                  <p className="text-foreground/70 mt-1">+94 77 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mr-4">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Email</h4>
                  <p className="text-foreground/70 mt-1">hello@zcraft.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-8 rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="text-xl font-bold mb-2">Follow our Journey</h3>
            <p className="text-foreground/70 mb-6">See our latest custom creations and behind-the-scenes on TikTok.</p>
            <a href="https://www.tiktok.com/@z_craft.lk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-medium hover:underline">
              @z_craft.lk <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-effect p-8 sm:p-10 rounded-3xl border border-border/50 shadow-xl">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-foreground/70 mb-8">
                Thank you for reaching out. We will get back to you within 24–48 hours.
              </p>
              <Button className="rounded-2xl" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

              {errorMsg && (
                <div className="mb-5 rounded-xl border border-red-300/40 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {errorMsg}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                    <input
                      id="name"
                      name="name"
                      required
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      required
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    required
                    type="text"
                    placeholder="Custom resin order enquiry..."
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your order or question..."
                    className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-foreground/40 resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-5 w-5" /> Send Message</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

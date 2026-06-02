"use client";

import { useState } from 'react';
import { Mail, Search, Clock, CheckCircle } from 'lucide-react';

const MOCK_INQUIRIES = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', subject: 'Custom Floral Letters', message: 'I would like to order a set of letters spelling "LOVE" using pink roses.', date: 'Oct 25, 2023', isRead: false },
  { id: '2', name: 'Bob Builder', email: 'bob@example.com', subject: 'Bulk Order Inquiry', message: 'Can you provide a discount for 50 gift hampers for corporate gifting?', date: 'Oct 24, 2023', isRead: true },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', subject: 'Shipping Time', message: 'How long does it take to ship to Kandy?', date: 'Oct 22, 2023', isRead: true },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [search, setSearch] = useState('');

  const markAsRead = (id: string) => {
    setInquiries(inquiries.map(inq => 
      inq.id === id ? { ...inq, isRead: true } : inq
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries Inbox</h1>
          <p className="text-foreground/60 mt-1">Manage messages from the Contact Us page.</p>
        </div>
      </div>

      <div className="glass-effect rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col md:flex-row h-[70vh]">
        {/* Inbox List */}
        <div className="w-full md:w-1/3 border-r border-border/50 flex flex-col bg-background/30">
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input 
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {inquiries
              .filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.subject.toLowerCase().includes(search.toLowerCase()))
              .map((inq) => (
              <div 
                key={inq.id} 
                onClick={() => markAsRead(inq.id)}
                className={`p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/50 ${!inq.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm ${!inq.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                    {inq.name}
                  </h4>
                  <span className="text-xs text-foreground/50">{inq.date}</span>
                </div>
                <h5 className="text-sm font-medium truncate mb-1">{inq.subject}</h5>
                <p className="text-xs text-foreground/60 line-clamp-2">{inq.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Viewer */}
        <div className="flex-1 flex flex-col bg-card hidden md:flex">
          {inquiries.length > 0 ? (
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                    {inquiries[0].name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{inquiries[0].name}</h2>
                    <p className="text-sm text-foreground/60">{inquiries[0].email}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-foreground/50">
                  <Clock className="w-4 h-4 mr-1" /> {inquiries[0].date}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4">Subject: {inquiries[0].subject}</h3>
                <div className="prose prose-sm dark:prose-invert">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground/80">
                    {inquiries[0].message}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-xs text-foreground/40 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Received via Contact Form
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-foreground/40">
              <Mail className="w-16 h-16 mb-4 opacity-50" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

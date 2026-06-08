"use client";

import { useState, useEffect } from 'react';
import { Mail, Search, Clock, CheckCircle, Inbox, RefreshCw, Loader2, User, AtSign } from 'lucide-react';
import { getInquiries } from '@/actions/inquiries';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string | Date;
}

function formatDate(dateVal: string | Date) {
  const d = new Date(dateVal);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateVal: string | Date) {
  const d = new Date(dateVal);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const loadInquiries = async () => {
    setIsLoading(true);
    const data = await getInquiries();
    const inquiriesData = data as Inquiry[];
    setInquiries(inquiriesData);
    // Auto-select the first inquiry
    if (inquiriesData.length > 0 && !selected) {
      setSelected(inquiriesData[0]);
      setReadIds(prev => new Set([...prev, inquiriesData[0].id]));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleSelect = (inq: Inquiry) => {
    setSelected(inq);
    setReadIds(prev => new Set([...prev, inq.id]));
  };

  const filtered = inquiries.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.subject.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = inquiries.filter(i => !readIds.has(i.id)).length;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-end flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inquiries Inbox</h1>
          <p className="text-foreground/60 mt-1">
            Messages from the Contact Us page
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                {unreadCount} new
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadInquiries}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Panel */}
      <div className="glass-effect rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col md:flex-row flex-1 min-h-0" style={{ height: '70vh' }}>
        {/* ── Left: Inbox List ── */}
        <div className="w-full md:w-2/5 border-r border-border/50 flex flex-col bg-background/30">
          {/* Search */}
          <div className="p-4 border-b border-border/50 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search name, email, subject..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-foreground/40">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Loading messages...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-foreground/40 p-6 text-center">
                <Inbox className="h-10 w-10" />
                <div>
                  <p className="font-semibold text-sm">No messages found</p>
                  {search && <p className="text-xs mt-1">Try a different search term</p>}
                  {!search && <p className="text-xs mt-1">New messages from the contact form will appear here</p>}
                </div>
              </div>
            ) : (
              filtered.map((inq) => {
                const isRead = readIds.has(inq.id);
                const isActive = selected?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelect(inq)}
                    className={`
                      p-4 border-b border-border/40 cursor-pointer transition-all duration-150
                      ${isActive
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : !isRead
                          ? 'bg-primary/5 border-l-4 border-l-primary/40 hover:bg-primary/10'
                          : 'hover:bg-muted/50 border-l-4 border-l-transparent'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {!isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                        <h4 className={`text-sm truncate ${!isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                          {inq.name}
                        </h4>
                      </div>
                      <span className="text-xs text-foreground/40 flex-shrink-0">{formatDate(inq.createdAt)}</span>
                    </div>
                    <h5 className={`text-sm truncate mb-0.5 ${!isRead ? 'font-semibold' : 'font-medium text-foreground/80'}`}>
                      {inq.subject}
                    </h5>
                    <p className="text-xs text-foreground/50 line-clamp-1">{inq.message}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer count */}
          {!isLoading && inquiries.length > 0 && (
            <div className="p-3 border-t border-border/40 bg-background/50 flex-shrink-0">
              <p className="text-xs text-foreground/40 text-center">
                {inquiries.length} total message{inquiries.length !== 1 ? 's' : ''}
                {search && ` · ${filtered.length} shown`}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Message Viewer ── */}
        <div className="flex-1 flex flex-col bg-card overflow-hidden">
          {selected ? (
            <div className="flex flex-col h-full">
              {/* Viewer Header */}
              <div className="px-8 py-6 border-b border-border/50 flex-shrink-0 bg-gradient-to-r from-card to-secondary/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-brand-600 flex items-center justify-center text-white text-lg font-black flex-shrink-0">
                      {selected.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selected.name}</h2>
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <AtSign className="h-3 w-3" />
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-foreground/60">{formatDate(selected.createdAt)}</p>
                    <p className="text-xs text-foreground/40">{formatTime(selected.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="px-8 py-4 border-b border-border/30 bg-secondary/20 flex-shrink-0">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">Subject</p>
                <h3 className="text-lg font-bold text-foreground">{selected.subject}</h3>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/80 text-sm">
                  {selected.message}
                </p>
              </div>

              {/* Reply Action */}
              <div className="px-8 py-5 border-t border-border/40 bg-secondary/10 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-foreground/40 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    Received via Contact Form
                  </p>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-800 to-brand-700 hover:from-brand-700 hover:to-brand-600 text-white text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Mail className="h-4 w-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-foreground/30 gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center">
                <Mail className="w-10 h-10" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Select a message</p>
                <p className="text-sm mt-1">Click on any inquiry to read it here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

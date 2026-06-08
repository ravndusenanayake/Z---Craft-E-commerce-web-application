import { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { logout } from '@/actions/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Z Craft',
  description: 'Manage orders and inquiries for Z Craft.',
};

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/inquiries',  icon: MessageSquare,   label: 'Inquiries'  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-card border-r border-border/40 hidden md:flex md:flex-col shadow-2xl relative z-20 flex-shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-600 group-hover:opacity-80 transition-opacity">
              Z Craft
            </span>
          </Link>
          <p className="text-xs text-foreground/40 mt-1 ml-10 font-medium">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="mt-6 px-3 flex-1 space-y-1">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-4 py-3 text-foreground/70 hover:bg-primary/10 hover:text-primary rounded-xl transition-all font-medium group relative"
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Divider + footer */}
        <div className="p-3 border-t border-border/40">
          <Link
            href="/"
            className="flex items-center px-4 py-2.5 text-sm text-foreground/50 hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-medium mb-1"
          >
            ← Back to Website
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center px-4 py-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="h-14 bg-card border-b border-border/40 flex items-center justify-between px-4 md:hidden flex-shrink-0">
          <Link href="/" className="text-lg font-bold text-primary">Z Craft Admin</Link>
          <form action={logout}>
            <button type="submit" className="p-2 text-red-500">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-background/50">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { Package, MessageSquare, LogOut, LayoutDashboard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Z Craft',
  description: 'Manage orders and inquiries for Z Craft.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border/40 hidden md:flex md:flex-col shadow-2xl relative z-20">
        <div className="p-8 border-b border-border/40">
          <Link href="/" className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-600">
            Z Craft Admin
          </Link>
        </div>
        
        <nav className="mt-8 px-4 flex-1 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center px-4 py-3 text-foreground/80 hover:bg-primary/10 hover:text-primary rounded-xl transition-all font-medium">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/admin/inquiries" className="flex items-center px-4 py-3 text-foreground/80 hover:bg-primary/10 hover:text-primary rounded-xl transition-all font-medium">
            <MessageSquare className="h-5 w-5 mr-3" />
            Inquiries
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border/40 mt-auto">
          <Link href="/admin/login" className="flex items-center px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-card border-b border-border/40 flex items-center justify-between px-6 md:hidden">
          <Link href="/" className="text-xl font-bold text-primary">Z Craft</Link>
          <button className="p-2"><Package className="h-6 w-6" /></button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-background/50">
          {children}
        </div>
      </main>
    </div>
  );
}

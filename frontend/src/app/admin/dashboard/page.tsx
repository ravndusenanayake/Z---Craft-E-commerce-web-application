"use client";

import { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle, Clock, Truck, Package } from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/actions/orders';

// Define the shape of our real order
type Order = {
  id: string;
  customerName: string;
  email: string;
  createdAt: Date;
  totalAmount: number;
  status: string;
  items: any[];
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
      setIsLoading(false);
    }
    loadOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    // Actually update DB
    await updateOrderStatus(id, newStatus);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1"/> Pending</span>;
      case 'IN_PRODUCTION':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Package className="w-3 h-3 mr-1"/> In Production</span>;
      case 'SHIPPED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Truck className="w-3 h-3 mr-1"/> Shipped</span>;
      case 'DELIVERED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/> Delivered</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-foreground/60 mt-1">View and manage all customer orders.</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Orders', value: '156', trend: '+12%' },
          { label: 'Pending', value: '24', trend: 'Needs action' },
          { label: 'Revenue (MTD)', value: '$4,250', trend: '+8%' },
          { label: 'Avg Order Value', value: '$85', trend: '+2%' },
        ].map((stat, i) => (
          <div key={i} className="glass-effect p-6 rounded-2xl border border-border/50 shadow-sm">
            <h3 className="text-sm font-medium text-foreground/60">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
            <p className="text-sm text-primary mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-effect rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input 
              type="text"
              placeholder="Search by Order ID or Customer..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border/50">
                <th className="px-6 py-4 text-sm font-medium text-foreground/70">Order ID</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/70">Customer</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/70">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/70">Total</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/70">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-foreground/70">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.filter(o => o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())).map((order) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/80">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-foreground/50">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/80">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/80 font-medium">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/80">
                    <select 
                      className="bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PRODUCTION">In Production</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ClipboardList, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { menuService } from '../../services/menuService';
import { orderService } from '../../services/orderService';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import { SkeletonStat } from '../../components/ui/Skeleton';

export default function Dashboard() {
  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuService.getMenu().then((r) => r.data.data),
  });
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => orderService.getAllOrders().then((r) => r.data.orderDetails),
    refetchInterval: 20000,
  });

  const totalItems = menu?.length || 0;
  const availableItems = menu?.filter((m) => m.stock > 0).length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status.value === 'PENDING').length || 0;

  const stats = [
    { label: 'Total Menu Items', value: totalItems, sub: `${availableItems} available`, icon: UtensilsCrossed, color: 'text-violet-400', bg: 'bg-violet-600/15' },
    { label: 'Total Orders', value: totalOrders, sub: 'All time', icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-600/15' },
    { label: 'Pending Orders', value: pendingOrders, sub: 'Awaiting confirmation', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-600/15' },
    { label: 'Confirmed Orders', value: orders?.filter(o => o.status.value === 'CONFIRMED').length || 0, sub: 'Successfully confirmed', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
  ];

  const loading = menuLoading || ordersLoading;

  return (
    <AdminLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your canteen operations</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
          : stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-3xl font-bold text-slate-100 mt-2">{s.value}</p>
              <p className="text-sm font-medium text-slate-300">{s.label}</p>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </motion.div>
          ))
        }
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { to: '/admin/menu', label: 'Manage Menu', desc: 'Add, edit or remove items', icon: UtensilsCrossed, color: 'violet' },
          { to: '/admin/orders', label: 'Manage Orders', desc: 'Confirm or cancel orders', icon: ClipboardList, color: 'blue' },
        ].map(({ to, label, desc, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="card p-5 flex items-center justify-between hover:border-violet-500/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 bg-${color}-600/15 rounded-xl flex items-center justify-center`}>
                <Icon size={20} className={`text-${color}-400`} />
              </div>
              <div>
                <p className="font-semibold text-slate-100">{label}</p>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-200" />
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      {orders && orders.length > 0 && (
        <div className="card overflow-hidden animate-slide-up">
          <div className="px-5 py-4 border-b border-[#2d3148] flex items-center justify-between">
            <h2 className="font-semibold text-slate-100">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2d3148]">
                  {['Order ID', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="table-row">
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{order._id.slice(-8)}…</td>
                    <td className="px-4 py-3 font-semibold text-violet-400">₹{order.totalPrice}</td>
                    <td className="px-4 py-3"><Badge label={order.status.value} pulse={order.status.value === 'PENDING'} /></td>
                    <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

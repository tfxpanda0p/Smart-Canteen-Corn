import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import UserLayout from '../../components/layout/UserLayout';
import Badge from '../../components/ui/Badge';
import { SkeletonRow } from '../../components/ui/Skeleton';

function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function MyOrders() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders().then((r) => r.data.orderDetails),
    refetchInterval: 15000,
  });

  return (
    <UserLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">My Orders</h1>
        <p className="text-slate-400 mt-1">Track all your placed orders</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d3148]">
                {['Order ID', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              {error && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                    No orders found.
                  </td>
                </tr>
              )}
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                    You haven't placed any orders yet.
                  </td>
                </tr>
              )}
              {orders?.map((order, idx) => (
                <motion.tr
                  key={order._id}
                  className="table-row cursor-pointer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-400">{order._id.slice(-8)}…</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-300">
                      {order.items.map((i) => `${i.menuName} ×${i.quantity}`).join(', ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-violet-400">₹{order.totalPrice}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={order.status.value} pulse={order.status.value === 'PENDING'} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight size={16} className="text-slate-600" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}

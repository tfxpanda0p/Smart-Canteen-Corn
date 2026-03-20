import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/orderService';
import UserLayout from '../../components/layout/UserLayout';
import Badge from '../../components/ui/Badge';
import CountdownTimer from '../../components/ui/CountdownTimer';
import Spinner from '../../components/ui/Spinner';

function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

const statusIcons = {
  PENDING: <Clock size={20} className="text-amber-400" />,
  CONFIRMED: <CheckCircle size={20} className="text-emerald-400" />,
  CANCELLED: <XCircle size={20} className="text-red-400" />,
};

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id).then((r) => r.data),
    refetchInterval: (data) => data?.status?.value === 'PENDING' ? 10000 : false,
  });

  if (isLoading) return (
    <UserLayout>
      <div className="flex justify-center mt-20"><Spinner size="lg" /></div>
    </UserLayout>
  );

  if (error || !order) return (
    <UserLayout>
      <div className="card p-12 text-center">
        <p className="text-slate-400">Order not found.</p>
        <Link to="/orders" className="text-violet-400 hover:underline text-sm mt-2 inline-block">← Back to orders</Link>
      </div>
    </UserLayout>
  );

  const statusValue = order.status?.value || 'PENDING';

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Link to="/orders" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        {/* Header card */}
        <div className="card p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Order ID</p>
              <p className="font-mono text-sm text-slate-300 break-all">{order._id}</p>
            </div>
            <Badge label={statusValue} pulse={statusValue === 'PENDING'} />
          </div>

          {/* Status info */}
          <div className="flex items-center gap-3 p-3 bg-[#22263a] rounded-xl">
            {statusIcons[statusValue]}
            <div>
              <p className="text-sm font-semibold text-slate-100">{statusValue}</p>
              {order.status?.changedAt && (
                <p className="text-xs text-slate-500">Updated {formatDate(order.status.changedAt)}</p>
              )}
            </div>
            {statusValue === 'PENDING' && order.expiresAt && (
              <div className="ml-auto">
                <p className="text-xs text-slate-500 mb-0.5">Expires in</p>
                <CountdownTimer expiresAt={order.expiresAt} />
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="card mb-4 overflow-hidden">
          <div className="px-5 py-3 border-b border-[#2d3148]">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Items</h2>
          </div>
          {order.items.map((item, idx) => (
            <motion.div
              key={idx}
              className="flex items-center justify-between px-5 py-3.5 border-b border-[#2d3148] last:border-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag size={14} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">{item.menuName}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="card p-5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Amount</span>
            <span className="text-2xl font-bold text-violet-400">₹{order.totalPrice}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-slate-500">Placed on</span>
            <span className="text-sm text-slate-300">{formatDate(order.createdAt)}</span>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

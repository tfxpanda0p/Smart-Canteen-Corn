import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ChevronDown } from 'lucide-react';
import { orderService } from '../../services/orderService';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import CountdownTimer from '../../components/ui/CountdownTimer';
import { SkeletonRow } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const STATUSES = ['CONFIRMED', 'CANCELLED'];

function formatDate(d) {
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  });
}

export default function AllOrders() {
  const qc = useQueryClient();
  const [statusModal, setStatusModal] = useState(null); // { order, newStatus }

  const { data: orders, isLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => orderService.getAllOrders().then((r) => r.data.orderDetails),
    refetchInterval: 15000,
  });

  const changeMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.changeStatus(id, status),
    onSuccess: (_, vars) => {
      toast.success(`Order ${vars.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}!`);
      qc.invalidateQueries({ queryKey: ['all-orders'] });
      if (vars.status === 'CANCELLED') {
        qc.invalidateQueries({ queryKey: ['menu'] });
        qc.invalidateQueries({ queryKey: ['available-menu'] });
      }
      setStatusModal(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to update status'),
  });

  const pending = orders?.filter((o) => o.status.value === 'PENDING') || [];
  const others = orders?.filter((o) => o.status.value !== 'PENDING') || [];

  return (
    <AdminLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100">Order Management</h1>
        <p className="text-slate-400 mt-1">Review and update order statuses</p>
      </div>

      {/* Pending banner */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div
            className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-amber-400 font-semibold">{pending.length} order{pending.length !== 1 ? 's' : ''} awaiting confirmation</p>
              <p className="text-amber-400/70 text-sm">These orders will auto-cancel if not confirmed in time.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d3148]">
                {['Order ID', 'Items', 'Total', 'Status', 'Expires', 'Date', 'Action'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
              {!isLoading && orders?.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <ClipboardList size={32} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">No orders found.</p>
                  </td>
                </tr>
              )}
              {/* Pending first, then others */}
              {[...pending, ...others].map((order, idx) => (
                <motion.tr
                  key={order._id}
                  className="table-row"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{order._id.slice(-8)}…</td>
                  <td className="px-4 py-3 text-sm text-slate-300 max-w-[200px] truncate">
                    {order.items.map((i) => `${i.menuName} ×${i.quantity}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-violet-400">₹{order.totalPrice}</td>
                  <td className="px-4 py-3">
                    <Badge label={order.status.value} pulse={order.status.value === 'PENDING'} />
                  </td>
                  <td className="px-4 py-3">
                    {order.status.value === 'PENDING' && order.expiresAt ? (
                      <CountdownTimer expiresAt={order.expiresAt} />
                    ) : <span className="text-slate-600 text-sm">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    {order.status.value === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStatusModal({ order, newStatus: 'CONFIRMED' })}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-600/30 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setStatusModal({ order, newStatus: 'CANCELLED' })}
                          className="px-2.5 py-1 text-xs font-semibold bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-sm">—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title={statusModal?.newStatus === 'CONFIRMED' ? 'Confirm Order' : 'Cancel Order'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatusModal(null)}>Go Back</Button>
            <Button
              variant={statusModal?.newStatus === 'CONFIRMED' ? 'primary' : 'danger'}
              loading={changeMutation.isPending}
              onClick={() => changeMutation.mutate({ id: statusModal.order._id, status: statusModal.newStatus })}
            >
              {statusModal?.newStatus === 'CONFIRMED' ? '✓ Confirm Order' : '✕ Cancel Order'}
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          {statusModal?.newStatus === 'CONFIRMED'
            ? <>Confirm order <span className="font-mono text-slate-100">…{statusModal?.order?._id?.slice(-8)}</span> for <span className="text-violet-400 font-semibold">₹{statusModal?.order?.totalPrice}</span>?</>
            : <>Cancel order <span className="font-mono text-slate-100">…{statusModal?.order?._id?.slice(-8)}</span>? This will restock the items.</>
          }
        </p>
      </Modal>
    </AdminLayout>
  );
}

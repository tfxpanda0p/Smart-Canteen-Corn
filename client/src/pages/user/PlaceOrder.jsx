import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Trash2, CheckCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import UserLayout from '../../components/layout/UserLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function PlaceOrder() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('sc_cart');
    if (stored) {
      try { setItems(JSON.parse(stored)); }
      catch { navigate('/'); }
    } else { navigate('/'); }
  }, [navigate]);

  const update = (id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i._id === id) {
            const nextQty = i.quantity + delta;
            if (delta > 0 && nextQty > i.stock) {
              toast.error(`Only ${i.stock} ${i.name} available`);
              return i;
            }
            return { ...i, quantity: Math.max(0, nextQty) };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i._id !== id));

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleOrder = async () => {
    setLoading(true);
    try {
      const payload = items.map((i) => ({ name: i.name, quantity: i.quantity }));
      const res = await orderService.placeOrder(payload);
      sessionStorage.removeItem('sc_cart');
      
      qc.invalidateQueries({ queryKey: ['menu'] });
      qc.invalidateQueries({ queryKey: ['available-menu'] });
      qc.invalidateQueries({ queryKey: ['my-orders'] });
      qc.invalidateQueries({ queryKey: ['all-orders'] });

      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.order.orderId}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!items.length) return (
    <UserLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag size={48} className="text-slate-600" />
        <p className="text-slate-400">Your cart is empty.</p>
        <Button onClick={() => navigate('/')}>Back to Menu</Button>
      </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Review Your Order</h1>

        <div className="card divide-y divide-[#2d3148] mb-6">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <p className="font-medium text-slate-100">{item.name}</p>
                <p className="text-sm text-slate-400">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => update(item._id, -1)}
                  className="w-7 h-7 flex items-center justify-center bg-[#22263a] hover:bg-[#2d3148] border border-[#2d3148] rounded-lg transition-colors">
                  <Minus size={12} className="text-slate-300" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-slate-100">{item.quantity}</span>
                <button 
                  onClick={() => update(item._id, 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-7 h-7 flex items-center justify-center bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Plus size={12} className="text-white" />
                </button>
              </div>
              <div className="w-20 text-right">
                <p className="font-semibold text-violet-400">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button onClick={() => remove(item._id)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="card p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-slate-100 font-medium">₹{total.toFixed(2)}</span>
          </div>
          <div className="border-t border-[#2d3148] pt-3 flex justify-between items-center">
            <span className="font-semibold text-slate-100">Total</span>
            <span className="text-xl font-bold text-violet-400">₹{total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-amber-400 mt-3 flex items-center gap-1.5">
            ⏱ Order will auto-cancel in 15 minutes if not confirmed by admin.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/')} className="flex-1">
            Edit Order
          </Button>
          <Button onClick={() => setConfirmOpen(true)} className="flex-1">
            Place Order
          </Button>
        </div>
      </div>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Order"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleOrder} loading={loading}>
              <CheckCircle size={16} /> Confirm
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          Place order for{' '}
          <span className="font-semibold text-violet-400">
            {items.reduce((s, i) => s + i.quantity, 0)} item(s)
          </span>{' '}
          totalling <span className="font-semibold text-violet-400">₹{total.toFixed(2)}</span>?
        </p>
        <p className="text-sm text-amber-400/80 mt-2">
          ⚠ Order expires in 15 minutes if not confirmed.
        </p>
      </Modal>
    </UserLayout>
  );
}

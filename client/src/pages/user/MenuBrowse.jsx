import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { menuService } from '../../services/menuService';
import UserLayout from '../../components/layout/UserLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function MenuBrowse() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuService.getMenu().then((r) => r.data.data),
  });

  const addToCart = (item) => {
    const currentQty = cart[item._id]?.quantity || 0;
    if (currentQty >= item.stock) {
      toast.error(`Only ${item.stock} ${item.name} available`);
      return;
    }

    setCart((prev) => ({
      ...prev,
      [item._id]: {
        ...item,
        quantity: currentQty + 1,
      },
    }));
    toast.success(`${item.name} added!`, { duration: 1000 });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id].quantity > 1) {
        updated[id] = { ...updated[id], quantity: updated[id].quantity - 1 };
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const clearItem = (id) => setCart((prev) => { const u = { ...prev }; delete u[id]; return u; });

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => {
    if (!cartItems.length) return toast.error('Add items to your cart first');
    sessionStorage.setItem('sc_cart', JSON.stringify(cartItems));
    navigate('/order/new');
  };

  return (
    <UserLayout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-100">Today&apos;s Menu</h1>
        <p className="text-slate-400 mt-1">Order fresh items from the canteen</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && (
        <div className="card p-12 text-center">
          <UtensilsCrossed size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No items available right now.</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((item, idx) => {
            const inCart = cart[item._id]?.quantity || 0;
            return (
              <motion.div
                key={item._id}
                className="card p-5 flex flex-col gap-4 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100">{item.name}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">Stock: {item.stock}</p>
                  </div>
                  <Badge label={item.stock > 0 ? 'available' : 'unavailable'} />
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-violet-400">₹{item.price}</span>

                  {inCart === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Plus size={14} /> Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="w-7 h-7 flex items-center justify-center bg-[#22263a] hover:bg-[#2d3148] border border-[#2d3148] rounded-lg transition-colors"
                      >
                        <Minus size={12} className="text-slate-300" />
                      </button>
                      <span className="text-sm font-bold text-slate-100 w-4 text-center">{inCart}</span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={inCart >= item.stock}
                        className="w-7 h-7 flex items-center justify-center bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                      >
                        <Plus size={12} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card p-4 flex items-center justify-between gap-4 shadow-2xl border-violet-500/30 glow-violet">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={22} className="text-violet-400" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                <p className="text-xs text-slate-400">₹{cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <Button onClick={handleCheckout} size="sm">
              Checkout <ArrowRight size={14} />
            </Button>
          </div>
        </motion.div>
      )}
    </UserLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function EditMenuItem() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const qc = useQueryClient();
  const item = state?.item;

  const [form, setForm] = useState({
    name: item?.name || '',
    price: item?.price || '',
    stock: item?.stock ?? '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!item) {
      toast.error('Item not found. Go back and try again.');
      navigate('/admin/menu');
    }
  }, [item, navigate]);

  const validate = () => {
    const e = {};
    if (form.price !== '' && Number(form.price) < 0) e.price = 'Price cannot be negative';
    if (form.stock !== '' && Number(form.stock) < 0) e.stock = 'Stock cannot be negative';
    return e;
  };

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {};
      if (form.name.trim() !== item.name) payload.name = form.name.trim();
      if (String(form.price) !== String(item.price)) payload.price = Number(form.price);
      if (String(form.stock) !== String(item.stock)) payload.stock = Number(form.stock);
      return menuService.updateItem(id, payload);
    },
    onSuccess: () => {
      toast.success('Menu item updated!');
      qc.invalidateQueries({ queryKey: ['menu'] });
      navigate('/admin/menu');
    },
    onError: (err) => toast.error(err.message || 'Update failed'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    mutation.mutate();
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto animate-fade-in">
        <Link to="/admin/menu" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Menu
        </Link>

        <h1 className="text-2xl font-bold text-slate-100 mb-1">Edit Menu Item</h1>
        <p className="text-slate-400 text-sm mb-6">Only changed fields will be sent to the server.</p>

        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Item Name"
              placeholder="e.g. Masala Dosa"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
            />
            <Input
              label="Price (₹)"
              type="number"
              min="0"
              step="0.5"
              value={form.price}
              onChange={set('price')}
              error={errors.price}
            />
            <Input
              label="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={set('stock')}
              error={errors.stock}
            />

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/admin/menu')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" loading={mutation.isPending}>
                <Save size={16} /> Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

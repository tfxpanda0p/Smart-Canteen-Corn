import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function AddMenuItem() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || Number(form.price) < 0) e.price = 'Valid price is required';
    if (form.stock !== '' && Number(form.stock) < 0) e.stock = 'Stock cannot be negative';
    return e;
  };

  const mutation = useMutation({
    mutationFn: () => menuService.addItem({
      name: form.name.trim(),
      price: Number(form.price),
      stock: form.stock !== '' ? Number(form.stock) : 0,
    }),
    onSuccess: () => {
      toast.success(`"${form.name}" added to menu!`);
      qc.invalidateQueries({ queryKey: ['menu'] });
      navigate('/admin/menu');
    },
    onError: (err) => toast.error(err.message || 'Failed to add item'),
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

        <h1 className="text-2xl font-bold text-slate-100 mb-6">Add Menu Item</h1>

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
              placeholder="e.g. 50"
              value={form.price}
              onChange={set('price')}
              error={errors.price}
            />
            <Input
              label="Initial Stock"
              type="number"
              min="0"
              placeholder="e.g. 100  (leave empty for 0)"
              value={form.stock}
              onChange={set('stock')}
              error={errors.stock}
            />

            <div className="p-3 bg-[#22263a] rounded-xl border border-[#2d3148] text-sm text-slate-400">
              💡 Item will be marked <span className="text-emerald-400 font-medium">Available</span> automatically if stock is greater than 0.
            </div>

            <Button type="submit" className="w-full" loading={mutation.isPending} size="lg">
              <Save size={16} /> Add to Menu
            </Button>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, UtensilsCrossed } from 'lucide-react';
import { menuService } from '../../services/menuService';
import AdminLayout from '../../components/layout/AdminLayout';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { SkeletonRow } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function MenuManagement() {
  const qc = useQueryClient();
  const [deleteItem, setDeleteItem] = useState(null);

  const { data: menu, isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: () => menuService.getMenu().then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => menuService.deleteItem(id),
    onSuccess: () => {
      toast.success('Item deleted successfully');
      qc.invalidateQueries({ queryKey: ['menu'] });
      setDeleteItem(null);
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Menu Management</h1>
          <p className="text-slate-400 mt-1">{menu?.length || 0} items in total</p>
        </div>
        <Link to="/admin/menu/add">
          <Button><Plus size={16} /> Add Item</Button>
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d3148]">
                {['Item Name', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              {menu?.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <UtensilsCrossed size={32} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">No menu items yet.</p>
                    <Link to="/admin/menu/add" className="text-violet-400 hover:underline text-sm mt-1 inline-block">Add your first item →</Link>
                  </td>
                </tr>
              )}
              {menu?.map((item, idx) => (
                <motion.tr
                  key={item._id || idx}
                  className="table-row"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <td className="px-4 py-3 font-medium text-slate-100">{item.name}</td>
                  <td className="px-4 py-3 font-semibold text-violet-400">₹{item.price}</td>
                  <td className="px-4 py-3 text-slate-300">{item.stock}</td>
                  <td className="px-4 py-3">
                    <Badge label={item.stock > 0 ? 'available' : 'unavailable'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/menu/edit/${item._id}`}
                        state={{ item }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-600/10 transition-all"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-600/10 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Menu Item"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteItem._id)}
            >
              <Trash2 size={15} /> Delete
            </Button>
          </>
        }
      >
        <p className="text-slate-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-100">&quot;{deleteItem?.name}&quot;</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </AdminLayout>
  );
}

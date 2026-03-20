import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Menu, X } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
];

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col gap-1 p-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 py-2">
        Admin Panel
      </p>
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </div>
  );
}

export function AdminSidebarDesktop() {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#1a1d27] border-r border-[#2d3148] min-h-[calc(100vh-4rem)] sticky top-16">
      <SidebarContent />
    </aside>
  );
}

export function AdminSidebarMobile() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 bg-violet-600 hover:bg-violet-700 rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <Menu size={20} className="text-white" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#1a1d27] border-r border-[#2d3148] lg:hidden"
              initial={{ x: -264 }} animate={{ x: 0 }} exit={{ x: -264 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-[#2d3148]">
                <span className="font-semibold text-slate-100">Admin Panel</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

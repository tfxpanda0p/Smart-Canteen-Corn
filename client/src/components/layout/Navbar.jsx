import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Menu, X, ShoppingBag, ClipboardList, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const userLinks = [
  { to: '/', label: 'Menu', icon: UtensilsCrossed },
  { to: '/orders', label: 'My Orders', icon: ClipboardList },
];

const adminExtraLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'admin' ? [...adminExtraLinks, ...userLinks] : userLinks;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-[#2d3148] bg-[#0f1117]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center group-hover:bg-violet-500 transition-colors">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-100 text-lg hidden sm:block">
              Smart<span className="text-gradient">Canteen</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(to)
                    ? 'bg-violet-600/20 text-violet-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* User chip */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a1d27] border border-[#2d3148] rounded-xl">
              <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-slate-300 font-medium">{user?.username}</span>
              {user?.role === 'admin' && (
                <span className="text-xs px-1.5 py-0.5 bg-violet-600/20 text-violet-400 rounded-md font-medium">
                  Admin
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
            >
              <LogOut size={16} />
              Logout
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-16 left-0 right-0 z-30 bg-[#1a1d27] border-b border-[#2d3148] md:hidden p-4 flex flex-col gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{user?.username}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
              </div>
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-violet-600/20 text-violet-400'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2"><Icon size={16} />{label}</span>
                  <ChevronRight size={14} className="text-slate-500" />
                </Link>
              ))}
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-1"
              >
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

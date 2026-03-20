import Navbar from './Navbar';
import { AdminSidebarDesktop, AdminSidebarMobile } from './Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />
      <div className="flex pt-16">
        <AdminSidebarDesktop />
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
      <AdminSidebarMobile />
    </div>
  );
}

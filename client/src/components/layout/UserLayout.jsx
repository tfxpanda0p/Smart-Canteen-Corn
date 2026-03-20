import Navbar from './Navbar';

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        {children}
      </main>
    </div>
  );
}

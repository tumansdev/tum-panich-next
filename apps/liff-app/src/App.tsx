import React from 'react';
import { Home, ShoppingBag, User, Utensils } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-header">
        <h1 className="text-lg font-bold text-brand-700">Tum Panich</h1>
      </header>

      {/* spacer for header */}
      <div className="h-14"></div>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Banner */}
        <div className="w-full h-40 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-900 to-transparent opacity-50"></div>
          <span className="relative z-10 text-xl">Review Queue Status</span>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MenuCard title="Food" icon={<Utensils size={24} />} color="bg-orange-100 text-orange-600" />
          <MenuCard title="Drinks" icon={<ShoppingBag size={24} />} color="bg-blue-100 text-blue-600" />
          {/* Mock items */}
        </div>

        {/* Recent Order */}
        <div className="glass-card">
          <h2 className="font-bold text-slate-800 mb-2">Current Order</h2>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
             <div className="flex justify-between text-sm">
                <span>Pad Thai</span>
                <span className="font-semibold">Top Priority</span>
             </div>
             <div className="text-xs text-slate-400 mt-1">Cooking...</div>
          </div>
          <button className="btn-primary">View Details</button>
        </div>
      </main>

      {/* spacer for navbar */}
      <div className="h-20"></div>

      {/* Bottom Nav */}
      <nav className="nav-bar">
        <NavItem icon={<Home size={24} />} label="Menu" active />
        <NavItem icon={<ShoppingBag size={24} />} label="Cart" />
        <NavItem icon={<User size={24} />} label="Profile" />
      </nav>
    </div>
  )
}

function MenuCard({ title, icon, color }: { title: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center py-6 gap-2 active:scale-95 transition-transform cursor-pointer">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <span className="font-medium text-slate-700">{title}</span>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center justify-center w-full h-full ${active ? 'text-brand-600' : 'text-slate-400'}`}>
      {icon}
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  )
}

export default App

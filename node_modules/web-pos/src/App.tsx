import { LayoutDashboard, ShoppingBag, History, Settings } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 glass-panel m-4 flex flex-col items-center py-6 h-[calc(100vh-2rem)] fixed left-0 top-0">
        <div className="text-2xl font-bold text-brand-700 mb-8 tracking-tight">
          Tum Panich <span className="text-xs block text-slate-500 font-normal">Next Gen POS</span>
        </div>
        
        <nav className="w-full px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<ShoppingBag size={20} />} label="New Order" />
          <NavItem icon={<History size={20} />} label="History" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="mt-auto w-full px-4">
          <div className="glass-card p-3 text-sm text-slate-600">
            <div className="font-semibold">Staff: Admin</div>
            <div className="text-xs text-green-600">● Online</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[18rem] p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Welcome back to Tum Panich POS</p>
          </div>
          <button className="btn-primary">
            Open Cash Drawer
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Sales" value="฿24,500" trend="+12%" />
          <StatCard title="Active Orders" value="18" trend="Busy" color="text-brand-600" />
          <StatCard title="Online Customers" value="45" trend="Live" />
        </div>

        {/* Recent Orders Table Area (Mock) */}
        <div className="glass-card p-6 min-h-[400px]">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Recent Orders</h2>
          <div className="text-slate-400 text-center py-20">
            Order list will appear here...
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-brand-50 text-brand-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-brand-700'}`}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

function StatCard({ title, value, trend, color = 'text-slate-900' }: { title: string, value: string, trend: string, color?: string }) {
  return (
    <div className="glass-card p-6">
      <div className="text-slate-500 text-sm mb-1">{title}</div>
      <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
      <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">{trend}</div>
    </div>
  )
}

export default App

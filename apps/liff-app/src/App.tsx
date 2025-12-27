import { useState, useEffect } from 'react';
import { initializeLiff, getProfile, isLoggedIn } from './lib/liff';
import { LiffProfile, Product } from './types';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { noodleOptions } from './data/menu';
import { useCartStore } from './stores/cartStore';
import { X } from 'lucide-react';

type Tab = 'home' | 'menu' | 'cart' | 'profile';
type View = 'main' | 'checkout' | 'order-status';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [view, setView] = useState<View>('main');
  const [orderId, setOrderId] = useState<string>('');
  const [liffReady, setLiffReady] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  
  // Product option modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedNoodle, setSelectedNoodle] = useState<string>('');
  const addItem = useCartStore((state) => state.addItem);

  // Initialize LIFF
  useEffect(() => {
    async function init() {
      const success = await initializeLiff();
      setLiffReady(true);
      
      if (success && isLoggedIn()) {
        const userProfile = await getProfile();
        setProfile(userProfile);
      }
    }
    init();
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setView('main');
  };

  const handleNavigate = (tab: 'menu' | 'cart') => {
    setActiveTab(tab);
  };

  const handleCheckout = () => {
    setView('checkout');
  };

  const handleOrderComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setView('order-status');
  };

  const handleBackToHome = () => {
    setView('main');
    setActiveTab('home');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedNoodle(noodleOptions.choices[0]);
  };

  const handleAddWithOptions = () => {
    if (selectedProduct) {
      addItem(selectedProduct, 1, { 'noodle-type': selectedNoodle });
      setSelectedProduct(null);
    }
  };

  // Loading screen
  if (!liffReady) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <span className="text-2xl">🍜</span>
          </div>
          <p className="text-brand-700 font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md flex items-center justify-center z-50 border-b border-brand-100 shadow-sm">
        <h1 className="text-lg font-bold text-brand-700 flex items-center gap-2">
          <span className="text-xl">🍜</span>
          ตั้มพานิช
        </h1>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Main Content */}
      <main className="p-4 pb-24">
        {view === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomePage 
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {activeTab === 'menu' && (
              <MenuPage onSelectProduct={handleSelectProduct} />
            )}
            {activeTab === 'cart' && (
              <CartPage onCheckout={handleCheckout} />
            )}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                {profile ? (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                    <img
                      src={profile.pictureUrl || '/default-avatar.png'}
                      alt={profile.displayName}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-slate-800">{profile.displayName}</h3>
                      <p className="text-sm text-slate-500">{profile.statusMessage}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👤</span>
                    </div>
                    <h3 className="font-bold text-slate-700 mb-1">ยังไม่ได้เข้าสู่ระบบ</h3>
                    <p className="text-slate-500 text-sm mb-4">เข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อ</p>
                  </div>
                )}
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-bold text-amber-800 mb-2">📍 ร้าน ตั้มพานิช</h4>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p>🕐 เปิดบริการ: 07:00 - 14:00 น.</p>
                    <p>📞 โทร: 0xx-xxx-xxxx</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'checkout' && (
          <CheckoutPage
            onBack={() => setView('main')}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {view === 'order-status' && (
          <OrderStatusPage
            orderId={orderId}
            onBack={handleBackToHome}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {view === 'main' && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* Noodle Options Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 space-y-4 animate-slide-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{selectedProduct.name}</h3>
                <p className="text-brand-700 font-bold">฿{selectedProduct.price}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"
              >
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 mb-2">🍜 เลือกเส้น</h4>
              <div className="grid grid-cols-2 gap-2">
                {noodleOptions.choices.map((noodle) => (
                  <button
                    key={noodle}
                    onClick={() => setSelectedNoodle(noodle)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedNoodle === noodle
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {noodle}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddWithOptions}
              className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

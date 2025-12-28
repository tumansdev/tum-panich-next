import { useState, useEffect } from 'react';
import { initializeLiff, getProfile, isLoggedIn } from './lib/liff';
import { LiffProfile, Product } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { ProfilePage } from './pages/ProfilePage';
import { OurStoryPage } from './pages/OurStoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { noodleOptions } from './data/menu';
import { useCartStore } from './stores/cartStore';
import { X } from 'lucide-react';

type Tab = 'home' | 'orders' | 'cart' | 'story' | 'profile';
type View = 'main' | 'checkout' | 'order-status' | 'menu';

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
        // Save user ID to localStorage for orders tracking
        if (userProfile?.userId) {
          localStorage.setItem('liff_user_id', userProfile.userId);
        }
      }
    }
    init();
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setView('main');
  };

  const handleNavigate = (target: 'menu' | 'cart') => {
    if (target === 'menu') {
      setView('menu');
    } else {
      setActiveTab('cart');
    }
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

  const handleBackToMain = () => {
    setView('main');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedNoodle(noodleOptions.choices[0]);
  };

  const handleAddWithOptions = () => {
    if (selectedProduct) {
      addItem(selectedProduct, { 'noodle-type': selectedNoodle });
      setSelectedProduct(null);
    }
  };

  // Loading screen
  if (!liffReady) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <img src="/images/logo.png" alt="Logo" className="w-14 h-14 rounded-xl" />
          </div>
          <p className="text-brand-700 font-medium">กำลังโหลด...</p>
          <p className="text-slate-500 text-sm mt-1">ยินดีต้อนรับสู่ ตั้มพานิช</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header with navigation breadcrumb */}
      <Header activeTab={activeTab} view={view} onBack={handleBackToMain} />

      {/* Main Content */}
      <main className="p-4 pt-2 pb-24">
        {view === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomePage 
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersPage />
            )}
            {activeTab === 'cart' && (
              <CartPage onCheckout={handleCheckout} />
            )}
            {activeTab === 'story' && (
              <OurStoryPage />
            )}
            {activeTab === 'profile' && (
              <ProfilePage profile={profile} />
            )}
          </>
        )}

        {view === 'menu' && (
          <div>
            <button
              onClick={handleBackToMain}
              className="mb-3 text-brand-600 text-sm font-medium flex items-center gap-1"
            >
              ← กลับหน้าแรก
            </button>
            <MenuPage onSelectProduct={handleSelectProduct} />
          </div>
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
      {(view === 'main' || view === 'menu') && (
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

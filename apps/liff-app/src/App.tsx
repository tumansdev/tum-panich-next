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
import { noodleOptions } from './config/menuOptions';
import { useCartStore } from './stores/cartStore';
import { X } from 'lucide-react';

type Tab = 'home' | 'orders' | 'cart' | 'story' | 'profile';
type View = 'main' | 'checkout' | 'order-status' | 'menu';

// Tab titles for Header
const tabTitles: Record<Tab, { title: string; subtitle: string }> = {
  home: { title: 'ตั้มพานิช', subtitle: 'ข้าวหมูแดง บะหมี่หมูแดง หมูกรอบ' },
  orders: { title: 'ออเดอร์ของฉัน', subtitle: 'ติดตามคำสั่งซื้อ' },
  cart: { title: 'ตะกร้าสินค้า', subtitle: 'สรุปรายการสั่งซื้อ' },
  story: { title: 'เรื่องราวของเรา', subtitle: 'ความเป็นมาร้าน ตั้มพานิช' },
  profile: { title: 'โปรไฟล์', subtitle: 'ข้อมูลส่วนตัว' },
};

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

  const handleBackToCart = () => {
    setView('main');
    setActiveTab('cart');
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

  // Get header config based on current view/tab
  const getHeaderConfig = () => {
    if (view === 'main') {
      return {
        ...tabTitles[activeTab],
        view: 'main' as View,
        onBack: undefined,
      };
    }
    return {
      title: undefined, // Use default from view
      subtitle: undefined,
      view: view,
      onBack: view === 'checkout' ? handleBackToCart : handleBackToMain,
    };
  };

  const headerConfig = getHeaderConfig();

  // Loading screen
  if (!liffReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-700 via-brand-600 to-amber-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
            <img src="/images/logo.png" alt="Logo" className="w-18 h-18 rounded-2xl" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">ตั้มพานิช</h1>
          <p className="text-white/80">ก๋วยเตี๋ยวงบ 100 อร่อยถูก</p>
          <div className="mt-6 flex justify-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header - Always Visible */}
      <Header {...headerConfig} />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-24">
        {view === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomePage 
                profile={profile}
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
          <MenuPage onSelectProduct={handleSelectProduct} />
        )}

        {view === 'checkout' && (
          <CheckoutPage
            onBack={handleBackToCart}
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

      {/* Bottom Navigation - Always Visible */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Noodle Options Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 space-y-4 animate-slide-up safe-area-bottom">
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
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 transition-all"
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

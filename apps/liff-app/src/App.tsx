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
import { Loading } from './components/ui/Loading';
import { Dialog } from './components/ui/Dialog';
import { storeAPI, StoreStatusResponse, SpecialMenuResponse } from './lib/api';
import { SpecialPopup } from './components/SpecialPopup';
import { PDPAConsent } from './components/PDPAConsent';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { FavoritesPage } from './pages/FavoritesPage';
import { X } from 'lucide-react';

type Tab = 'home' | 'orders' | 'cart' | 'story' | 'profile';
type View = 'main' | 'checkout' | 'order-status' | 'menu' | 'favorites';

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

  // Store Status
  const [storeStatus, setStoreStatus] = useState<StoreStatusResponse | null>(null);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  
  // Special Menu Popup
  const [specialMenu, setSpecialMenu] = useState<SpecialMenuResponse | null>(null);
  const [showSpecialPopup, setShowSpecialPopup] = useState(false);

  // PDPA Consent
  const [pdpaConsent, setPdpaConsent] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pdpa_consent');
      return saved ? JSON.parse(saved).accepted === true : false;
    } catch {
      return false;
    }
  });
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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
    
    // Check store status - initial fetch
    const fetchStoreStatus = () => {
      storeAPI.getStatus().then(status => {
        setStoreStatus(status);
      }).catch(() => {});
    };
    
    fetchStoreStatus();
    
    // ⏱️ Realtime polling every 30 seconds
    const storeStatusInterval = setInterval(fetchStoreStatus, 30000);
    
    // Check special menu (only once)
    storeAPI.getSpecialMenu().then(menu => {
      if (menu.active) {
        setSpecialMenu(menu);
        setShowSpecialPopup(true);
      }
    }).catch(() => {});
    
    // Cleanup
    return () => {
      clearInterval(storeStatusInterval);
    };
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
    if (storeStatus && !storeStatus.isOpen) {
      setShowStoreDialog(true);
      return;
    }
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
        profile: profile,
        activeTab: activeTab,
        storeStatus: storeStatus || undefined,
      };
    }
    return {
      title: undefined, // Use default from view
      subtitle: undefined,
      view: view,
      onBack: view === 'checkout' ? handleBackToCart : handleBackToMain,
      activeTab: undefined,
    };
  };

  const headerConfig = getHeaderConfig();

  // PDPA Consent Handler
  const handlePDPAAccept = () => {
    try {
      localStorage.setItem('pdpa_consent', JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString()
      }));
    } catch {
      // localStorage may not be available
    }
    setPdpaConsent(true);
    setShowPrivacyPolicy(false);
  };

  // Loading screen
  if (!liffReady) {
    return (
      <Loading />
    );
  }

  // PDPA Consent Screen - Must accept before using app
  if (!pdpaConsent) {
    if (showPrivacyPolicy) {
      return (
        <PrivacyPolicy 
          onBack={() => setShowPrivacyPolicy(false)}
          onAccept={handlePDPAAccept}
        />
      );
    }
    return (
      <PDPAConsent 
        onAccept={handlePDPAAccept}
        onViewPolicy={() => setShowPrivacyPolicy(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Special Menu Popup */}
      {showSpecialPopup && specialMenu && (
        <SpecialPopup
          title={specialMenu.title}
          description={specialMenu.description}
          emoji={specialMenu.emoji}
          onClose={() => setShowSpecialPopup(false)}
        />
      )}

      {/* Header - Always Visible */}
      <Header {...headerConfig} />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-24">
        {view === 'main' && (
          <>
            {activeTab === 'home' && (
              <HomePage 
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersPage onOrderClick={handleOrderComplete} />
            )}
            {activeTab === 'cart' && (
              <CartPage onCheckout={handleCheckout} />
            )}
            {activeTab === 'story' && (
              <OurStoryPage />
            )}
            {activeTab === 'profile' && (
              <ProfilePage 
                profile={profile} 
                onShowFavorites={() => setView('favorites')}
              />
            )}
          </>
        )}

        {view === 'menu' && (
          <MenuPage onSelectProduct={handleSelectProduct} />
        )}

        {view === 'favorites' && (
          <FavoritesPage 
            onBack={() => setView('main')}
            onSelectProduct={handleSelectProduct}
          />
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
      
      {/* Store Closed Dialog */}
      <Dialog 
        isOpen={showStoreDialog}
        type="warning"
        title="ขออภัย ร้านปิดอยู่ครับ 😴"
        message={storeStatus?.message || "วันนี้ร้านหยุดให้บริการชั่วคราว ไว้แวะมาใหม่น้าา"}
        confirmText="เข้าใจแล้ว"
        onConfirm={() => setShowStoreDialog(false)}
      />
    </div>
  );
}

export default App;

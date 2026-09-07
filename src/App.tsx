import React, { useState, useEffect, Suspense } from 'react';
import { DishItem, BranchType, CartItem } from './types';
import { getStoredDishes, saveStoredDishes, DEFAULT_DISHES, RESTAURANT_INFO } from './data/dishes';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { MobileFrame } from './components/MobileFrame';

// Lazy load heavy admin & photo modals to make initial app load lightweight and super fast
const AdminModal = React.lazy(() =>
  import('./components/AdminModal').then((m) => ({ default: m.AdminModal }))
);
const MenuPhotoModal = React.lazy(() =>
  import('./components/MenuPhotoModal').then((m) => ({ default: m.MenuPhotoModal }))
);

export default function App() {
  const [dishes, setDishes] = useState<DishItem[]>(() => {
    try {
      return getStoredDishes();
    } catch {
      return DEFAULT_DISHES;
    }
  });
  const [activeBranch, setActiveBranch] = useState<BranchType>('seafood');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [photoMenuInitialTab, setPhotoMenuInitialTab] = useState<'seafood' | 'syrian'>('seafood');
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);

  // Initialize dishes from LocalStorage cache
  useEffect(() => {
    const loaded = getStoredDishes();
    setDishes(loaded);

    // Also load existing cart if saved
    try {
      const savedCart = localStorage.getItem('sultan_mahmud_cart_v2');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync cart to localStorage
  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('sultan_mahmud_cart_v2', JSON.stringify(newCart));
    } catch {
      // ignore
    }
  };

  // Add dish to cart
  const handleAddToCart = (dish: Partial<DishItem>, quantity = 1, notes = '') => {
    const dishComplete: DishItem = {
      id: dish.id || `dish-${Date.now()}`,
      name: dish.name || 'وجبة السلطان',
      nameEn: dish.nameEn || '',
      branch: dish.branch === 'syrian' ? 'syrian' : 'seafood',
      category: dish.category || 'meals',
      price: dish.price || 0,
      description: dish.description || '',
      image: dish.image || '',
      available: dish.available ?? true,
      hasSteam: dish.hasSteam ?? false,
      spicyLevel: dish.spicyLevel,
      badge: dish.badge,
      badgeText: dish.badgeText,
      sizes: dish.sizes,
    };

    const existingIndex = cart.findIndex((item) => item.dish.id === dishComplete.id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      if (notes) {
        updatedCart[existingIndex].notes = notes;
      }
    } else {
      updatedCart = [...cart, { dish: dishComplete, quantity, notes }];
    }

    updateCartState(updatedCart);
  };

  // Open photo menu with specific branch tab
  const handleOpenPhotoMenu = (branch?: 'seafood' | 'syrian') => {
    const targetBranch = branch || (activeBranch === 'syrian' ? 'syrian' : 'seafood');
    setPhotoMenuInitialTab(targetBranch);
    setIsPhotoMenuOpen(true);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (dishId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.dish.id === dishId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    updateCartState(updated);
  };

  // Remove item from cart
  const handleRemoveItem = (dishId: string) => {
    const updated = cart.filter((item) => item.dish.id !== dishId);
    updateCartState(updated);
  };

  // Clear cart
  const handleClearCart = () => {
    updateCartState([]);
  };

  // Direct WhatsApp order for single dish
  const handleDirectWhatsApp = (dish: DishItem, quantity = 1, notes = '') => {
    const branchName = dish.branch === 'seafood' ? 'فرع الأسماك' : 'الفرع السوري';
    let text = `مرحباً مطعم السلطان محمود، أريد طلب:%0A%0A`;
    text += `*${encodeURIComponent(dish.name)}* (${branchName})%0A`;
    text += `الكمية: ${quantity}%0A`;
    text += `السعر الإجمالي: ${dish.price * quantity} ج.م%0A`;
    if (notes) {
      text += `ملاحظات: ${encodeURIComponent(notes)}%0A`;
    }
    text += `%0Aرجاء تأكيد الطلب وسعر التوصيل. شكراً لك!`;

    const url = `https://wa.me/${RESTAURANT_INFO.phoneRaw}?text=${text}`;
    window.open(url, '_blank');
  };

  // Admin save updated dishes
  const handleSaveDishes = (updatedDishes: DishItem[]) => {
    setDishes(updatedDishes);
    saveStoredDishes(updatedDishes);
  };

  const handleOpenFullMenu = (branch?: BranchType) => {
    if (branch) {
      setActiveBranch(branch);
    }
    const menuEl = document.getElementById('menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <MobileFrame
      isSimulated={isMobileSimulated}
      onToggle={() => setIsMobileSimulated(!isMobileSimulated)}
    >
      {/* Main Navigation Header */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* Cinematic Dual-Theme Hero */}
        <Hero
          onSelectBranch={(branch) => handleOpenFullMenu(branch)}
          onExploreMenu={() => handleOpenFullMenu()}
        />

        {/* Menu Section with compact on-page view + full-screen overlay */}
        <MenuSection
          dishes={dishes}
          activeBranch={activeBranch}
          onSelectBranch={setActiveBranch}
          onAddToCart={(dish) => handleAddToCart(dish, 1)}
          onSelectDish={(dish) => setSelectedDish(dish)}
          onOrderWhatsApp={(dish) => handleDirectWhatsApp(dish, 1)}
          isOpen={isMenuOpen}
          onOpen={() => setIsMenuOpen(true)}
          onClose={() => setIsMenuOpen(false)}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToTop={handleScrollToTop}
      />

      {/* Unified Bottom Action Bar (Menu, Cart, WhatsApp & Admin) */}
      <FloatingActions
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMenu={() => handleOpenFullMenu()}
      />

      {/* Dish Detail Presentation Modal */}
      <DishModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
        onDirectWhatsApp={handleDirectWhatsApp}
      />

      {/* Cart Drawer Slide-out with WhatsApp Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Admin Panel Modal (Loaded lazily on demand) */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            dishes={dishes}
            onSaveDishes={handleSaveDishes}
          />
        </Suspense>
      )}

      {/* Official Illustrated Menu Photo Modal (Loaded lazily on demand) */}
      {isPhotoMenuOpen && (
        <Suspense fallback={null}>
          <MenuPhotoModal
            isOpen={isPhotoMenuOpen}
            onClose={() => setIsPhotoMenuOpen(false)}
            initialTab={photoMenuInitialTab}
            onAddToCart={handleAddToCart}
          />
        </Suspense>
      )}
    </MobileFrame>
  );
}

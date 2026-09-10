import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { Footer } from './components/Footer';
import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingActions } from './components/FloatingActions';
import { MobileFrame } from './components/MobileFrame';
import { CategoryStoryItem } from './components/CategoryStories';
import { DEFAULT_DISHES, getStoredDishes, saveStoredDishes, RESTAURANT_INFO, getAllMenuImageUrls } from './data/dishes';
import { DishItem, CartItem, BranchType } from './types';
import { preloadAllImages } from './utils/imagePreloader';

// Lazy load non-critical components to optimize performance for up to 5000+ users
const AdminModal = lazy(() =>
  import('./components/AdminModal').then((m) => ({ default: m.AdminModal }))
);
const MenuPhotoModal = lazy(() =>
  import('./components/MenuPhotoModal').then((m) => ({ default: m.MenuPhotoModal }))
);
const FamilyFeastWheelModal = lazy(() =>
  import('./components/FamilyFeastWheelModal').then((m) => ({ default: m.FamilyFeastWheelModal }))
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
  const [isFeastWheelOpen, setIsFeastWheelOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [photoMenuInitialTab, setPhotoMenuInitialTab] = useState<'seafood' | 'syrian'>('seafood');
  const [isMobileSimulated, setIsMobileSimulated] = useState(false);

  // Category filters connected with Hero
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Initialize dishes and cart from localStorage
  useEffect(() => {
    const loaded = getStoredDishes();
    setDishes(loaded);

    // Warm up image cache for all loaded dishes
    try {
      const urls = loaded.map((d) => d.image).filter(Boolean);
      preloadAllImages(urls);
    } catch {
      // ignore
    }

    try {
      const savedCart = localStorage.getItem('sultan_mahmud_cart_v2');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      // ignore
    }
  }, []);

  // Close all modals helper - ensures no two modals/drawers overlap
  const closeAllModals = () => {
    setIsCartOpen(false);
    setIsAdminOpen(false);
    setSelectedDish(null);
    setIsPhotoMenuOpen(false);
  };

  // Mutually exclusive modal openers
  const handleOpenCart = () => {
    closeAllModals();
    setIsCartOpen(true);
  };

  const handleOpenAdmin = () => {
    closeAllModals();
    setIsAdminOpen(true);
  };

  const handleSelectDish = (dish: DishItem) => {
    closeAllModals();
    setSelectedDish(dish);
  };

  const handleOpenPhotoMenu = (tab: 'seafood' | 'syrian' = 'seafood') => {
    closeAllModals();
    setPhotoMenuInitialTab(tab);
    setIsPhotoMenuOpen(true);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      ingredients: dish.ingredients || [],
      sizes: dish.sizes,
      prepTimeMinutes: dish.prepTimeMinutes,
      calories: dish.calories,
    };

    const existingIndex = cart.findIndex((item) => item.dish.id === dishComplete.id);

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + quantity,
        notes: notes || updatedCart[existingIndex].notes,
      };
    } else {
      updatedCart = [
        ...cart,
        {
          dish: dishComplete,
          quantity,
          selectedSize: dish.sizes?.[0]?.name,
          notes,
        },
      ];
    }

    updateCartState(updatedCart);
  };

  // Update quantity
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

  const handleSelectStoryCategory = (story: CategoryStoryItem) => {
    setActiveBranch(story.branch);
    if (story.subCategory) {
      setSelectedCategory(story.subCategory);
    } else {
      setSelectedCategory('all');
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
        onOpenCart={handleOpenCart}
        cartCount={totalCartCount}
      />

      {/* Main Page Body */}
      <main className="flex-1 pb-24">
        {/* App-Style Hero with Category Stories & Converging Entrance */}
        <Hero
          onSelectCategory={handleSelectStoryCategory}
          activeCategory={selectedCategory}
        />

        {/* 2-Column Product Grid with High-Speed Converging Entrance */}
        <MenuSection
          dishes={dishes}
          activeBranch={activeBranch}
          onSelectBranch={setActiveBranch}
          onAddToCart={(dish) => handleAddToCart(dish, 1)}
          onSelectDish={handleSelectDish}
          onOrderWhatsApp={(dish) => handleDirectWhatsApp(dish, 1)}
          isOpen={isMenuOpen}
          onOpen={() => setIsMenuOpen(true)}
          onClose={() => setIsMenuOpen(false)}
          cartCount={totalCartCount}
          onOpenCart={handleOpenCart}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onOpenFeastWheel={() => setIsFeastWheelOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onScrollToTop={handleScrollToTop}
      />

      {/* Bottom App Navigation Bar with Center Home Button */}
      <FloatingActions
        cartCount={totalCartCount}
        onOpenCart={handleOpenCart}
        onOpenAdmin={handleOpenAdmin}
        onOpenMenu={() => handleOpenFullMenu()}
        onScrollToTop={handleScrollToTop}
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

      {/* 3D Circular Orbital Family Feast Showcase (Replicating the video) */}
      {isFeastWheelOpen && (
        <Suspense fallback={null}>
          <FamilyFeastWheelModal
            isOpen={isFeastWheelOpen}
            onClose={() => setIsFeastWheelOpen(false)}
            initialBranch={activeBranch}
            onAddToCart={(dish) => handleAddToCart(dish, 1)}
            onOrderWhatsApp={(dish) => handleDirectWhatsApp(dish, 1)}
            onSelectDish={handleSelectDish}
          />
        </Suspense>
      )}
    </MobileFrame>
  );
}

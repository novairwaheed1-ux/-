import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  Waves,
  UtensilsCrossed,
  X,
  ShoppingBag,
} from 'lucide-react';
import { DishItem, BranchType } from '../types';
import { FoodCard } from './FoodCard';
import { sultanChefLogoImg } from '../data/dishes';

interface MenuSectionProps {
  dishes: DishItem[];
  activeBranch: BranchType;
  onSelectBranch: (branch: BranchType) => void;
  onAddToCart: (dish: DishItem) => void;
  onSelectDish: (dish: DishItem) => void;
  onOrderWhatsApp: (dish: DishItem) => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  dishes,
  activeBranch,
  onSelectBranch,
  onAddToCart,
  onSelectDish,
  onOrderWhatsApp,
  cartCount = 0,
  onOpenCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentBranch: 'seafood' | 'syrian' =
    activeBranch === 'syrian' ? 'syrian' : 'seafood';

  // Sub-categories depending on branch
  const seafoodCategories = [
    { id: 'all', label: 'جميع الأصناف' },
    { id: 'meals', label: 'وجبات وبحريات' },
    { id: 'sandwiches', label: 'ساندوتشات' },
    { id: 'casseroles', label: 'طواجن' },
    { id: 'appetizers', label: 'مقبلات وسلطات' },
  ];

  const syrianCategories = [
    { id: 'all', label: 'جميع الأصناف' },
    { id: 'grills', label: 'مشويات عالفحم' },
    { id: 'shawarma', label: 'شاورما عربي' },
    { id: 'crepes', label: 'كريب وساندوتشات' },
    { id: 'fatila', label: 'فتيلة السلطان' },
    { id: 'meals', label: 'بروستد ووجبات' },
    { id: 'sides', label: 'مقبلات وصوصات' },
  ];

  const activeCategories = currentBranch === 'seafood' ? seafoodCategories : syrianCategories;

  // Filter dishes strictly by branch, sub-category, and search query
  const displayedDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (dish.branch !== currentBranch) return false;

      // Category filter
      if (selectedCategory !== 'all') {
        if (dish.category !== selectedCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = dish.name.toLowerCase().includes(query);
        const matchNameEn = dish.nameEn?.toLowerCase().includes(query);
        const matchDesc = dish.description.toLowerCase().includes(query);
        const matchIng = dish.ingredients?.some((ing) => ing.toLowerCase().includes(query));
        return matchName || matchNameEn || matchDesc || matchIng;
      }

      return true;
    });
  }, [dishes, currentBranch, selectedCategory, searchQuery]);

  const seafoodCount = dishes.filter((d) => d.branch === 'seafood').length;
  const syrianCount = dishes.filter((d) => d.branch === 'syrian').length;

  return (
    <section id="menu-section" className="py-8 sm:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading & Interactive Branch Switcher */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-white border border-[#231811]">
                <img
                  src={sultanChefLogoImg}
                  alt="لوجو مطعم السلطان محمود"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#231811]">
              قائمة طعام مطعم السلطان محمود
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#705a49] font-bold">
            ديروط • اضغط على أي صنف لتفاصيله أو إضافته للسلة أو الطلب الفوري عبر واتساب
          </p>

          {/* Department Tabs Switcher */}
          <div className="mt-5 flex items-center p-1.5 rounded-2xl bg-[#f2ebd9] border border-[#d8cdbc] shadow-inner max-w-lg w-full justify-center gap-1.5">
            <button
              type="button"
              id="tab-seafood-branch"
              onClick={() => {
                onSelectBranch('seafood');
                setSelectedCategory('all');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                currentBranch === 'seafood'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-[#544131] hover:text-black hover:bg-white/50'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>قسم الأسماك ({seafoodCount})</span>
            </button>

            <button
              type="button"
              id="tab-syrian-branch"
              onClick={() => {
                onSelectBranch('syrian');
                setSelectedCategory('all');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                currentBranch === 'syrian'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-[#544131] hover:text-black hover:bg-white/50'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>القسم السوري ({syrianCount})</span>
            </button>

            {/* In-Menu Cart Quick Access Button */}
            {onOpenCart && (
              <button
                type="button"
                id="menu-bar-cart-btn"
                onClick={onOpenCart}
                className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#231811] hover:bg-black text-amber-300 text-xs font-black shadow-sm cursor-pointer transition-all border border-amber-500/40"
                title="عرض سلة الطلبات"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">السلة</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-[#231811] text-[10px] font-mono font-black">
                  {cartCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls: Search & Sub-category Pills */}
        <div className="bg-white/95 rounded-2xl p-4 border border-[#e4dcce] shadow-xs mb-8">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-4">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`ابحث في ${currentBranch === 'seafood' ? 'قسم الأسماك والبحريات' : 'القسم السوري والمشويات'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-[#faf6f0] border border-[#ddd2c0] focus:border-amber-500 focus:outline-hidden font-medium text-[#231811] placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sub-Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? currentBranch === 'seafood'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-orange-600 text-white shadow-sm'
                    : 'bg-[#faf6f0] hover:bg-stone-100 text-[#544131] border border-[#e0d6c7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food Dishes Grid - Rendered directly in page for instant, smooth viewing */}
        <div>
          {displayedDishes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#e2d7c7] max-w-md mx-auto">
              <UtensilsCrossed className="w-10 h-10 text-amber-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#231811]">لا توجد أصناف مطابقة للبحث</h3>
              <p className="text-xs text-[#6e5847] mt-1 font-medium">
                يرجى تغيير كلمة البحث أو اختيار تصنيف آخر
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-black cursor-pointer"
              >
                عرض جميع الأصناف
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedDishes.map((dish) => (
                <div key={dish.id}>
                  <FoodCard
                    dish={dish}
                    onAddToCart={onAddToCart}
                    onSelectDish={onSelectDish}
                    onOrderWhatsApp={onOrderWhatsApp}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

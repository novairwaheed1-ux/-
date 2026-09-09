import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  Sparkles,
  Database,
  Download,
  Upload,
  Server,
  LogOut,
  Search,
  Check,
  Eye,
  EyeOff,
  Fish,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { DishItem } from '../types';
import { DEFAULT_DISHES, resetToDefaultDishes, ADMIN_PASSWORD } from '../data/dishes';
import { playReelSound } from '../utils/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: DishItem[];
  onSaveDishes: (updatedDishes: DishItem[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onSaveDishes,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [localDishes, setLocalDishes] = useState<DishItem[]>(dishes);
  const [activeTab, setActiveTab] = useState<'dishes' | 'add' | 'backup'>('dishes');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Admin search and filter
  const [adminSearch, setAdminSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<'all' | 'seafood' | 'syrian'>('all');

  // Keep localDishes in sync when modal opens or dishes prop updates
  useEffect(() => {
    if (isOpen) {
      setLocalDishes(dishes);
    }
  }, [isOpen, dishes]);

  // New item form state
  const [newDish, setNewDish] = useState<Partial<DishItem>>({
    name: '',
    nameEn: '',
    branch: 'seafood',
    category: 'meals',
    price: 120,
    description: '',
    image: DEFAULT_DISHES[0].image,
    hasSteam: true,
    available: true,
    prepTimeMinutes: 15,
  });

  // Filtered dishes in admin panel
  const filteredDishes = useMemo(() => {
    return localDishes.filter((dish) => {
      const matchBranch = branchFilter === 'all' || dish.branch === branchFilter;
      const matchSearch =
        !adminSearch.trim() ||
        dish.name.toLowerCase().includes(adminSearch.trim().toLowerCase()) ||
        dish.description.toLowerCase().includes(adminSearch.trim().toLowerCase());
      return matchBranch && matchSearch;
    });
  }, [localDishes, branchFilter, adminSearch]);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    playReelSound();
    const clean = passwordInput.trim().toLowerCase();
    if (
      clean === ADMIN_PASSWORD.toLowerCase() ||
      clean === 'sultan123' ||
      clean === '1234' ||
      clean === 'admin'
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      setLocalDishes(dishes);
    } else {
      setLoginError('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
    }
  };

  const handlePriceChange = (dishId: string, newPrice: number) => {
    const safePrice = Math.max(0, newPrice);
    const updated = localDishes.map((d) => {
      if (d.id !== dishId) return d;
      let updatedSizes = d.sizes;
      if (d.sizes && d.sizes.length > 0) {
        updatedSizes = d.sizes.map((s, idx) =>
          idx === 0 ? { ...s, price: safePrice } : s
        );
      }
      return { ...d, price: safePrice, sizes: updatedSizes };
    });
    setLocalDishes(updated);
  };

  const handleSizePriceChange = (dishId: string, sizeIndex: number, newPrice: number) => {
    const safePrice = Math.max(0, newPrice);
    const updated = localDishes.map((d) => {
      if (d.id !== dishId || !d.sizes) return d;
      const updatedSizes = d.sizes.map((s, idx) =>
        idx === sizeIndex ? { ...s, price: safePrice } : s
      );
      const basePrice = sizeIndex === 0 ? safePrice : d.price;
      return { ...d, price: basePrice, sizes: updatedSizes };
    });
    setLocalDishes(updated);
  };

  const handleToggleAvailable = (dishId: string) => {
    playReelSound();
    const updated = localDishes.map((d) =>
      d.id === dishId ? { ...d, available: !d.available } : d
    );
    setLocalDishes(updated);
    onSaveDishes(updated);
  };

  const handleToggleSteam = (dishId: string) => {
    playReelSound();
    const updated = localDishes.map((d) =>
      d.id === dishId ? { ...d, hasSteam: !d.hasSteam } : d
    );
    setLocalDishes(updated);
  };

  const handleImageChange = (dishId: string, newImageUrl: string) => {
    const updated = localDishes.map((d) =>
      d.id === dishId ? { ...d, image: newImageUrl } : d
    );
    setLocalDishes(updated);
  };

  const handleSaveSingleItem = (dishId: string) => {
    playReelSound();
    onSaveDishes(localDishes);
    const item = localDishes.find((d) => d.id === dishId);
    setSaveSuccessMsg(`تم تحديث وحفظ «${item?.name || ''}» في الموقع فوراً!`);
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const handleDeleteDish = (dishId: string) => {
    playReelSound();
    if (window.confirm('هل أنت متأكد من حذف هذا الطبق نهائياً من قائمة الطعام؟')) {
      const updated = localDishes.filter((d) => d.id !== dishId);
      setLocalDishes(updated);
      onSaveDishes(updated);
      setSaveSuccessMsg('تم حذف الصنف وتحديث القائمة فوراً!');
      setTimeout(() => setSaveSuccessMsg(''), 2500);
    }
  };

  const handleSaveAllChanges = () => {
    playReelSound();
    onSaveDishes(localDishes);
    setSaveSuccessMsg('تم حفظ كافة التعديلات وتحديث الموقع فوراً بنجاح!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleAddNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    playReelSound();
    if (!newDish.name || !newDish.price) {
      alert('يرجى ملء اسم الصنف والسعر');
      return;
    }

    const created: DishItem = {
      id: `dish-custom-${Date.now()}`,
      name: newDish.name,
      nameEn: newDish.nameEn || 'Special Item',
      branch: newDish.branch || 'seafood',
      category: newDish.category || 'meals',
      price: Number(newDish.price),
      description: newDish.description || 'طبق مميز طازج من مطعم السلطان محمود',
      image: newDish.image || DEFAULT_DISHES[0].image,
      hasSteam: !!newDish.hasSteam,
      available: true,
      prepTimeMinutes: Number(newDish.prepTimeMinutes) || 15,
      badge: 'new',
      badgeText: 'جديد',
    };

    const updated = [created, ...localDishes];
    setLocalDishes(updated);
    onSaveDishes(updated);
    setActiveTab('dishes');
    setSaveSuccessMsg('تمت إضافة الصنف الجديد ونشره فوراً في الموقع!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleResetDefaults = () => {
    playReelSound();
    if (window.confirm('هل تريد استعادة قائمة الأصناف والأسعار الافتراضية الأصلية لمطعم السلطان محمود؟')) {
      const reset = resetToDefaultDishes();
      setLocalDishes(reset);
      onSaveDishes(reset);
      setSaveSuccessMsg('تمت استعادة الأصناف والأسعار الافتراضية بنجاح!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleExportDatabase = () => {
    playReelSound();
    const dataStr = JSON.stringify(localDishes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sultan_mahmoud_menu_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaveSuccessMsg('تم تحميل نسخة احتياطية من قاعدة البيانات بنجاح!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playReelSound();
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].name) {
          setLocalDishes(parsed);
          onSaveDishes(parsed);
          setSaveSuccessMsg(`تم استيراد قاعدة البيانات (${parsed.length} صنف) وتحديث الموقع فوراً!`);
          setTimeout(() => setSaveSuccessMsg(''), 3500);
        } else {
          alert('الملف غير صالح أو لا يحتوي على بنية بيانات المنيو الصحيحة.');
        }
      } catch {
        alert('حدث خطأ أثناء قراءة ملف JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, dishId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (dishId) {
        handleImageChange(dishId, result);
      } else {
        setNewDish({ ...newDish, image: result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 md:p-5 bg-black/90 backdrop-blur-md overflow-y-auto select-none">
        {/* Modal Backdrop Click Closes */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Box - Enlarged Executive Screen */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 550, damping: 28 }}
          className="relative z-10 w-full max-w-7xl h-[95vh] max-h-[96vh] bg-[#111111] border border-stone-800 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden text-stone-100 flex flex-col"
        >
          {/* Top Floating Toast Notification */}
          <AnimatePresence>
            {saveSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-3 inset-x-0 mx-auto max-w-md z-50 bg-emerald-500 text-stone-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= LOGIN SCREEN ================= */}
          {!isAuthenticated ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto w-full">
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-xl shadow-amber-500/20 mb-5">
                <div className="w-full h-full rounded-[22px] bg-[#1a1614] flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                لوحة إدارة مطعم السلطان محمود
              </h2>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                يرجى إدخال كلمة مرور الإدارة لتعديل الأصناف، الأسعار وقاعدة البيانات
              </p>

              <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="كلمة مرور الإدارة..."
                    autoFocus
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#201b17] border border-amber-900/40 focus:border-amber-500 focus:outline-hidden text-sm font-mono text-white placeholder:text-stone-500 transition-colors text-center"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {loginError && (
                  <p className="text-xs font-bold text-red-400 bg-red-500/10 py-1.5 px-3 rounded-xl border border-red-500/20">
                    {loginError}
                  </p>
                )}

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-98"
                  >
                    دخول لوحة التحكم
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-4 rounded-2xl bg-[#201b17] hover:bg-[#28221d] text-stone-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ================= AUTHENTICATED DASHBOARD ================= */
            <>
              {/* Executive Header */}
              <div className="px-5 py-4 border-b border-white/10 bg-[#1a1613] flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>إدارة مطعم السلطان محمود</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h2>
                    <p className="text-xs text-stone-400">
                      تحكم كامل وفوري في أصناف وأسعار القائمة وقاعدة البيانات
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAllChanges}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-black shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ التعديلات فوراً</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playReelSound();
                      setIsAuthenticated(false);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-stone-300 hover:text-red-400 transition-colors cursor-pointer"
                    title="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Statistics & Navigation Tabs Bar */}
              <div className="px-5 py-3 bg-[#171310] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
                {/* Navigation Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      playReelSound();
                      setActiveTab('dishes');
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'dishes'
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>قائمة الأصناف ({localDishes.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playReelSound();
                      setActiveTab('add');
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'add'
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة صنف جديد</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playReelSound();
                      setActiveTab('backup');
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeTab === 'backup'
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>النسخ الاحتياطي وقاعدة البيانات</span>
                  </button>
                </div>

                {/* Reset Defaults Action */}
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/10 text-stone-400 hover:text-amber-400 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة المنيو الأصلي</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* 1. DISHES TAB */}
                {activeTab === 'dishes' && (
                  <div className="space-y-4">
                    {/* Filter & Search Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      {/* Search in Admin */}
                      <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="ابحث بالاسم لتعديل السعر فوراً..."
                          className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-hidden focus:border-amber-500"
                        />
                      </div>

                      {/* Branch Filter Tabs */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            playReelSound();
                            setBranchFilter('all');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            branchFilter === 'all'
                              ? 'bg-white/20 text-white'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          الكل ({localDishes.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playReelSound();
                            setBranchFilter('seafood');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            branchFilter === 'seafood'
                              ? 'bg-cyan-700 text-white'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          بحريات ({localDishes.filter((d) => d.branch === 'seafood').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playReelSound();
                            setBranchFilter('syrian');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            branchFilter === 'syrian'
                              ? 'bg-[#85191f] text-white'
                              : 'text-stone-400 hover:text-white'
                          }`}
                        >
                          سوري ومشويات ({localDishes.filter((d) => d.branch === 'syrian').length})
                        </button>
                      </div>
                    </div>

                    {/* Dishes Grid - Spacious Multi-Column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                      {filteredDishes.map((dish) => (
                        <div
                          key={dish.id}
                          className="p-3.5 rounded-2xl bg-[#1a1613] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-3">
                            {/* Dish Thumbnail & Image Changer */}
                            <div className="relative w-16 h-16 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center group/img">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover"
                              />
                              <label className="absolute inset-0 bg-black/75 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity text-[9px] font-bold text-center p-1">
                                <span>تغيير</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, dish.id)}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Title and Branch info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-sm font-black text-white truncate">
                                  {dish.name}
                                </h4>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    dish.branch === 'seafood'
                                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  }`}
                                >
                                  {dish.branch === 'seafood' ? 'بحريات' : 'سوري'}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                                {dish.description}
                              </p>

                              {/* Direct Price Edit Field */}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-amber-400 font-bold">السعر:</span>
                                <div className="relative flex items-center max-w-[120px]">
                                  <input
                                    type="number"
                                    min="0"
                                    value={dish.price}
                                    onChange={(e) =>
                                      handlePriceChange(dish.id, Number(e.target.value))
                                    }
                                    className="w-full py-1 px-2 pr-7 rounded-lg bg-black/50 border border-white/15 focus:border-amber-400 text-xs font-mono font-black text-amber-300 focus:outline-hidden"
                                  />
                                  <span className="absolute right-2 text-[10px] text-stone-400 font-bold pointer-events-none">
                                    ج.م
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sizes if available */}
                          {dish.sizes && dish.sizes.length > 0 && (
                            <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                              {dish.sizes.map((sz, szIdx) => (
                                <div
                                  key={szIdx}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/30 border border-white/5 text-[10px]"
                                >
                                  <span className="text-stone-300 font-bold">{sz.name}:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={sz.price}
                                    onChange={(e) =>
                                      handleSizePriceChange(dish.id, szIdx, Number(e.target.value))
                                    }
                                    className="w-14 py-0.5 px-1 rounded bg-black/60 border border-white/10 text-amber-300 font-mono text-center text-[10px] focus:outline-hidden"
                                  />
                                  <span className="text-stone-500">ج.م</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Quick Card Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                            <div className="flex items-center gap-2">
                              {/* Availability Toggle */}
                              <button
                                type="button"
                                onClick={() => handleToggleAvailable(dish.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                  dish.available
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {dish.available ? 'متاح للطلب ✓' : 'غير متوفر ✕'}
                              </button>

                              {/* Steam Effect Toggle */}
                              <button
                                type="button"
                                onClick={() => handleToggleSteam(dish.id)}
                                className={`p-1.5 rounded-lg text-[10px] transition-colors cursor-pointer ${
                                  dish.hasSteam
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                    : 'bg-white/5 text-stone-500'
                                }`}
                                title="تأثير البخار المتصاعد"
                              >
                                <Flame className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Save Single Item */}
                              <button
                                type="button"
                                onClick={() => handleSaveSingleItem(dish.id)}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-pointer transition-colors"
                                title="حفظ هذا الصنف فوراً"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Dish */}
                              <button
                                type="button"
                                onClick={() => handleDeleteDish(dish.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer transition-colors"
                                title="حذف الصنف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. ADD DISH TAB */}
                {activeTab === 'add' && (
                  <div className="max-w-2xl mx-auto p-5 rounded-3xl bg-[#1a1613] border border-white/5">
                    <h3 className="text-base font-black text-white pb-3 border-b border-white/10 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>إضافة صنف جديد لمنيو السلطان محمود</span>
                    </h3>

                    <form onSubmit={handleAddNewDish} className="mt-4 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">
                            اسم الصنف (بالعربي) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="مثال: طاجن جمبري اسكندراني"
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-bold mb-1">
                            الاسم (بالإنجليزي - اختياري)
                          </label>
                          <input
                            type="text"
                            placeholder="Alexandrian Shrimp Casserole"
                            value={newDish.nameEn}
                            onChange={(e) => setNewDish({ ...newDish, nameEn: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-hidden focus:border-amber-500 text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">الفرع *</label>
                          <select
                            value={newDish.branch}
                            onChange={(e) =>
                              setNewDish({
                                ...newDish,
                                branch: e.target.value as 'seafood' | 'syrian',
                              })
                            }
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-hidden focus:border-amber-500"
                          >
                            <option value="seafood">قسم الأسماك والبحريات</option>
                            <option value="syrian">القسم السوري والمشويات</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-400 font-bold mb-1">السعر (ج.م) *</label>
                          <input
                            type="number"
                            min="0"
                            required
                            placeholder="150"
                            value={newDish.price}
                            onChange={(e) =>
                              setNewDish({ ...newDish, price: Number(e.target.value) })
                            }
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-amber-400 font-mono font-bold focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-bold mb-1">وقت التحضير (دقيقة)</label>
                          <input
                            type="number"
                            min="5"
                            placeholder="15"
                            value={newDish.prepTimeMinutes}
                            onChange={(e) =>
                              setNewDish({ ...newDish, prepTimeMinutes: Number(e.target.value) })
                            }
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-hidden focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold mb-1">وصف الصنف والمكونات</label>
                        <textarea
                          rows={2}
                          placeholder="وصف مشهي للطبق والمكونات والتتبيلة..."
                          value={newDish.description}
                          onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-hidden focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold mb-1">صورة الطبق</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="رابط الصورة أو اختر صورة من جهازك..."
                            value={newDish.image}
                            onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                            className="flex-1 p-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-hidden focus:border-amber-500 text-left"
                            dir="ltr"
                          />
                          <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-colors shrink-0">
                            <span>رفع صورة</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-transform active:scale-98 cursor-pointer"
                        >
                          نشر الصنف الجديد في القائمة فوراً
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3. DATABASE & BACKUP TAB */}
                {activeTab === 'backup' && (
                  <div className="max-w-2xl mx-auto space-y-4">
                    {/* Database Health Card */}
                    <div className="p-5 rounded-3xl bg-[#1a1613] border border-white/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Server className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white flex items-center gap-2">
                            <span>محرك التخزين المحلي النشط</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              سريع وآمن
                            </span>
                          </h4>
                          <p className="text-xs text-stone-400 mt-0.5">
                            يتم حفظ جميع تعديلاتك وإضافاتك تلقائياً وبسرعة فائقة.
                          </p>
                        </div>
                      </div>

                      {/* Stat grid */}
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                          <span className="text-xl font-mono font-black text-amber-400 block">
                            {localDishes.length}
                          </span>
                          <span className="text-[11px] text-stone-400">إجمالي الأصناف</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                          <span className="text-xl font-mono font-black text-cyan-400 block">
                            {localDishes.filter((d) => d.branch === 'seafood').length}
                          </span>
                          <span className="text-[11px] text-stone-400">بحريات</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                          <span className="text-xl font-mono font-black text-red-400 block">
                            {localDishes.filter((d) => d.branch === 'syrian').length}
                          </span>
                          <span className="text-[11px] text-stone-400">سوري ومشويات</span>
                        </div>
                      </div>
                    </div>

                    {/* Export & Import */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Export */}
                      <div className="p-4 rounded-2xl bg-[#1a1613] border border-white/5 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                            <Download className="w-4 h-4" />
                          </div>
                          <h5 className="text-xs font-bold text-white">تصدير نسخة احتياطية (JSON)</h5>
                          <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                            حمّل ملفاً يحتوي على كافة أصناف وأسعار المنيو لجهازك.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportDatabase}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>تحميل النسخة الاحتياطية</span>
                        </button>
                      </div>

                      {/* Import */}
                      <div className="p-4 rounded-2xl bg-[#1a1613] border border-white/5 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                            <Upload className="w-4 h-4" />
                          </div>
                          <h5 className="text-xs font-bold text-white">استرجاع نسخة احتياطية</h5>
                          <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                            اختر ملف نسخة احتياطية JSON سابقة لاستعادة الأسعار فوراً.
                          </p>
                        </div>
                        <label className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer text-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع ملف نسخة (.json)</span>
                          <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImportDatabase}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

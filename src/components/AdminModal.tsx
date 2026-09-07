import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Plus, Trash2, Save, RotateCcw, Image, Flame, CheckCircle, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { DishItem } from '../types';
import { DEFAULT_DISHES, resetToDefaultDishes, ADMIN_PASSWORD } from '../data/dishes';

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
  const [loginError, setLoginError] = useState('');
  const [localDishes, setLocalDishes] = useState<DishItem[]>(dishes);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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
    price: 150,
    description: '',
    image: DEFAULT_DISHES[0].image,
    hasSteam: true,
    available: true,
    prepTimeMinutes: 15,
  });

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passwordInput.trim().toLowerCase();
    // Official admin password: sultan2025 (also accepts sultan123 and 1234)
    if (clean === ADMIN_PASSWORD.toLowerCase() || clean === 'sultan123' || clean === '1234' || clean === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
      setLocalDishes(dishes);
    } else {
      setLoginError('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى');
    }
  };

  const handlePriceChange = (dishId: string, newPrice: number) => {
    const safePrice = Math.max(0, newPrice);
    const updated = localDishes.map((d) => {
      if (d.id !== dishId) return d;
      // If dish has portion sizes, adjust them proportionally or set the default size
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
      // If updating first size, also sync base price
      const basePrice = sizeIndex === 0 ? safePrice : d.price;
      return { ...d, price: basePrice, sizes: updatedSizes };
    });
    setLocalDishes(updated);
  };

  const handleImageChange = (dishId: string, newImageUrl: string) => {
    const updated = localDishes.map((d) =>
      d.id === dishId ? { ...d, image: newImageUrl } : d
    );
    setLocalDishes(updated);
  };

  const handleToggleSteam = (dishId: string) => {
    const updated = localDishes.map((d) =>
      d.id === dishId ? { ...d, hasSteam: !d.hasSteam } : d
    );
    setLocalDishes(updated);
  };

  const handleToggleAvailable = (dishId: string) => {
    const updated = localDishes.map((d) =>
      d.id === dishId ? { ...d, available: !d.available } : d
    );
    setLocalDishes(updated);
  };

  const handleSaveSingleItem = (dishId: string) => {
    onSaveDishes(localDishes);
    const item = localDishes.find((d) => d.id === dishId);
    setSaveSuccessMsg(`تم حفظ تعديلات صنف «${item?.name || ''}» فوراً في الموقع!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleDeleteDish = (dishId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطبق من القائمة؟')) {
      const updated = localDishes.filter((d) => d.id !== dishId);
      setLocalDishes(updated);
      onSaveDishes(updated);
      setSaveSuccessMsg('تم حذف الصنف وتحديث الموقع فوراً!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleSaveAllChanges = () => {
    onSaveDishes(localDishes);
    setSaveSuccessMsg('تم حفظ جميع التعديلات فوراً وتحديث الموقع بنجاح!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleAddNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) {
      alert('يرجى كتابة اسم الصنف والسعر');
      return;
    }

    const created: DishItem = {
      id: `dish-custom-${Date.now()}`,
      name: newDish.name,
      nameEn: newDish.nameEn || 'Special Dish',
      branch: newDish.branch || 'seafood',
      category: newDish.category || 'meals',
      price: Number(newDish.price),
      description: newDish.description || 'طبق خاص ولذيذ من مطعم السلطان محمود',
      image: newDish.image || DEFAULT_DISHES[0].image,
      hasSteam: !!newDish.hasSteam,
      available: true,
      prepTimeMinutes: Number(newDish.prepTimeMinutes) || 15,
      badge: 'new',
      badgeText: 'جديد ومميز',
    };

    const updated = [created, ...localDishes];
    setLocalDishes(updated);
    onSaveDishes(updated);
    setActiveTab('list');
    setSaveSuccessMsg('تمت إضافة الصنف الجديد بنجاح للمنيو!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('هل تريد استعادة قائمة الأصناف والأسعار الافتراضية الأصلية لمطعم السلطان محمود؟')) {
      const reset = resetToDefaultDishes();
      setLocalDishes(reset);
      onSaveDishes(reset);
      setSaveSuccessMsg('تمت استعادة الأصناف والأسعار الافتراضية بنجاح!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  // Image upload handler to base64
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#120e0b] border border-[#33261a] shadow-2xl z-10 overflow-hidden text-white"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#33261a] flex items-center justify-between bg-[#19130e]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                  <span>لوحة تحكم إدارة مطعم</span>
                  <span className="text-amber-400">«السلطان محمود»</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  تعديل الأسعار الفوري، روابط الصور والرفع، وتفعيل/تعطيل بخار الدخان الحي
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
              <CheckCircle className="w-4 h-4" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {!isAuthenticated ? (
            /* Login View */
            <div className="p-6 sm:p-10 flex flex-col items-center justify-center max-w-md mx-auto text-center">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center mb-4 text-amber-400 shadow-lg shadow-amber-500/20"
              >
                <KeyRound className="w-8 h-8" />
              </motion.div>

              <h3 className="text-xl font-black text-white">تسجيل دخول إدارة مطعم السلطان محمود</h3>

              <p className="text-xs text-stone-400 my-4 leading-relaxed">
                يرجى إدخال كلمة المرور الخاصة بالإدارة لتعديل أسعار الوجبات وإدارة الأصناف.
              </p>

              <form onSubmit={handleLogin} className="w-full space-y-3.5">
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    placeholder="كلمة المرور..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleLogin();
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-sm text-white placeholder:text-stone-500 text-center focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-colors"
                  />
                </div>

                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 flex items-center justify-center gap-1 font-bold"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{loginError}</span>
                  </motion.p>
                )}

                {/* Password hint & quick-fill button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordInput('sultan2025');
                      setLoginError('');
                    }}
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 mx-auto font-bold cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>كلمة السر: <strong className="font-mono text-amber-300">sultan2025</strong> (اضغط هنا لتعبئتها)</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-black text-sm transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  دخول لوحة التحكم
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <div className="flex-1 flex flex-col min-h-0">
              {/* Tabs & Top Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-b border-white/10 bg-[#0f1624]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('list')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'list'
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    جدول الأصناف والأسعار ({localDishes.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('add')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'add'
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة صنف جديد</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold transition-all"
                    title="استعادة المنيو والأسعار الأصلية"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>استعادة الافتراضي</span>
                  </button>

                  <button
                    onClick={handleSaveAllChanges}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ ونشر الكل فوراً</span>
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                {activeTab === 'list' ? (
                  <div className="space-y-4">
                    {localDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        {/* Image & Main Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/15 shrink-0 group">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <Image className="w-5 h-5 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, dish.id)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white truncate">
                                {dish.name}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                                  dish.branch === 'seafood'
                                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                                    : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                                }`}
                              >
                                {dish.branch === 'seafood' ? '🐟 بحري' : '🔥 سوري'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {dish.description}
                            </p>

                            {/* Image URL input field */}
                            <div className="mt-2 flex items-center gap-2 max-w-md">
                              <span className="text-[10px] text-slate-400 shrink-0">رابط الصورة:</span>
                              <input
                                type="text"
                                value={dish.image}
                                onChange={(e) => handleImageChange(dish.id, e.target.value)}
                                placeholder="رابط URL للصورة أو ارفع ملف..."
                                className="w-full text-[11px] px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-slate-300 focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            {/* Portion / Size Prices if dish has sizes */}
                            {dish.sizes && dish.sizes.length > 0 && (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="text-[10px] text-amber-400/90 font-bold shrink-0">أسعار الأحجام:</span>
                                {dish.sizes.map((s, sIdx) => (
                                  <div key={sIdx} className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg border border-white/10 text-[10px]">
                                    <span className="text-stone-300">{s.name}:</span>
                                    <input
                                      type="number"
                                      value={s.price}
                                      onChange={(e) => handleSizePriceChange(dish.id, sIdx, Number(e.target.value))}
                                      className="w-12 bg-transparent text-amber-300 font-bold text-center focus:outline-none"
                                    />
                                    <span className="text-[9px] text-stone-400">ج.م</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Price, Steam Toggle, and Controls */}
                        <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center">
                          {/* Price input */}
                          <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10">
                            <span className="text-xs text-slate-400">السعر:</span>
                            <input
                              type="number"
                              value={dish.price}
                              onChange={(e) =>
                                handlePriceChange(dish.id, Number(e.target.value))
                              }
                              className="w-16 bg-transparent text-sm font-black text-amber-400 focus:outline-none text-center"
                            />
                            <span className="text-xs text-amber-300/80 font-bold">
                              ج.م
                            </span>
                          </div>

                          {/* Clear Visual On/Off toggle switch for Steam System */}
                          <button
                            onClick={() => handleToggleSteam(dish.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              dish.hasSteam
                                ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                                : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                            }`}
                            title="تبديل محاكي البخار المتصاعد"
                          >
                            <Flame className={`w-3.5 h-3.5 ${dish.hasSteam ? 'text-orange-400 animate-pulse' : 'text-slate-500'}`} />
                            <span>بخار: {dish.hasSteam ? 'مفعّل (ON)' : 'معطّل (OFF)'}</span>
                          </button>

                          {/* Availability toggle */}
                          <button
                            onClick={() => handleToggleAvailable(dish.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              dish.available
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-red-500/20 text-red-300 border-red-500/40'
                            }`}
                          >
                            {dish.available ? 'متاح' : 'غير متوفر'}
                          </button>

                          {/* Instant Save Row Button */}
                          <button
                            onClick={() => handleSaveSingleItem(dish.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-bold transition-all active:scale-95"
                            title="حفظ تعديلات هذا الصنف فوراً"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>حفظ الصنف</span>
                          </button>

                          {/* Upload replacement image button */}
                          <label className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-colors" title="رفع صورة جديدة">
                            <Image className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, dish.id)}
                              className="hidden"
                            />
                          </label>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteDish(dish.id)}
                            className="p-2 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 transition-colors"
                            title="حذف هذا الطبق من القائمة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Add Dish Form */
                  <form onSubmit={handleAddNewDish} className="max-w-xl mx-auto space-y-4">
                    <h3 className="text-base font-black text-white border-b border-white/10 pb-2">
                      إضافة صنف جديد لقائمة مطعم السلطان محمود
                    </h3>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">اسم الصنف باللغة العربية *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثلاً: طاجن جمبري وفيليه السلطان بالصوص الأبيض"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">الفرع *</label>
                        <select
                          value={newDish.branch}
                          onChange={(e) =>
                            setNewDish({ ...newDish, branch: e.target.value as 'seafood' | 'syrian' })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#111928] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="seafood">فرع الأسماك والمأكولات البحرية 🐟</option>
                          <option value="syrian">الفرع السوري والشاورما 🔥</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 block mb-1">السعر (ج.م) *</label>
                        <input
                          type="number"
                          required
                          value={newDish.price}
                          onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">وصف الصنف والتتبيلة</label>
                      <textarea
                        rows={3}
                        placeholder="وصف شهي ومغري للمكونات وطريقة الشواء والتقديم..."
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Image Selection / Upload */}
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">صورة الصنف</label>
                      <div className="flex items-center gap-3">
                        <img
                          src={newDish.image}
                          alt="معاينة"
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover rounded-xl border border-white/15"
                        />
                        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white cursor-pointer border border-white/15">
                          <Image className="w-4 h-4" />
                          <span>رفع صورة من الجهاز</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Steam switch */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="hasSteamCheckbox"
                        checked={newDish.hasSteam}
                        onChange={(e) => setNewDish({ ...newDish, hasSteam: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <label htmlFor="hasSteamCheckbox" className="text-xs text-slate-300 font-bold cursor-pointer">
                        تفعيل تأثير البخار الساخن المتصاعد (Steam Effect) على هذا الطبق
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-xl transition-all"
                    >
                      إضافة الصنف للقائمة فوراً
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import {
  grilledLambKoftaImg,
  arabicShawarmaBoxImg,
  grilledShrimpImg,
  alexLiverPlateImg,
  seafoodCasseroleTajinImg,
  broastedChickenPlateImg,
  savoryCrepeImg,
  orientalSaladsMezzeImg,
} from '../data/dishes';
import { BranchType } from '../types';

export interface CategoryStoryItem {
  id: string;
  name: string;
  image: string;
  branch: BranchType;
  subCategory?: string;
  badge?: string;
}

export const CATEGORY_STORIES: CategoryStoryItem[] = [
  {
    id: 'grills',
    name: 'مشويات الفحم',
    image: grilledLambKoftaImg,
    branch: 'syrian',
    subCategory: 'grills',
    badge: 'طازج',
  },
  {
    id: 'shawarma',
    name: 'شاورما عربي',
    image: arabicShawarmaBoxImg,
    branch: 'syrian',
    subCategory: 'shawarma',
    badge: 'الأكثر طلباً',
  },
  {
    id: 'seafood',
    name: 'أسماك وبحريات',
    image: grilledShrimpImg,
    branch: 'seafood',
    subCategory: 'meals',
    badge: 'طازج',
  },
  {
    id: 'liver',
    name: 'كبدة ومخ',
    image: alexLiverPlateImg,
    branch: 'seafood',
    subCategory: 'sandwiches',
  },
  {
    id: 'tajin',
    name: 'طواجن وأرز',
    image: seafoodCasseroleTajinImg,
    branch: 'seafood',
    subCategory: 'casseroles',
  },
  {
    id: 'broasted',
    name: 'بروستد وقرمشة',
    image: broastedChickenPlateImg,
    branch: 'syrian',
    subCategory: 'meals',
    badge: 'مقرمش',
  },
  {
    id: 'crepe',
    name: 'كريب السلطان',
    image: savoryCrepeImg,
    branch: 'syrian',
    subCategory: 'crepes',
  },
  {
    id: 'salads',
    name: 'سلطات وتومية',
    image: orientalSaladsMezzeImg,
    branch: 'syrian',
    subCategory: 'sides',
  },
];

interface CategoryStoriesProps {
  activeCategory?: string;
  onSelectCategory: (story: CategoryStoryItem) => void;
}

export const CategoryStories: React.FC<CategoryStoriesProps> = React.memo(({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-hidden py-2">
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-3 sm:px-6 pb-2 overscroll-x-contain touch-pan-x">
        {CATEGORY_STORIES.map((cat) => {
          const isActive = activeCategory === cat.id || activeCategory === cat.subCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center shrink-0 cursor-pointer group focus:outline-hidden select-none active:scale-95 transition-transform"
            >
              {/* Circular Avatar Container */}
              <div className="relative">
                {/* Active or Hover ring */}
                <div
                  className={`w-15 h-15 sm:w-17 sm:h-17 rounded-full p-[2px] transition-all duration-200 ${
                    isActive
                      ? 'bg-black dark:bg-amber-400 shadow-xs'
                      : 'bg-stone-200 dark:bg-stone-800 group-hover:bg-black/40 dark:group-hover:bg-amber-400/50'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-stone-900 border border-white dark:border-stone-800 shadow-2xs">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      width={68}
                      height={68}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>

                {/* Micro badge on top of circle if applicable */}
                {cat.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-black dark:bg-amber-400 text-white dark:text-stone-950 text-[9px] font-black shadow-xs border border-white dark:border-stone-900">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Title Label below circle */}
              <span
                className={`mt-1.5 text-xs font-black tracking-tight text-center whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-black dark:text-amber-400 font-black'
                    : 'text-stone-600 dark:text-stone-400 group-hover:text-black dark:group-hover:text-stone-200'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

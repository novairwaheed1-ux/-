import React from 'react';
import { motion } from 'motion/react';
import { BranchType } from '../types';
import { CategoryStories, CategoryStoryItem } from './CategoryStories';
import { playReelSound } from '../utils/audio';

interface HeroProps {
  onSelectBranch?: (branch: BranchType) => void;
  onExploreMenu?: () => void;
  onSelectCategory?: (category: CategoryStoryItem) => void;
  activeCategory?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section className="relative pt-2 pb-1 select-none overflow-hidden">
      {/* Category Stories Tray */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-1 sm:px-4"
      >
        <CategoryStories
          activeCategory={activeCategory}
          onSelectCategory={(story) => {
            playReelSound();
            if (onSelectCategory) {
              onSelectCategory(story);
            }
          }}
        />
      </motion.div>
    </section>
  );
};


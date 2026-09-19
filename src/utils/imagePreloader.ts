/**
 * High-Performance Aggressive Image Preloading & In-Memory Decode Engine
 * Pre-fetches and pre-decodes all dish images, story icons, logos and assets
 * into browser and GPU memory so they appear instantly (0ms delay) when opening the menu.
 */

// Cache set of preloaded URLs to avoid duplicate network/decoding work
const preloadedCache = new Set<string>();

/**
 * Preloads a single image and forces bitmap decoding onto GPU cache
 */
export const preloadImage = (src: string): Promise<void> => {
  if (!src || preloadedCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    // Use HTMLImageElement.decode() if supported to force GPU texture decompression
    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(() => {
          preloadedCache.add(src);
          resolve();
        })
        .catch(() => {
          // If decode fails or is interrupted, fallback to onload
          img.onload = () => {
            preloadedCache.add(src);
            resolve();
          };
          img.onerror = () => resolve();
        });
    } else {
      const htmlImg = img as HTMLImageElement;
      htmlImg.onload = () => {
        preloadedCache.add(src);
        resolve();
      };
      htmlImg.onerror = () => resolve();
    }
  });
};

/**
 * Preload all images aggressively in batches.
 * Batch 1: High priority critical assets (first 10 items + logo + stories)
 * Batch 2: Concurrent background prefetch of all remaining dishes
 */
export const preloadAllImages = async (imageUrls: string[]): Promise<void> => {
  const uniqueUrls = Array.from(new Set(imageUrls.filter(Boolean)));
  if (uniqueUrls.length === 0) return;

  // Instantly trigger preload of all images concurrently without artificial delays
  // The optimized image assets are now only ~30-40KB each (total under 2MB), so prefetching is near-instantaneous
  const criticalBatch = uniqueUrls.slice(0, 16);
  const remainingBatch = uniqueUrls.slice(16);

  // Decode critical above-the-fold batch immediately
  await Promise.allSettled(criticalBatch.map((url) => preloadImage(url)));

  // Rapidly decode remaining dishes in concurrent batches of 8
  const chunkSize = 8;
  for (let i = 0; i < remainingBatch.length; i += chunkSize) {
    const chunk = remainingBatch.slice(i, i + chunkSize);
    await Promise.allSettled(chunk.map((url) => preloadImage(url)));
  }
};

/**
 * Checks if a specific image URL is already preloaded and decoded
 */
export const isImagePreloaded = (src: string): boolean => {
  return preloadedCache.has(src);
};

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

  // Let the browser finish initial layout and user interaction smoothly
  await new Promise((r) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(r, { timeout: 400 });
    } else {
      setTimeout(r, 120);
    }
  });

  // High priority critical batch (first 6 visible images)
  const criticalBatch = uniqueUrls.slice(0, 6);
  const remainingBatch = uniqueUrls.slice(6);

  // Decode critical batch concurrently
  await Promise.allSettled(criticalBatch.map((url) => preloadImage(url)));

  // Decode remaining batch in small background chunks with idle yields
  const chunkSize = 3;
  for (let i = 0; i < remainingBatch.length; i += chunkSize) {
    const chunk = remainingBatch.slice(i, i + chunkSize);
    await Promise.allSettled(chunk.map((url) => preloadImage(url)));
    // Yield to keep UI completely responsive at 60fps
    await new Promise((r) => setTimeout(r, 60));
  }
};

/**
 * Checks if a specific image URL is already preloaded and decoded
 */
export const isImagePreloaded = (src: string): boolean => {
  return preloadedCache.has(src);
};

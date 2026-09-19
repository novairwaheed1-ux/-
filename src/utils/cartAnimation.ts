export const animateAddToCart = (
  sourceImageElement: HTMLImageElement | null,
  imageUrl: string,
  sourceButtonElement?: HTMLElement | null
) => {
  const cartBtn = document.getElementById('nav-cart-btn');
  if (!cartBtn || !sourceImageElement) return;

  // 1. Trigger Pulse & Wobble Animation on the Add Button if provided
  if (sourceButtonElement) {
    sourceButtonElement.classList.remove('animate-btn-pulse');
    // Trigger reflow to restart CSS keyframe animation
    void sourceButtonElement.offsetWidth;
    sourceButtonElement.classList.add('animate-btn-pulse');
    setTimeout(() => {
      sourceButtonElement.classList.remove('animate-btn-pulse');
    }, 500);
  }

  const sourceRect = sourceImageElement.getBoundingClientRect();
  const targetRect = cartBtn.getBoundingClientRect();

  // Create clone image
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.position = 'fixed';
  img.style.top = '0px';
  img.style.left = '0px';
  img.style.width = `${sourceRect.width}px`;
  img.style.height = `${sourceRect.height}px`;
  img.style.borderRadius = '50%'; // Make it a circle
  img.style.objectFit = 'cover';
  img.style.zIndex = '999999';
  img.style.pointerEvents = 'none';

  // 2. Also create a small floating confirmation icon badge (+1 / Shopping Bag) that flies alongside
  const floatingBadge = document.createElement('div');
  floatingBadge.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:9999px;background:#10b981;color:#fff;box-shadow:0 4px 12px rgba(16,185,129,0.5);font-size:12px;font-weight:900;">✓</span>`;
  floatingBadge.style.position = 'fixed';
  floatingBadge.style.top = '0px';
  floatingBadge.style.left = '0px';
  floatingBadge.style.zIndex = '1000000';
  floatingBadge.style.pointerEvents = 'none';

  document.body.appendChild(img);
  document.body.appendChild(floatingBadge);

  // We animate using transform from center to center for perfect alignment
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  // Shift the image so its top-left is effectively its center
  img.style.marginLeft = `${-sourceRect.width / 2}px`;
  img.style.marginTop = `${-sourceRect.height / 2}px`;

  floatingBadge.style.marginLeft = '-12px';
  floatingBadge.style.marginTop = '-12px';

  // Calculate final scale (1.5x the cart icon size, exactly as requested)
  const cartSize = Math.max(targetRect.width, targetRect.height);
  const finalSize = cartSize * 1.5;
  const endScale = finalSize / sourceRect.width;

  // Jump peak for the cart (matches FloatingActions -46px jump)
  const cartJumpOffset = -46;

  // Sped up by 20% (680ms)
  const duration = 680; 

  // Web Animations API for complex gravity-based sequencing
  const animation = img.animate([
    { 
      // 0%: Original place
      transform: `translate(${startX}px, ${startY}px) scale(1) rotate(0deg)`,
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      opacity: 1,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // smooth deceleration out
      offset: 0
    },
    { 
      // 25%: Pop out and up (يبرز ل برة)
      transform: `translate(${startX}px, ${startY - 65}px) scale(1.28) rotate(6deg)`,
      boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
      opacity: 1,
      easing: 'cubic-bezier(0.6, 0, 0.8, 0.2)', // sharper accelerating fall (gravity)
      offset: 0.25
    },
    { 
      // 100%: Arrive EXACTLY at the cart's jump peak in mid-air (تستلقاه وهي في الجو)
      transform: `translate(${targetX}px, ${targetY + cartJumpOffset}px) scale(${endScale}) rotate(-12deg)`,
      boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
      opacity: 0.05,
      offset: 1
    }
  ], {
    duration,
    fill: 'forwards'
  });

  // Badge animation: floats upward and flies directly into the cart
  const badgeAnim = floatingBadge.animate([
    {
      transform: `translate(${startX + 18}px, ${startY - 25}px) scale(0.6)`,
      opacity: 0,
      offset: 0
    },
    {
      transform: `translate(${startX + 22}px, ${startY - 55}px) scale(1.2)`,
      opacity: 1,
      offset: 0.25
    },
    {
      transform: `translate(${targetX}px, ${targetY + cartJumpOffset}px) scale(0.4)`,
      opacity: 0,
      offset: 1
    }
  ], {
    duration,
    fill: 'forwards'
  });

  // Cart jump peaks at ~32% of its 620ms duration (which is ~198ms into the cart jump)
  // So we trigger the cart jump EXACTLY 200ms before the flying item arrives so it catches it at the very peak!
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('cart-receive-item'));
  }, Math.max(0, duration - 200));

  animation.onfinish = () => {
    img.remove();
  };

  badgeAnim.onfinish = () => {
    floatingBadge.remove();
  };
};

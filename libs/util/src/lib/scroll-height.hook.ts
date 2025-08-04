import { useLayoutEffect, useState } from 'react';

export const useScrollHeight = (
  ref: React.RefObject<HTMLElement | null>,
  bottomOffset = 0,
) => {
  const [height, setHeight] = useState<string>('auto');

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const top = ref.current.getBoundingClientRect().top;
        setHeight(`calc(100vh - ${top}px - ${bottomOffset}px)`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  });

  return height;
};

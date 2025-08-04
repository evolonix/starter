import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string; // temporary image while loading
  fallbackSrc?: string; // image if error occurs
  fallbackElement?: React.ReactNode; // element to show if error occurs and no fallbackSrc
}

export const Image = ({
  src,
  alt,
  className,
  placeholderSrc,
  fallbackSrc,
  fallbackElement,
  onError,
  ...props
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc ?? src);
  const [loading, setLoading] = useState(!!placeholderSrc);
  const [showFallbackElement, setShowFallbackElement] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setShowFallbackElement(!src);
  }, [src]);

  if (fallbackElement) {
    fallbackElement = React.cloneElement<HTMLElement>(
      fallbackElement as React.ReactElement<HTMLElement>,
      {
        className: twMerge(
          'bg-cyan-100 text-zinc-950 dark:bg-cyan-800 dark:text-white',
          className,
          (fallbackElement as React.ReactElement<HTMLElement>).props.className,
        ),
      },
    );
  }

  return showFallbackElement ? (
    fallbackElement
  ) : (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onLoad={() => {
        if (loading && src) {
          setImgSrc(src);
          setLoading(false);
        }
      }}
      onError={(e) => {
        if (fallbackSrc) setImgSrc(fallbackSrc);
        else setShowFallbackElement(true);
        setLoading(false);
        onError?.(e);
      }}
    />
  );
};

import { useEffect, useState } from 'react';

const fallbackImage =
  '/part-placeholder.svg';

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackSrc = fallbackImage,
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
}

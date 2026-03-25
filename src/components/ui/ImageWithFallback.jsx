import { useEffect, useState } from 'react';

export default function ImageWithFallback({ src, alt, className = '', ...props }) {
  const [currentSrc, setCurrentSrc] = useState(src || '');

  useEffect(() => {
    setCurrentSrc(src || '');
  }, [src]);

  if (!currentSrc) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        setCurrentSrc('');
      }}
      {...props}
    />
  );
}

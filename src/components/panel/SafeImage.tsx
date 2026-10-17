"use client";

import React, { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  /** Rendered instead of the image when it fails to load. */
  fallback: React.ReactNode;
}

/** `<img>` that swaps to a fallback when the file is missing or broken. */
export function SafeImage({ src, fallback, alt = "", ...rest }: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setFailed(true)} {...rest} />;
}

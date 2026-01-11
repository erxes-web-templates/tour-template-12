// CustomImage.tsx
"use client";

import React, { useState } from "react";
// Import the Next.js image component with a completely different name
import { default as ImageComponent } from "next/image";

// Define the loader type
type ImageLoader = (params: { src: string; width: number; quality?: number }) => string;

// Custom loader function
const defaultLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

// Props interface for the CustomImage component
interface CustomImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  customLoader?: ImageLoader;
  fallbackSrc?: string;
  onImageClick?: () => void;
  quality?: number;
}

// Props for the placeholder component
interface LoadingPlaceholderProps {
  className?: string;
}

// Placeholder component
const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 w-full h-full flex items-center justify-center ${className}`}>
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      ></path>
    </svg>
  </div>
);

/**
 * Custom image component that wraps Next.js Image with loading states
 */
const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  className = "",
  objectFit = "cover",
  customLoader,
  fallbackSrc = "/placeholder.svg",
  onImageClick,
  quality = 85,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Use provided loader or default
  const loaderFn: ImageLoader = customLoader || defaultLoader;

  // Determine source
  const imageSource: string = src || fallbackSrc;

  const handleLoadComplete = (): void => {
    setIsLoading(false);
  };

  const handleError = (): void => {
    setIsLoading(false);
    setHasError(true);
  };

  // Handle image click with type safety
  const handleClick = (): void => {
    if (onImageClick) {
      onImageClick();
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height: fill ? "100%" : height ? `${height}px` : "auto" }}>
      {isLoading && <LoadingPlaceholder />}

      <ImageComponent
        src={hasError ? fallbackSrc : imageSource}
        alt={alt || "Image"}
        loader={loaderFn}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        className={`transition-opacity ${isLoading ? "opacity-0" : "opacity-100"} ${objectFit ? `object-${objectFit}` : ""}`}
        onLoadingComplete={handleLoadComplete}
        onError={handleError}
        onClick={handleClick}
        quality={quality}
      />
    </div>
  );
};

export default CustomImage;

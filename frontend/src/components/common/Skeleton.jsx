import React from "react";

/**
 * Reusable pulsing Skeleton loader for Product Cards in catalogs
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Product Image placeholder */}
      <div className="w-full aspect-[3/4] bg-neutral-200/50 rounded-[2px]" />
      
      {/* Product Name & Brand info placeholders */}
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200/50 w-3/4 rounded-[2px]" />
        <div className="h-3 bg-neutral-200/50 w-1/2 rounded-[2px]" />
      </div>

      {/* Product Price placeholder */}
      <div className="pt-1">
        <div className="h-3.5 bg-neutral-200/50 w-1/4 rounded-[2px]" />
      </div>
    </div>
  );
};

/**
 * Reusable pulsing Skeleton loader for Product Details layouts
 */
export const ProductDetailSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-background pt-[120px] pb-16 px-[clamp(1.5rem,5vw,4rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery Skeletons (5 cols) */}
        <div className="lg:col-span-7 space-y-4 animate-pulse">
          {/* Main Large Image */}
          <div className="w-full aspect-[4/5] bg-neutral-200/50 rounded-[2px]" />
          
          {/* Thumbnails grid */}
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="aspect-square bg-neutral-200/50 rounded-[2px]" />
            ))}
          </div>
        </div>

        {/* Right Column: Pricing & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-8 animate-pulse pt-2">
          
          {/* Brand & Title */}
          <div className="space-y-3">
            <div className="h-3 bg-neutral-200/50 w-1/4 rounded-[2px]" />
            <div className="h-8 bg-neutral-200/50 w-5/6 rounded-[2px]" />
            <div className="h-4 bg-neutral-200/50 w-1/3 rounded-[2px]" />
          </div>

          {/* Pricing Block */}
          <div className="border-y border-border/40 py-5 space-y-2">
            <div className="h-6 bg-neutral-200/50 w-1/4 rounded-[2px]" />
            <div className="h-3 bg-neutral-200/50 w-1/2 rounded-[2px]" />
          </div>

          {/* Quantity Selector Skeleton */}
          <div className="space-y-3">
            <div className="h-3 bg-neutral-200/50 w-1/6 rounded-[2px]" />
            <div className="h-10 bg-neutral-200/50 w-1/3 rounded-[2px]" />
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <div className="h-12 bg-neutral-200/50 w-full rounded-[2px]" />
            <div className="h-12 bg-neutral-200/50 w-full rounded-[2px]" />
          </div>

          {/* Accordion List placeholders */}
          <div className="space-y-4 pt-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-10 border-b border-border/40 flex items-center justify-between">
                <div className="h-3.5 bg-neutral-200/50 w-1/3 rounded-[2px]" />
                <div className="h-3.5 bg-neutral-200/50 w-4 rounded-[2px]" />
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

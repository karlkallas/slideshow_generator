'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSlideStore } from '@/stores/useSlideStore';
import { SlideToolbar } from '@/components/toolbar/SlideToolbar';
import type { Slide, CropRatio } from '@/types/slide';

interface SlideCardProps {
  slide: Slide;
  index: number;
}

// Calculate the crop mask percentage based on ratio
function getCropMaskPercent(cropRatio: CropRatio): number {
  switch (cropRatio) {
    case '9:16':
      return 0;
    case '4:5': {
      const targetRatio = 4 / 5;
      const targetHeight = 9 / targetRatio;
      const maskTotal = (16 - targetHeight) / 16;
      return (maskTotal / 2) * 100;
    }
    case '1:1': {
      const targetRatio = 1 / 1;
      const targetHeight = 9 / targetRatio;
      const maskTotal = (16 - targetHeight) / 16;
      return (maskTotal / 2) * 100;
    }
    default:
      return 0;
  }
}

function SlideCardContent({ slide, index, isSelected = false }: {
  slide: Slide;
  index: number;
  isSelected?: boolean;
}) {
  const cropMaskPercent = getCropMaskPercent(slide.cropRatio);

  return (
    <div
      className={cn(
        'relative w-[135px] aspect-[9/16] rounded-lg overflow-hidden',
        'border cursor-pointer',
        slide.imageData ? 'bg-card' : 'bg-card/60',
        isSelected 
          ? 'border-blue-400'
          : 'border-border/60 hover:border-border'
      )}
    >
      {slide.imageData ? (
        <img
          src={slide.imageData}
          alt={`Slide ${index + 1}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-3/4 h-1 bg-muted-foreground/20 rounded" />
          <div className="w-2/3 h-1 bg-muted-foreground/20 rounded" />
          <div className="w-1/2 h-1 bg-muted-foreground/20 rounded" />
          <div className="w-3/5 h-1 bg-muted-foreground/20 rounded" />
        </div>
      )}

      {cropMaskPercent > 0 && (
        <>
          <div 
            className="absolute top-0 left-0 right-0 bg-black pointer-events-none"
            style={{ height: `${cropMaskPercent}%` }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-black pointer-events-none"
            style={{ height: `${cropMaskPercent}%` }}
          />
        </>
      )}
    </div>
  );
}

export function SlideCard({ slide, index }: SlideCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedSlideId, setSelectedSlide } = useSlideStore();
  const isSelected = selectedSlideId === slide.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSlide(slide.id);
  };

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-sm text-muted-foreground mb-2 font-mono">
        {index + 1}
      </span>

      <div className="relative">
        <div onClick={handleClick}>
          <SlideCardContent 
            slide={slide} 
            index={index} 
            isSelected={isSelected}
          />
        </div>

        {(isHovered || isSelected) && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3">
            <SlideToolbar slideId={slide.id} />
          </div>
        )}
      </div>
    </div>
  );
}

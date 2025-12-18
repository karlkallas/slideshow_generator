'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { useSlideStore } from '@/stores/useSlideStore';
import { SlideToolbar } from '@/components/toolbar/SlideToolbar';
import type { Slide, CropRatio } from '@/types/slide';

interface SlideCardProps {
  slide: Slide;
  index: number;
}

// Calculate the crop mask percentage based on ratio
// Slide is 9:16 (aspect ratio 0.5625). Calculate how much to mask for other ratios.
function getCropMaskPercent(cropRatio: CropRatio): number {
  // The slide is 9:16 = 0.5625
  // For a target ratio, we need to find what portion of the height is cropped
  const slideRatio = 9 / 16; // 0.5625

  switch (cropRatio) {
    case '9:16':
      return 0; // No mask needed
    case '4:5': {
      // 4:5 = 0.8, which is wider than 9:16
      // To fit 4:5 content in 9:16 frame: height = width / targetRatio
      // If width = 9, height for 4:5 = 9 / 0.8 = 11.25 (instead of 16)
      // Mask = (16 - 11.25) / 16 = 29.7% total, so ~14.8% each side
      const targetRatio = 4 / 5;
      const targetHeight = 9 / targetRatio;
      const maskTotal = (16 - targetHeight) / 16;
      return (maskTotal / 2) * 100;
    }
    case '1:1': {
      // 1:1 = 1.0, which is wider than 9:16
      // If width = 9, height for 1:1 = 9 / 1 = 9 (instead of 16)
      // Mask = (16 - 9) / 16 = 43.75% total, so ~21.9% each side
      const targetRatio = 1 / 1;
      const targetHeight = 9 / targetRatio;
      const maskTotal = (16 - targetHeight) / 16;
      return (maskTotal / 2) * 100;
    }
    default:
      return 0;
  }
}

// Shared card content component to avoid duplication
function SlideCardContent({ slide, index, isSelected = false, isDragging = false, isOverlay = false }: {
  slide: Slide;
  index: number;
  isSelected?: boolean;
  isDragging?: boolean;
  isOverlay?: boolean;
}) {
  const cropMaskPercent = getCropMaskPercent(slide.cropRatio);

  return (
    <div
      className={cn(
        'relative w-[135px] aspect-[9/16] rounded-lg overflow-hidden',
        'bg-card border-2',
        isOverlay 
          ? 'border-blue-500 shadow-2xl shadow-blue-500/30 cursor-grabbing'
          : 'cursor-grab active:cursor-grabbing',
        !isOverlay && isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
          : !isOverlay && 'border-border/60 hover:border-border',
        isDragging && 'opacity-0'
      )}
    >
      {/* Image content - fills width, centered vertically, maintains aspect ratio */}
      {slide.imageData ? (
        <img
          src={slide.imageData}
          alt={`Slide ${index + 1}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      ) : (
        /* Empty state - show placeholder lines like wireframe */
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-3/4 h-1 bg-muted-foreground/20 rounded" />
          <div className="w-2/3 h-1 bg-muted-foreground/20 rounded" />
          <div className="w-1/2 h-1 bg-muted-foreground/20 rounded" />
          <div className="w-3/5 h-1 bg-muted-foreground/20 rounded" />
        </div>
      )}

      {/* Crop mask overlay - blacks out top and bottom based on cropRatio */}
      {cropMaskPercent > 0 && (
        <>
          {/* Top mask */}
          <div 
            className="absolute top-0 left-0 right-0 bg-black pointer-events-none"
            style={{ height: `${cropMaskPercent}%` }}
          />
          {/* Bottom mask */}
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
  const { selectedSlideId, setSelectedSlide } = useSlideStore();
  const isSelected = selectedSlideId === slide.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  // Custom transition for smoother movement of displaced items
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSlide(slide.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col items-center"
    >
      {/* Slide number */}
      <span className={cn(
        "text-sm text-muted-foreground mb-2 font-mono",
        isDragging && 'opacity-0'
      )}>
        {index + 1}
      </span>

      {/* Slide card - TikTok 9:16 aspect ratio (1080x1920) */}
      <div
        {...attributes}
        {...listeners}
        onClick={handleClick}
      >
        <SlideCardContent 
          slide={slide} 
          index={index} 
          isSelected={isSelected} 
          isDragging={isDragging}
        />
      </div>

      {/* Toolbar - only show when selected and not dragging */}
      {isSelected && !isDragging && <SlideToolbar slideId={slide.id} />}
    </div>
  );
}

// Overlay component shown during drag - rendered in DragOverlay
export function SlideCardOverlay({ slide, index }: SlideCardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Slide number */}
      <span className="text-sm text-muted-foreground mb-2 font-mono">
        {index + 1}
      </span>

      <SlideCardContent 
        slide={slide} 
        index={index} 
        isOverlay={true}
      />
    </div>
  );
}


'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { useSlideStore } from '@/stores/useSlideStore';
import { SlideToolbar } from '@/components/toolbar/SlideToolbar';
import type { Slide } from '@/types/slide';

interface SlideCardProps {
  slide: Slide;
  index: number;
}

// Shared card content component to avoid duplication
function SlideCardContent({ slide, index, isSelected = false, isDragging = false, isOverlay = false }: {
  slide: Slide;
  index: number;
  isSelected?: boolean;
  isDragging?: boolean;
  isOverlay?: boolean;
}) {
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


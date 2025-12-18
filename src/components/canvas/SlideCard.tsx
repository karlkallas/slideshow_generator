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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSlide(slide.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex flex-col items-center',
        isDragging && 'z-50'
      )}
    >
      {/* Slide number */}
      <span className="text-sm text-muted-foreground mb-2 font-mono">
        {index + 1}
      </span>

      {/* Slide card */}
      <div
        {...attributes}
        {...listeners}
        onClick={handleClick}
        className={cn(
          'relative w-[140px] h-[249px] rounded-lg cursor-grab active:cursor-grabbing transition-all',
          'bg-card border-2',
          isSelected
            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
            : 'border-border/60 hover:border-border',
          isDragging && 'opacity-50'
        )}
      >
        {/* Image content */}
        {slide.imageData ? (
          <img
            src={slide.imageData}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover rounded-md"
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

      {/* Toolbar - only show when selected */}
      {isSelected && <SlideToolbar slideId={slide.id} />}
    </div>
  );
}


'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useSlideStore } from '@/stores/useSlideStore';
import { SlideCard, SlideCardOverlay } from './SlideCard';
import { AddSlideButton } from './AddSlideButton';
import { ZoomSlider } from './ZoomSlider';

export function Canvas() {
  const { slides, reorderSlides, setSelectedSlide } = useSlideStore();
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [zoom, setZoom] = useState(1.5);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch from @dnd-kit generating different IDs on server vs client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSlides(String(active.id), String(over.id));
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveId(null);
  };

  const activeSlide = activeId ? slides.find(s => s.id === activeId) : null;
  const activeIndex = activeId ? slides.findIndex(s => s.id === activeId) : -1;

  const handleCanvasClick = () => {
    setSelectedSlide(null);
  };

  const handleZoomChange = useCallback((newZoom: number) => {
    if (transformRef.current) {
      const { setTransform, instance } = transformRef.current;
      const { positionX, positionY } = instance.transformState;
      setTransform(positionX, positionY, newZoom);
    }
  }, []);

  const handleTransform = useCallback((ref: ReactZoomPanPinchRef) => {
    setZoom(ref.state.scale);
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden" onClick={handleCanvasClick}>
      <TransformWrapper
        ref={transformRef}
        initialScale={1.5}
        minScale={0.5}
        maxScale={2}
        centerOnInit
        limitToBounds={false}
        panning={{ 
          disabled: isDragging,
          velocityDisabled: true 
        }}
        onTransformed={handleTransform}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full !cursor-grab active:!cursor-grabbing"
          contentClass="!flex !items-center !justify-center !min-h-full !min-w-full !p-20"
        >
          {isMounted ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToHorizontalAxis]}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={slides.map((s) => s.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex items-center gap-8">
                  {slides.map((slide, index) => (
                    <SlideCard key={slide.id} slide={slide} index={index} />
                  ))}
                  <AddSlideButton />
                </div>
              </SortableContext>
              <DragOverlay>
                {activeSlide && activeIndex >= 0 ? (
                  <SlideCardOverlay slide={activeSlide} index={activeIndex} />
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="flex items-center gap-8">
              {slides.map((slide, index) => (
                <SlideCard key={slide.id} slide={slide} index={index} />
              ))}
              <AddSlideButton />
            </div>
          )}
        </TransformComponent>
      </TransformWrapper>
      <ZoomSlider zoom={zoom} onZoomChange={handleZoomChange} />
    </div>
  );
}

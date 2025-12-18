'use client';

import { useCallback, useRef, useState } from 'react';
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
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useSlideStore } from '@/stores/useSlideStore';
import { SlideCard } from './SlideCard';
import { AddSlideButton } from './AddSlideButton';
import { ZoomSlider } from './ZoomSlider';

export function Canvas() {
  const { slides, reorderSlides, setSelectedSlide } = useSlideStore();
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

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
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSlides(String(active.id), String(over.id));
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
  };

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
        initialScale={1}
        minScale={0.25}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
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
          </DndContext>
        </TransformComponent>
      </TransformWrapper>
      <ZoomSlider zoom={zoom} onZoomChange={handleZoomChange} />
    </div>
  );
}

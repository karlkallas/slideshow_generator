'use client';

import { useCallback, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSlideStore } from '@/stores/useSlideStore';
import { SlideCard } from './SlideCard';
import { AddSlideButton } from './AddSlideButton';
import { ZoomSlider } from './ZoomSlider';

export function Canvas() {
  const { slides, setSelectedSlide } = useSlideStore();
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [zoom, setZoom] = useState(1.5);

  const handleCanvasClick = () => {
    setSelectedSlide(null);
  };

  const handleZoomChange = useCallback((newZoom: number) => {
    if (transformRef.current) {
      transformRef.current.centerView(newZoom);
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
        minScale={0.6}
        maxScale={2.4}
        centerOnInit
        centerZoomedOut
        limitToBounds={false}
        panning={{ disabled: true }}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        onTransformed={handleTransform}
        onZoomStop={({ centerView, state }) => {
          centerView(state.scale, 150);
        }}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!flex !items-center !justify-center !min-h-full !min-w-full"
        >
          {/* Grid background - scales with zoom */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0.2px, transparent 0.2px)',
              backgroundSize: '15px 15px',
              minWidth: '200vw',
              minHeight: '200vh',
            }}
          />
          <div className="flex items-center gap-8 p-20 relative z-10">
            {slides.map((slide, index) => (
              <SlideCard key={slide.id} slide={slide} index={index} />
            ))}
            <AddSlideButton />
          </div>
        </TransformComponent>
      </TransformWrapper>
      
      {/* Preview button - top right */}
      <Button
        variant="ghost"
        className="fixed top-4 right-4 gap-2 text-foreground hover:text-foreground/80 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <span>preview</span>
        <Play className="w-4 h-4 fill-current" />
      </Button>
      
      <ZoomSlider zoom={zoom} onZoomChange={handleZoomChange} />
    </div>
  );
}

'use client';

import { Slider } from '@/components/ui/slider';

interface ZoomSliderProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function ZoomSlider({ zoom, onZoomChange }: ZoomSliderProps) {
  const handleChange = (value: number[]) => {
    onZoomChange(value[0]);
  };

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 w-40">
      <Slider
        value={[zoom]}
        onValueChange={handleChange}
        min={0.5}
        max={2}
        step={0.05}
        className="w-full"
      />
    </div>
  );
}


'use client';

import { Plus } from 'lucide-react';
import { useSlideStore } from '@/stores/useSlideStore';

export function AddSlideButton() {
  const addSlide = useSlideStore((state) => state.addSlide);

  return (
    <button
      onClick={addSlide}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 group border border-muted-foreground/30 hover:border-muted-foreground/50 bg-transparent cursor-pointer"
    >
      <Plus className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
}

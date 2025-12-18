import { create } from 'zustand';
import { Slide, SlideStore } from '@/types/slide';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useSlideStore = create<SlideStore>((set, get) => ({
  slides: [
    { id: generateId(), order: 0, imageData: null },
  ],
  selectedSlideId: null,

  addSlide: () => {
    const { slides } = get();
    const newSlide: Slide = {
      id: generateId(),
      order: slides.length,
      imageData: null,
    };
    set({ slides: [...slides, newSlide] });
  },

  deleteSlide: (id: string) => {
    const { slides, selectedSlideId } = get();
    const filtered = slides.filter((s) => s.id !== id);
    // Reindex orders
    const reordered = filtered.map((s, i) => ({ ...s, order: i }));
    set({
      slides: reordered,
      selectedSlideId: selectedSlideId === id ? null : selectedSlideId,
    });
  },

  updateSlide: (id: string, imageData: string) => {
    const { slides } = get();
    const updated = slides.map((s) =>
      s.id === id ? { ...s, imageData } : s
    );
    set({ slides: updated });
  },

  reorderSlides: (activeId: string, overId: string) => {
    const { slides } = get();
    const activeIndex = slides.findIndex((s) => s.id === activeId);
    const overIndex = slides.findIndex((s) => s.id === overId);

    if (activeIndex === -1 || overIndex === -1) return;

    const newSlides = [...slides];
    const [removed] = newSlides.splice(activeIndex, 1);
    newSlides.splice(overIndex, 0, removed);

    // Reindex orders
    const reordered = newSlides.map((s, i) => ({ ...s, order: i }));
    set({ slides: reordered });
  },

  setSelectedSlide: (id: string | null) => {
    set({ selectedSlideId: id });
  },
}));


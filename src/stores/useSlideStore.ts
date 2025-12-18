import { create } from 'zustand';
import { Slide, SlideStore, CropRatio } from '@/types/slide';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useSlideStore = create<SlideStore>((set, get) => ({
  slides: [
    { id: generateId(), order: 0, imageData: null, cropRatio: '9:16' },
  ],
  selectedSlideId: null,
  generatedImages: [],
  uploadedImages: [],

  addSlide: () => {
    const { slides } = get();
    const newSlide: Slide = {
      id: generateId(),
      order: slides.length,
      imageData: null,
      cropRatio: '9:16',
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

  updateSlideCropRatio: (id: string, cropRatio: CropRatio) => {
    const { slides } = get();
    const updated = slides.map((s) =>
      s.id === id ? { ...s, cropRatio } : s
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

  addGeneratedImages: (images: string[]) => {
    const { generatedImages } = get();
    // Add new images at start, avoid duplicates, keep last 20
    const newImages = [...images, ...generatedImages];
    const unique = [...new Set(newImages)].slice(0, 20);
    set({ generatedImages: unique });
  },

  addUploadedImage: (image: string) => {
    const { uploadedImages } = get();
    // Add new image at start, avoid duplicates, keep last 20
    const newImages = [image, ...uploadedImages.filter(img => img !== image)].slice(0, 20);
    set({ uploadedImages: newImages });
  },

  moveSlideLeft: (id: string) => {
    const { slides } = get();
    const index = slides.findIndex((s) => s.id === id);
    if (index <= 0) return; // Can't move first slide left
    
    const newSlides = [...slides];
    [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
    const reordered = newSlides.map((s, i) => ({ ...s, order: i }));
    set({ slides: reordered });
  },

  moveSlideRight: (id: string) => {
    const { slides } = get();
    const index = slides.findIndex((s) => s.id === id);
    if (index === -1 || index >= slides.length - 1) return; // Can't move last slide right
    
    const newSlides = [...slides];
    [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    const reordered = newSlides.map((s, i) => ({ ...s, order: i }));
    set({ slides: reordered });
  },
}));

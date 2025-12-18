export interface Slide {
  id: string;
  order: number;
  imageData: string | null; // base64 data URL
}

export interface SlideStore {
  slides: Slide[];
  selectedSlideId: string | null;
  
  // Actions
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  updateSlide: (id: string, imageData: string) => void;
  reorderSlides: (activeId: string, overId: string) => void;
  setSelectedSlide: (id: string | null) => void;
}


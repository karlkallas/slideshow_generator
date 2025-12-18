export type CropRatio = '4:5' | '9:16' | '1:1';

export interface Slide {
  id: string;
  order: number;
  imageData: string | null; // base64 data URL
  cropRatio: CropRatio; // default: '9:16'
}

export interface SlideStore {
  slides: Slide[];
  selectedSlideId: string | null;
  generatedImages: string[]; // AI generated images
  uploadedImages: string[]; // User uploaded images
  
  // Actions
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  updateSlide: (id: string, imageData: string) => void;
  updateSlideCropRatio: (id: string, cropRatio: CropRatio) => void;
  reorderSlides: (activeId: string, overId: string) => void;
  setSelectedSlide: (id: string | null) => void;
  addGeneratedImages: (images: string[]) => void;
  addUploadedImage: (image: string) => void;
  moveSlideLeft: (id: string) => void;
  moveSlideRight: (id: string) => void;
}

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageModeMenu, ImageMode } from './ImageModeMenu';
import { AiImagePanel } from './AiImagePanel';
import { UploadPanel } from './UploadPanel';

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (imageData: string) => void;
}

export function ImageDialog({ open, onOpenChange, onImageSelect }: ImageDialogProps) {
  const [mode, setMode] = useState<ImageMode>('ai');

  const handleImageSelect = (imageData: string) => {
    onImageSelect(imageData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Add Image</DialogTitle>
        <div className="flex min-h-[400px]">
          {/* Left sidebar menu */}
          <div className="p-6 bg-card">
            <ImageModeMenu mode={mode} onModeChange={setMode} />
          </div>
          
          {/* Right content panel */}
          <div className="flex-1 p-6 bg-background">
            {mode === 'ai' ? (
              <AiImagePanel onImageSelect={handleImageSelect} />
            ) : (
              <UploadPanel onImageSelect={handleImageSelect} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSlideStore } from '@/stores/useSlideStore';

interface UploadPanelProps {
  onImageSelect: (imageData: string) => void;
}

export function UploadPanel({ onImageSelect }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const { uploadedImages, addUploadedImage } = useSlideStore();

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      addUploadedImage(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect, addUploadedImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleUseImage = () => {
    if (selectedIndex !== null && uploadedImages[selectedIndex]) {
      onImageSelect(uploadedImages[selectedIndex]);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-6 gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'min-h-[150px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer',
          isDragOver
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-border hover:border-muted-foreground hover:bg-muted/50'
        )}
      >
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
          isDragOver ? 'bg-blue-500/20' : 'bg-muted'
        )}>
          <Upload className={cn(
            'w-6 h-6 transition-colors',
            isDragOver ? 'text-blue-400' : 'text-muted-foreground'
          )} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            {isDragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>

      {/* Uploaded images gallery */}
      {uploadedImages.length > 0 && (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-muted-foreground">Uploaded Images</label>
          <div className="flex gap-3 flex-wrap">
            {uploadedImages.map((imageData, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={cn(
                  'w-16 h-16 rounded-md border-2 overflow-hidden transition-all cursor-pointer',
                  selectedIndex === index
                    ? 'border-green-500 ring-2 ring-green-500/30'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                <img 
                  src={imageData} 
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {selectedIndex !== null && (
            <Button 
              onClick={handleUseImage}
              variant="secondary"
              className="cursor-pointer self-end"
            >
              Use Selected
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

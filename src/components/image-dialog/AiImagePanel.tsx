'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AiImagePanelProps {
  onImageSelect: (imageData: string) => void;
}

export function AiImagePanel({ onImageSelect }: AiImagePanelProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCreate = () => {
    // Placeholder - will integrate with AI API later
    alert('AI Image Generation coming soon!');
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleUseImage = () => {
    if (selectedIndex !== null && generatedImages[selectedIndex]) {
      onImageSelect(generatedImages[selectedIndex]);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Prompt</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="min-h-[100px] resize-none"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleCreate}
          className="cursor-pointer"
          disabled={!prompt.trim()}
        >
          Create
        </Button>
      </div>

      {/* Generated images gallery - only shows when images exist */}
      {generatedImages.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex gap-3">
            {generatedImages.map((imageData, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={cn(
                  'w-20 h-20 rounded-md border-2 overflow-hidden transition-all cursor-pointer',
                  selectedIndex === index
                    ? 'border-green-500 ring-2 ring-green-500/30'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                <img 
                  src={imageData} 
                  alt={`Generated ${index + 1}`}
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


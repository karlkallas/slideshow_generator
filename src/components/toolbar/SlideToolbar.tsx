'use client';

import { useState } from 'react';
import { Image, Crop, Type, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSlideStore } from '@/stores/useSlideStore';
import { ImageDialog } from '@/components/image-dialog/ImageDialog';

interface SlideToolbarProps {
  slideId: string;
}

export function SlideToolbar({ slideId }: SlideToolbarProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const { updateSlide, deleteSlide } = useSlideStore();

  const handleImageSelect = (imageData: string) => {
    updateSlide(slideId, imageData);
  };

  const handleDelete = () => {
    deleteSlide(slideId);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className="flex items-center gap-1 mt-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setImageDialogOpen(true)}
            >
              <Image className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-not-allowed opacity-50"
              disabled
            >
              <Crop className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Crop (coming soon)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-not-allowed opacity-50"
              disabled
            >
              <Type className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add text (coming soon)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete slide</p>
          </TooltipContent>
        </Tooltip>

        <ImageDialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          onImageSelect={handleImageSelect}
        />
      </div>
    </TooltipProvider>
  );
}

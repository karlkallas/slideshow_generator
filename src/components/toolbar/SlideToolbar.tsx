'use client';

import { useState } from 'react';
import { Image, Crop, Type, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useSlideStore } from '@/stores/useSlideStore';
import { ImageDialog } from '@/components/image-dialog/ImageDialog';
import type { CropRatio } from '@/types/slide';

interface SlideToolbarProps {
  slideId: string;
}

export function SlideToolbar({ slideId }: SlideToolbarProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const { slides, updateSlide, updateSlideCropRatio, deleteSlide, moveSlideLeft, moveSlideRight } = useSlideStore();
  
  const currentSlide = slides.find(s => s.id === slideId);
  const currentCropRatio = currentSlide?.cropRatio || '9:16';
  const slideIndex = slides.findIndex(s => s.id === slideId);
  const canMoveLeft = slideIndex > 0;
  const canMoveRight = slideIndex < slides.length - 1;

  const handleImageSelect = (imageData: string) => {
    updateSlide(slideId, imageData);
  };

  const handleDelete = () => {
    deleteSlide(slideId);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div 
        className="flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main toolbar */}
        <div className="flex items-center gap-1">
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

        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Crop className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Crop ratio</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-32 p-3" align="center" side="bottom">
            <RadioGroup
              value={currentCropRatio}
              onValueChange={(value) => updateSlideCropRatio(slideId, value as CropRatio)}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="9:16" id={`crop-9-16-${slideId}`} className="cursor-pointer" />
                <Label htmlFor={`crop-9-16-${slideId}`} className="cursor-pointer text-sm">9:16</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="4:5" id={`crop-4-5-${slideId}`} className="cursor-pointer" />
                <Label htmlFor={`crop-4-5-${slideId}`} className="cursor-pointer text-sm">4:5</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="1:1" id={`crop-1-1-${slideId}`} className="cursor-pointer" />
                <Label htmlFor={`crop-1-1-${slideId}`} className="cursor-pointer text-sm">1:1</Label>
              </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>

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

        {/* Move arrows - only show if more than one slide */}
        {slides.length > 1 && (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => moveSlideLeft(slideId)}
                  disabled={!canMoveLeft}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move left</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => moveSlideRight(slideId)}
                  disabled={!canMoveRight}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move right</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

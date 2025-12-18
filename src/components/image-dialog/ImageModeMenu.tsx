'use client';

import { ChevronRight, Sparkles, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ImageMode = 'ai' | 'upload';

interface ImageModeMenuProps {
  mode: ImageMode;
  onModeChange: (mode: ImageMode) => void;
}

export function ImageModeMenu({ mode, onModeChange }: ImageModeMenuProps) {
  return (
    <div className="w-48 pr-4">
      <h3 className="font-medium text-sm mb-4">Image</h3>
      <nav className="space-y-1">
        <button
          onClick={() => onModeChange('ai')}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
            mode === 'ai'
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Image Gen
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onModeChange('upload')}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer',
            mode === 'upload'
              ? 'text-blue-400 bg-blue-500/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <span className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}


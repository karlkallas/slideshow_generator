'use client';

import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/40">
      <span className="text-lg italic text-muted-foreground font-light tracking-wide">
        canvas
      </span>
      <Button
        variant="ghost"
        className="gap-2 text-foreground hover:text-foreground/80 cursor-pointer"
      >
        <span>preview</span>
        <Play className="w-4 h-4 fill-current" />
      </Button>
    </header>
  );
}


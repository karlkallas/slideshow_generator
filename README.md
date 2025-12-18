# TikTok Slideshow Generator

A canvas-based web app for creating TikTok slideshows. Built with Next.js 15, shadcn/ui, and a modern dark theme.

## Features

- **Canvas UI** - Infinite pan/zoom canvas similar to Figma/Miro
- **Slide Management** - Add, delete, and reorder slides via drag-and-drop
- **Image Upload** - Upload images to slides via dialog with drag & drop support
- **AI Image Generation** - Coming soon (UI placeholder ready)
- **Dark Theme** - Sleek dark interface

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Canvas Pan/Zoom**: react-zoom-pan-pinch
- **Styling**: Tailwind CSS

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/
│   ├── canvas/             # Canvas, SlideCard, ZoomSlider
│   ├── header/             # Header with preview button
│   ├── image-dialog/       # Image upload/AI generation dialog
│   ├── toolbar/            # Slide toolbar (image, crop, text, delete)
│   └── ui/                 # shadcn components
├── stores/                 # Zustand state management
├── lib/                    # Utilities
└── types/                  # TypeScript types
```

## Roadmap

- [ ] AI Image Generation (Gemini integration)
- [ ] Text overlays on slides
- [ ] Aspect ratio/crop tool
- [ ] Export as numbered PNGs (ZIP)
- [ ] IndexedDB persistence
- [ ] Preview mode

'use client';

import { Header } from '@/components/header/Header';
import { Canvas } from '@/components/canvas/Canvas';

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-background">
      <Header />
      <Canvas />
    </main>
  );
}

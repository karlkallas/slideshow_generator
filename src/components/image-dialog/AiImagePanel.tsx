'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useSlideStore } from '@/stores/useSlideStore';

interface AiImagePanelProps {
  onImageSelect: (imageData: string) => void;
}

const DEFAULT_PROMPT = `{
  "task_configuration": {
    "task_type": "screen_simulation_photorealism",
    "target_model": "SDXL_1.0_Refiner",
    "aspect_ratio": "9:16",
    "resolution": {
      "width": 1080,
      "height": 1920
    }
  },
  "visual_hierarchy": {
    "layer_1_physical_macro": {
      "camera_angle": "Downward-angled, high-angle",
      "framing": "MacBook screen filling 95% of frame",
      "surface_imperfections": [
        "subtle pixel-grid texture (moire)",
        "tiny dust particles on glass",
        "faint ambient light reflection on glossy screen",
        "fingerprint smudges"
      ],
      "foreground_anchor": "Thin strip of physical keyboard visible at lower edge"
    },
    "layer_2_digital_interface": {
      "theme": "Dark Mode (macOS)",
      "window_layout": {
        "left_panel": "Spotify 'Liked Songs' playlist (dimmed)",
        "right_panel": "Photo Booth live-preview window (dominant focus)"
      }
    },
    "layer_3_nested_subject_content": {
      "context": "Inside the Photo Booth window",
      "environment": "Dim bedroom, off-white wall, rumpled bedding",
      "lighting_simulation": "Cool screen glow mixed with warm skin tones, deep nocturnal shadows",
      "subjects": {
        "shared_attributes": [
          "Oversized black hoodies",
          "Hoods pushed back (faces fully visible)",
          "Reclining pose",
          "Looking at screen"
        ],
        "subject_a_guy": {
          "identity_target": "reference_image_male.jpg",
          "action": "Holding phone in right hand with clear reflective case",
          "position": "Right/Center"
        },
        "subject_b_girl": {
          "identity_target": "reference_image_female.jpg",
          "action": "Resting closely beside Subject A",
          "position": "Left/Center"
        }
      }
    }
  },
  "prompt_assembly": {
    "positive_prompt": "Hyper-realistic downward shot of a MacBook screen. The screen surface has visible dust, pixel grid, and reflection. The screen displays a Photo Booth window showing a couple in a dark room. [Subject Descriptions]. They are wearing black hoodies. The lighting is low-key, candid, nocturnal, blue-ish screen glow. High fidelity, raw photo, unedited.",
    "negative_prompt": "vector art, screenshot, flat digital image, clean glass, perfect screen, daylight, bright studio lights, cartoon, 3d render, painting, watermark"
  },
  "identity_preservation_settings": {
    "strictness_level": "CRITICAL",
    "methodology": {
      "face_restoration": false,
      "note": "Disable generic face restorers (CodeFormer) to avoid 'plastic' look. Use IP-Adapter.",
      "control_net_stack": [
        {
          "unit": "ControlNet_Tile",
          "weight": 0.4,
          "purpose": "To maintain the text/interface sharpness"
        },
        {
          "unit": "IP-Adapter_FaceID_Plus",
          "weight": 0.95,
          "region_mask": "Photo Booth Window Area Only",
          "purpose": "To force exact facial identity match for both subjects"
        }
      ]
    }
  },
  "rendering_parameters": {
    "sampler": "DPM++ 3M SDE Exponential",
    "steps": 40,
    "cfg_scale": 5.5,
    "denoising_strength": 0.35
  }
}`;

export function AiImagePanel({ onImageSelect }: AiImagePanelProps) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { generatedImages, addGeneratedImages } = useSlideStore();

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.images && data.images.length > 0) {
        addGeneratedImages(data.images);
        setSelectedIndex(0); // Auto-select first (newest) image
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
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
          className="h-[150px] max-h-[150px] resize-none font-mono text-xs overflow-y-auto"
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={handleCreate}
          className="cursor-pointer"
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Create'
          )}
        </Button>
      </div>

      {/* Generated images gallery */}
      {generatedImages.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <label className="text-sm font-medium text-muted-foreground">Generated Images</label>
          <div className="flex gap-3 flex-wrap">
            {generatedImages.map((imageData, index) => (
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

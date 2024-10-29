"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ZoomIn, 
  ZoomOut, 
  MoveHorizontal, 
  MoveVertical,
  RotateCcw
} from "lucide-react";

interface VideoTransformProps {
  zoom: number;
  position: { x: number; y: number };
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onReset: () => void;
}

export function VideoTransform({
  zoom,
  position,
  onZoomChange,
  onPositionChange,
  onReset,
}: VideoTransformProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Zoom</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.max(1, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{zoom.toFixed(1)}x</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Slider
          value={[zoom]}
          min={1}
          max={3}
          step={0.1}
          onValueChange={([value]) => onZoomChange(value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Position X</span>
          <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
        <Slider
          value={[position.x]}
          min={-100}
          max={100}
          step={1}
          onValueChange={([x]) => onPositionChange({ ...position, x })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Position Y</span>
          <MoveVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <Slider
          value={[position.y]}
          min={-100}
          max={100}
          step={1}
          onValueChange={([y]) => onPositionChange({ ...position, y })}
        />
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset Transform
      </Button>
    </div>
  );
}
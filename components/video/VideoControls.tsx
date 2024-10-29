"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Scissors,
  RotateCcw
} from "lucide-react";

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onTimeUpdate: (time: number) => void;
  onPlaybackSpeedChange: (speed: number) => void;
  onSplit: () => void;
}

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  playbackSpeed,
  onPlayPause,
  onTimeUpdate,
  onPlaybackSpeedChange,
  onSplit,
}: VideoControlsProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipTime = (seconds: number) => {
    onTimeUpdate(Math.min(Math.max(0, currentTime + seconds), duration));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          className="flex-1"
          onValueChange={([value]) => onTimeUpdate(value)}
        />
        <span className="text-sm font-medium">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => skipTime(-5)}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => skipTime(5)}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onSplit}
          >
            <Scissors className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Speed:</span>
            <select
              className="bg-background border rounded px-2 py-1"
              value={playbackSpeed}
              onChange={(e) => onPlaybackSpeedChange(Number(e.target.value))}
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPlaybackSpeedChange(1)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
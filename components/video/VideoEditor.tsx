"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { VideoControls } from "./VideoControls";
import { VideoTransform } from "./VideoTransform";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2 } from "lucide-react";

interface VideoEditorProps {
  videoFile: File;
}

interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
}

export function VideoEditor({ videoFile }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Transform state
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Clips state
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [activeClipIndex, setActiveClipIndex] = useState(0);

  useEffect(() => {
    if (videoFile && videoRef.current) {
      const videoUrl = URL.createObjectURL(videoFile);
      videoRef.current.src = videoUrl;
      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [videoFile]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setDuration(duration);
      setClips([{ 
        id: 'initial',
        startTime: 0, 
        endTime: duration 
      }]);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeChange = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handlePlaybackSpeedChange = useCallback((speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  }, []);

  const handleSplit = useCallback(() => {
    if (currentTime > 0 && currentTime < duration) {
      const newClips = [...clips];
      const currentClip = newClips[activeClipIndex];
      
      newClips.splice(activeClipIndex, 1, 
        { 
          id: `${currentClip.id}-1`,
          startTime: currentClip.startTime, 
          endTime: currentTime 
        },
        { 
          id: `${currentClip.id}-2`,
          startTime: currentTime, 
          endTime: currentClip.endTime 
        }
      );
      
      setClips(newClips);
      toast({
        title: "Clip split",
        description: `Split at ${Math.floor(currentTime)} seconds`,
      });
    }
  }, [activeClipIndex, clips, currentTime, duration, toast]);

  const handleDeleteClip = useCallback((index: number) => {
    if (clips.length > 1) {
      const newClips = [...clips];
      newClips.splice(index, 1);
      setClips(newClips);
      if (activeClipIndex >= index) {
        setActiveClipIndex(Math.max(0, activeClipIndex - 1));
      }
      toast({
        title: "Clip deleted",
        description: `Deleted clip ${index + 1}`,
      });
    }
  }, [activeClipIndex, clips, toast]);

  const handleTrimClip = useCallback((index: number, [start, end]: [number, number]) => {
    const newClips = [...clips];
    newClips[index] = {
      ...newClips[index],
      startTime: start,
      endTime: end,
    };
    setClips(newClips);
  }, [clips]);

  const resetTransform = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-[400px,1fr] gap-6">
      <div className="space-y-4">
        <Card className="p-4">
          <Tabs defaultValue="clips">
            <TabsList className="w-full">
              <TabsTrigger value="clips" className="flex-1">Clips</TabsTrigger>
              <TabsTrigger value="transform" className="flex-1">Transform</TabsTrigger>
            </TabsList>

            <TabsContent value="clips" className="mt-4">
              <div className="space-y-3">
                {clips.map((clip, index) => (
                  <div
                    key={clip.id}
                    className={`p-4 rounded-lg transition-colors ${
                      index === activeClipIndex
                        ? "bg-primary/10 border border-primary"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Clip {index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteClip(index)}
                        disabled={clips.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Start: {formatTime(clip.startTime)}</span>
                          <span>End: {formatTime(clip.endTime)}</span>
                        </div>
                        <Slider
                          value={[clip.startTime, clip.endTime]}
                          min={0}
                          max={duration}
                          step={0.1}
                          onValueChange={([start, end]) => handleTrimClip(index, [start, end])}
                          className="mt-2"
                        />
                      </div>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setActiveClipIndex(index);
                          handleTimeChange(clip.startTime);
                        }}
                      >
                        Preview Clip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transform">
              <VideoTransform
                zoom={zoom}
                position={position}
                onZoomChange={setZoom}
                onPositionChange={setPosition}
                onReset={resetTransform}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              className="w-full h-full object-contain transition-transform"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>

          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            playbackSpeed={playbackSpeed}
            onPlayPause={togglePlay}
            onTimeUpdate={handleTimeChange}
            onPlaybackSpeedChange={handlePlaybackSpeedChange}
            onSplit={handleSplit}
          />
        </Card>
      </div>
    </div>
  );
}
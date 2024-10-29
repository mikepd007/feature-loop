"use client";

import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function VideoUploader({ onVideoUploaded }: { onVideoUploaded: (file: File) => void }) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateAndProcessFile = useCallback((file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4, WebM, etc.)",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 100MB",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Simulate progress (in real app, this would be actual upload progress)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Create a video element to check if the file is valid
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        onVideoUploaded(file);
        toast({
          title: "Upload successful",
          description: `Uploaded ${file.name}`,
        });
      }, 500);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      clearInterval(interval);
      setIsProcessing(false);
      setUploadProgress(0);
      
      toast({
        title: "Invalid video file",
        description: "The selected file appears to be corrupted or invalid",
        variant: "destructive",
      });
    };

    video.src = objectUrl;
  }, [onVideoUploaded, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  }, [validateAndProcessFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  }, [validateAndProcessFile]);

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted'
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Upload className={`h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <div className="text-center">
          <p className="text-lg font-medium">
            {isProcessing ? 'Processing video...' : 'Drag and drop your video here'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports MP4, WebM, and other video formats up to 100MB
          </p>
        </div>

        {isProcessing ? (
          <div className="w-full max-w-xs">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {uploadProgress}% complete
            </p>
          </div>
        ) : (
          <label htmlFor="video-upload">
            <Button variant="outline" className="cursor-pointer" disabled={isProcessing}>
              Choose File
            </Button>
            <input
              id="video-upload"
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileInput}
              disabled={isProcessing}
            />
          </label>
        )}
      </div>
    </Card>
  );
}
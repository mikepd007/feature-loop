"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Download, Monitor, Pause, Play, Share2, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        setRecordedChunks(chunks);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      toast({
        title: "Recording started",
        description: "Your video is now being recorded",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please check your permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      
      const tracks = (videoPreviewRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((track) => track.stop());

      toast({
        title: "Recording completed",
        description: "Your video has been recorded successfully",
      });
    }
  }, [mediaRecorder, toast]);

  const downloadRecording = useCallback(() => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "product-demo.webm";
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Download started",
      description: "Your video is being downloaded",
    });
  }, [recordedChunks, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <Tabs defaultValue="camera" className="mb-6">
          <TabsList>
            <TabsTrigger value="camera">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="screen">
              <Monitor className="h-4 w-4 mr-2" />
              Screen
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="mt-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="screen">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Screen recording coming soon</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
            {recordedChunks.length > 0 && (
              <>
                <Button onClick={downloadRecording} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </>
            )}
          </div>
          
          {isRecording && (
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2" />
              <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { VideoUploader } from "@/components/video/VideoUploader";
import { VideoEditor } from "@/components/video/VideoEditor";

export default function EditorPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Video Editor</h1>
        {videoFile && (
          <p className="text-muted-foreground">
            Editing: {videoFile.name}
          </p>
        )}
      </div>
      
      {!videoFile ? (
        <VideoUploader onVideoUploaded={setVideoFile} />
      ) : (
        <VideoEditor videoFile={videoFile} />
      )}
    </div>
  );
}
import { useState, useRef, useCallback } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (file: File, preview: string) => void;
  isAnalyzing: boolean;
}

export function ImageUpload({ onImageSelected, isAnalyzing }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelected(file, url);
    },
    [onImageSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (isAnalyzing && preview) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
        <img src={preview} alt="Uploaded" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-foreground/20 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
          <p className="text-sm font-medium text-primary-foreground">Analyzing image with AI…</p>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 aspect-video
        flex flex-col items-center justify-center gap-3
        ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/50"}
      `}
    >
      <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
        {isDragging ? (
          <Upload className="w-6 h-6 text-primary" />
        ) : (
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragging ? "Drop your image here" : "Upload a photo of your item"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Drag & drop or click to browse
        </p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
    </div>
  );
}

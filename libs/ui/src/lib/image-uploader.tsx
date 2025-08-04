import React, { useRef, useState } from 'react';
import { Alert, AlertActions, AlertTitle, Button } from './catalyst';
import { Image } from './image';

interface ImageUploaderProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  src?: string;
  fallbackElement: React.ReactNode;
  onRemove?: () => void;
}

export const ImageUploader = ({
  inputProps,
  src,
  fallbackElement,
  onRemove,
}: ImageUploaderProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
      buttonRef.current?.blur();
    }
  };

  const handleUploadClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImageSrc(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowRemoveAlert(false);
    onRemove?.();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        ref={buttonRef}
        type="button"
        className="group relative size-full cursor-pointer overflow-hidden rounded-lg sm:size-64"
        onClick={handleUploadClick}
      >
        <Image
          src={imageSrc}
          alt="Uploaded"
          fallbackElement={fallbackElement}
          className="h-full w-full object-cover"
          onError={() => setImageSrc(undefined)} // Fallback if image fails to load
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
          Upload an image
        </div>
      </button>

      <input
        ref={fileInputRef}
        {...inputProps}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {imageSrc && (
        <Button outline onClick={() => setShowRemoveAlert(true)}>
          Remove Image
        </Button>
      )}

      <Alert size="md" open={showRemoveAlert} onClose={setShowRemoveAlert}>
        <AlertTitle>Are you sure you want to delete this image?</AlertTitle>
        <AlertActions>
          <Button color="red" onClick={handleRemoveImage}>
            Yes, remove this image
          </Button>
          <Button plain onClick={() => setShowRemoveAlert(false)}>
            No, keep this image
          </Button>
        </AlertActions>
      </Alert>
    </div>
  );
};

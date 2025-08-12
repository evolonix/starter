import { UserIcon } from '@heroicons/react/24/solid';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface ImageUploaderProps {
  name?: string;
  initialImageUrl?: string;
  onChange?: (url: string) => void;
}

export interface ImageUploaderRef {
  getFile: () => File | null;
  setUploadedUrl: (url: string) => void;
}

export const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  ({ name, initialImageUrl, onChange }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(
      initialImageUrl,
    );
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useImperativeHandle(ref, () => ({
      getFile: () => file,
      setUploadedUrl: (url: string) => {
        setImageSrc(url);
        onChange?.(url);
      },
    }));

    const handleImageClick = () => {
      fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImageSrc(reader.result as string);
            setFile(file);
          }
        };
        reader.readAsDataURL(file);
      }

      setIsHovered(false);
    };

    useEffect(() => {
      const fileInput = fileInputRef.current;

      const onCancel = () => {
        setIsHovered(false);
      };

      fileInput?.addEventListener('cancel', onCancel);

      return () => {
        fileInput?.removeEventListener('cancel', onCancel);
      };
    }, []);

    return (
      <div className="relative size-48 cursor-pointer">
        <div
          tabIndex={0}
          onClick={handleImageClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleImageClick();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className="relative size-full"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Uploadable preview"
              className="size-full rounded-lg bg-zinc-100 object-cover text-zinc-950 dark:bg-zinc-800 dark:text-white"
            />
          ) : (
            <UserIcon className="size-full rounded-lg bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white" />
          )}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-950/75 text-center text-lg font-bold text-white">
              Upload an image
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {name && imageSrc && imageSrc.startsWith('http') && (
          <input type="hidden" name={name} value={imageSrc} />
        )}
      </div>
    );
  },
);

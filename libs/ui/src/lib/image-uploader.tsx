import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const MISSING_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0ibSA0IDEgYyAtMS42NDQ1MzEgMCAtMyAxLjM1NTQ2OSAtMyAzIHYgMSBoIDEgdiAtMSBjIDAgLTEuMTA5Mzc1IDAuODkwNjI1IC0yIDIgLTIgaCAxIHYgLTEgeiBtIDIgMCB2IDEgaCA0IHYgLTEgeiBtIDUgMCB2IDEgaCAxIGMgMS4xMDkzNzUgMCAyIDAuODkwNjI1IDIgMiB2IDEgaCAxIHYgLTEgYyAwIC0xLjY0NDUzMSAtMS4zNTU0NjkgLTMgLTMgLTMgeiBtIC01IDQgYyAtMC41NTA3ODEgMCAtMSAwLjQ0OTIxOSAtMSAxIHMgMC40NDkyMTkgMSAxIDEgcyAxIC0wLjQ0OTIxOSAxIC0xIHMgLTAuNDQ5MjE5IC0xIC0xIC0xIHogbSAtNSAxIHYgNCBoIDEgdiAtNCB6IG0gMTMgMCB2IDQgaCAxIHYgLTQgeiBtIC00LjUgMiBsIC0yIDIgbCAtMS41IC0xIGwgLTIgMiB2IDAuNSBjIDAgMC41IDAuNSAwLjUgMC41IDAuNSBoIDcgcyAwLjQ3MjY1NiAtMC4wMzUxNTYgMC41IC0wLjUgdiAtMSB6IG0gLTguNSAzIHYgMSBjIDAgMS42NDQ1MzEgMS4zNTU0NjkgMyAzIDMgaCAxIHYgLTEgaCAtMSBjIC0xLjEwOTM3NSAwIC0yIC0wLjg5MDYyNSAtMiAtMiB2IC0xIHogbSAxMyAwIHYgMSBjIDAgMS4xMDkzNzUgLTAuODkwNjI1IDIgLTIgMiBoIC0xIHYgMSBoIDEgYyAxLjY0NDUzMSAwIDMgLTEuMzU1NDY5IDMgLTMgdiAtMSB6IG0gLTggMyB2IDEgaCA0IHYgLTEgeiBtIDAgMCIgZmlsbD0iIzJlMzQzNCIgZmlsbC1vcGFjaXR5PSIwLjM0OTAyIi8+Cjwvc3ZnPgo=';

interface ImageUploaderProps {
  name?: string;
  initialImageUrl?: string;
  missingImage?: string;
  onChange?: (url: string) => void;
}

export interface ImageUploaderRef {
  getFile: () => File | null;
  setUploadedUrl: (url: string) => void;
}

export const ImageUploader = forwardRef<ImageUploaderRef, ImageUploaderProps>(
  ({ name, initialImageUrl, missingImage, onChange }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(
      initialImageUrl || missingImage || MISSING_IMAGE,
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
      <div className="relative size-48 cursor-pointer overflow-hidden rounded-lg">
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
          className="relative size-full bg-white"
        >
          <img
            src={imageSrc}
            alt="Uploadable preview"
            className="h-full w-full object-cover"
          />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/75 text-center text-lg font-bold text-white">
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

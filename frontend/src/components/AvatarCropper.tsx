import { useState, useCallback, FC } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import getCroppedImg from '../utils/cropUtils';
import './AvatarCropper.css';

interface AvatarCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

const AvatarCropper: FC<AvatarCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="avatar-cropper-overlay">
      <div className="avatar-cropper-container">
        <div className="cropper-wrapper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
          />
        </div>
        <div className="cropper-controls">
          <div className="zoom-slider-container">
            <span className="slider-label">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                onZoomChange(Number(e.target.value));
              }}
              className="zoom-range"
            />
          </div>
          <div className="cropper-actions">
            <button className="cropper-cancel-btn" onClick={onCancel}>Cancel</button>
            <button className="cropper-done-btn" onClick={handleDone}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropper;

import { useRef, forwardRef } from 'react';
import { upload } from '../api/client';

export const ImageUpload = forwardRef(({ onUpload, onError, onLoadingChange }, ref) => {
  const fileInputRef = useRef(null);

  // Expose the click method through the ref
  if (ref) {
    ref.current = {
      click: () => fileInputRef.current?.click()
    };
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onLoadingChange?.(true);

    try {
      const result = await upload.uploadProfileImage(file);
      onUpload(result.imageUrl);
    } catch (err) {
      onError?.(err.message || 'Upload failed');
    } finally {
      onLoadingChange?.(false);
    }
  };

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileSelect}
      className="hidden"
    />
  );
});

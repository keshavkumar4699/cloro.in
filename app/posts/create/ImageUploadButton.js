"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";

export default function ImageUploadButton({
  fileInputRef,
  handleFileChange,
  imageName,
  isSubmitting,
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`btn btn-outline justify-start text-left text-sm ${imageName ? 'border-primary' : ''}`}
        disabled={isSubmitting}
      >
        <PhotoIcon className="w-5 h-5 mr-2" />
        {imageName || "Upload Image"}
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </>
  );
}
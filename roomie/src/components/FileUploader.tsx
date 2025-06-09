// src/components/FileUploader.tsx

import { Component, createSignal, Show } from "solid-js";
import { PostType } from "~/lib/types";

interface FileUploaderProps {
  type: PostType;
  onFileSelect: (file: File | string) => void;
}

export const FileUploader: Component<FileUploaderProps> = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);

  // Get accepted file types based on post type
  const getAcceptedTypes = () => {
    switch (props.type) {
      case 'audio':
        return 'audio/*';
      case 'video':
        return 'video/*';
      case 'gif':
        return 'image/gif,image/*';
      default:
        return '*/*';
    }
  };

  // Get file type description
  const getTypeDescription = () => {
    switch (props.type) {
      case 'audio':
        return 'audio files (MP3, WAV, etc.)';
      case 'video':
        return 'video files (MP4, MOV, etc.)';
      case 'gif':
        return 'GIF images and other image files';
      default:
        return 'any files';
    }
  };

  const handleFileInput = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setSelectedFile(file);
    props.onFileSelect(file);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
  
  const files = e.dataTransfer?.files || null;
  handleFileInput(files);
  };

  const triggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = getAcceptedTypes();
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileInput(target.files);
    };
    input.click();
  };

  return (
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-700">
        Upload {props.type === 'gif' ? 'Image/GIF' : props.type.toUpperCase()} Content
      </label>
      
      <div
        class={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
          isDragging()
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <div class="text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="mt-4">
            <Show 
              when={selectedFile()} 
              fallback={
                <>
                  <p class="text-sm text-gray-600">
                    <span class="font-medium text-primary-600 hover:text-primary-500">
                      Click to upload
                    </span>{' '}
                    or drag and drop
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Supports {getTypeDescription()}
                  </p>
                </>
              }
            >
              <p class="text-sm text-gray-900 font-medium">
                {selectedFile()?.name}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {(selectedFile()?.size || 0) > 0 && 
                  `${Math.round((selectedFile()?.size || 0) / 1024)} KB`}
              </p>
              <button
                type="button"
                class="mt-2 text-xs text-primary-600 hover:text-primary-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  triggerFileInput();
                }}
              >
                Choose different file
              </button>
            </Show>
          </div>
        </div>
      </div>

      <Show when={props.type === 'gif' || props.type === 'video'}>
        <div class="text-xs text-gray-500">
          <p>• For best results, keep file sizes under 10MB</p>
          <Show when={props.type === 'gif'}>
            <p>• GIF files will be displayed inline in posts</p>
          </Show>
          <Show when={props.type === 'video'}>
            <p>• Video files will be embedded as playable content</p>
          </Show>
        </div>
      </Show>
    </div>
  );
};
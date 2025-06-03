import { Component, createSignal, Show } from "solid-js";
import { PostType } from "~/lib/types";

type FileUploaderProps = {
  type: PostType;
  onFileSelect: (file: File | string) => void;
  initialUrl?: string;
};

export const FileUploader: Component<FileUploaderProps> = (props) => {
  const [dragActive, setDragActive] = createSignal(false);
  const [fileUrl, setFileUrl] = createSignal<string | undefined>(props.initialUrl);
  const [error, setError] = createSignal<string | null>(null);
  
  // For demo purposes, use the URL input instead of actual file upload
  const [urlInput, setUrlInput] = createSignal('');
  
  const typeLabel = () => {
    switch (props.type) {
      case 'audio':
        return 'audio';
      case 'video':
        return 'video';
      case 'gif':
        return 'GIF';
      default:
        return 'file';
    }
  };
  
  const acceptedTypes = () => {
    switch (props.type) {
      case 'audio':
        return 'audio/*';
      case 'video':
        return 'video/*';
      case 'gif':
        return 'image/gif';
      default:
        return '';
    }
  };
  
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };
  
  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      processFile(file);
    }
  };
  
  // In real implementation, this would upload the file to a server
  // For this example, we just create a local URL
  const processFile = (file: File) => {
    if (!file.type.startsWith(props.type === 'gif' ? 'image/' : props.type)) {
      setError(`Please upload a valid ${typeLabel()} file`);
      return;
    }
    
    setError(null);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    props.onFileSelect(file);
  };
  
  const handleUrlSubmit = (e: Event) => {
    e.preventDefault();
    if (urlInput()) {
      setFileUrl(urlInput());
      props.onFileSelect(urlInput());
      setError(null);
    } else {
      setError("Please enter a valid URL");
    }
  };
  
  return (
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6 py-3">
          <h2 class="text-lg font-medium text-gray-900">Upload {typeLabel()}</h2>
        </div>
      </div>
      
      <div class="p-4 sm:p-6">
        <div
          class={`border-2 border-dashed ${dragActive() ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} rounded-lg p-6 flex flex-col items-center justify-center`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg
            class={`w-12 h-12 ${dragActive() ? 'text-primary-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <p class="mt-2 text-sm text-gray-600">Drag and drop your {typeLabel()} file, or click to select</p>
          
          <input
            type="file"
            id="file-upload"
            accept={acceptedTypes()}
            onChange={handleFileChange}
            class="hidden"
          />
          
          <button
            type="button"
            onClick={() => document.getElementById('file-upload')?.click()}
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Select {typeLabel()}
          </button>
        </div>
        
        <div class="mt-6">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Or enter a URL</h3>
          <form onSubmit={handleUrlSubmit} class="flex space-x-2">
            <input
              type="text"
              value={urlInput()}
              onInput={(e) => setUrlInput(e.currentTarget.value)}
              placeholder={`Enter ${typeLabel()} URL...`}
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add
            </button>
          </form>
        </div>
        
        <Show when={error()}>
          <p class="mt-2 text-sm text-red-600">{error()}</p>
        </Show>
        
        <Show when={fileUrl()}>
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            
            <div class="mt-2">
              <Show when={props.type === 'audio'}>
                <audio src={fileUrl()} controls class="w-full" />
              </Show>
              
              <Show when={props.type === 'video'}>
                <video src={fileUrl()} controls class="w-full h-48 rounded-md object-cover" />
              </Show>
              
              <Show when={props.type === 'gif'}>
                <img src={fileUrl()} alt="GIF preview" class="w-full h-48 object-cover rounded-md" />
              </Show>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
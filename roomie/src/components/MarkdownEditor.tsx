import { Component, createSignal, createEffect } from "solid-js";
import { MarkdownPreview } from "./MarkdownPreview";

type MarkdownEditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
};

export const MarkdownEditor: Component<MarkdownEditorProps> = (props) => {
  const [markdown, setMarkdown] = createSignal(props.initialValue || "");
  const [isPreviewVisible, setIsPreviewVisible] = createSignal(true);

  // Update parent component when markdown changes
  createEffect(() => {
    if (props.onChange) {
      props.onChange(markdown());
    }
  });

  const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setMarkdown(target.value);
  };

  return (
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="border-b border-gray-200">
        <div class="px-4 sm:px-6 py-3 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Markdown Editor</h2>
          <button
            type="button"
            onClick={() => setIsPreviewVisible(!isPreviewVisible())}
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isPreviewVisible() ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </div>

      <div class={`p-4 sm:p-6 ${isPreviewVisible() ? 'lg:grid lg:grid-cols-2 lg:gap-6' : ''}`}>
        <div class={`${isPreviewVisible() ? 'lg:col-span-1' : 'w-full'}`}>
          <textarea
            value={markdown()}
            onInput={handleChange}
            class="block w-full h-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Write your markdown content here..."
          />
          <div class="mt-2 text-xs text-gray-500">
            Supports standard Markdown syntax
          </div>
        </div>
        
        {isPreviewVisible() && (
          <div class="mt-6 lg:mt-0 lg:col-span-1">
            <div class="p-4 border border-gray-300 rounded-lg h-64 overflow-y-auto">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Preview</h3>
              <MarkdownPreview markdown={markdown()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
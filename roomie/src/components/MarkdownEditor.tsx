
import { Component, createSignal, Show } from "solid-js";

type SimpleMarkdownEditorProps = {
  initialValue: string;
  onChange: (value: string) => void;
};

export const SimpleMarkdownEditor: Component<SimpleMarkdownEditorProps> = (props) => {
  const [showPreview, setShowPreview] = createSignal(false);
  const [currentValue, setCurrentValue] = createSignal(props.initialValue);

  const handleInput = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value;
    setCurrentValue(value);
    props.onChange(value);
  };

  // Simple markdown preview without external libraries
  const renderSimpleMarkdown = (markdown: string) => {
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br>');

    return html;
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700">Content</label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview())}
          class="text-sm text-blue-600 hover:text-blue-500 px-2 py-1 rounded border border-blue-300 hover:bg-blue-50"
        >
          {showPreview() ? 'Edit' : 'Preview'}
        </button>
      </div>
      
      <Show
        when={!showPreview()}
        fallback={
          <div class="border border-gray-300 rounded-md p-3 bg-gray-50 min-h-[200px]">
            <div 
              class="prose prose-sm max-w-none"
              innerHTML={renderSimpleMarkdown(currentValue())}
            />
          </div>
        }
      >
        <textarea
          value={currentValue()}
          onInput={handleInput}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[200px] font-mono text-sm"
          placeholder="Write your post content in Markdown...

# Example heading
**Bold text**
*Italic text*
[Link text](https://example.com)

- List item
- Another item"
        />
      </Show>
    </div>
  );
};
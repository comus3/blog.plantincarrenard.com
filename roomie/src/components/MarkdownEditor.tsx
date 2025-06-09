import { Component, createSignal, Show, createEffect } from "solid-js";
import { MarkdownPreview } from "./MarkdownPreview";

type MarkdownEditorProps = {
  initialValue: string;
  onChange: (value: string) => void;
};

export const MarkdownEditor: Component<MarkdownEditorProps> = (props) => {
  const [showPreview, setShowPreview] = createSignal(false);
  // Create internal state to manage the current value
  const [currentValue, setCurrentValue] = createSignal(props.initialValue);

  // Effect to sync with external initialValue changes
  createEffect(() => {
    setCurrentValue(props.initialValue);
  });

  const handleInput = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value;
    setCurrentValue(value); // Update internal state
    props.onChange(value);  // Notify parent
    
    // Debug log to verify the flow
    console.log('MarkdownEditor handleInput called:', {
      value,
      valueLength: value.length,
      currentValue: currentValue(),
      propsInitialValue: props.initialValue
    });
  };

  const togglePreview = () => {
    const newState = !showPreview();
    setShowPreview(newState);
    console.log('Preview toggled:', newState, 'Current content length:', currentValue().length);
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700">
          Content
        </label>
        <button
          type="button"
          onClick={togglePreview}
          class="text-sm text-blue-600 hover:text-blue-500"
        >
          {showPreview() ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>
      
      <Show
        when={!showPreview()}
        fallback={
          <div class="border border-gray-300 rounded-md p-3 bg-gray-50 min-h-[200px]">
            <MarkdownPreview markdown={currentValue()} />
          </div>
        }
      >
        <textarea
          value={currentValue()}
          onInput={handleInput}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-[200px] font-mono text-sm"
          placeholder="Write your post content in Markdown..."
        />
      </Show>
    </div>
  );
};
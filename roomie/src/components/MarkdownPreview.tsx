import { Component } from "solid-js";
import { SolidMarkdown } from "solid-markdown";

type MarkdownPreviewProps = {
  markdown: string;
};

// SPA Component: This renders markdown on the client-side, providing instant preview updates
// without server round-trips. Perfect for real-time editing experiences.
export const MarkdownPreview: Component<MarkdownPreviewProps> = (props) => {
  console.log("MarkdownPreview received:", {
    markdown: props.markdown,
    length: props.markdown?.length || 0
  });
  
  // Tailwind's prose classes ensure consistent typography rendering across SSR/SPA contexts
  return (
    <div class="prose prose-sm max-w-none">
      <SolidMarkdown children={props.markdown || "No content to preview"} />
    </div>
  );
};
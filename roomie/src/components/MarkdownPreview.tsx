import { Component } from "solid-js";
import { SolidMarkdown } from "solid-markdown";

type MarkdownPreviewProps = {
  markdown: string;
};

export const MarkdownPreview: Component<MarkdownPreviewProps> = (props) => {
  console.log("MarkdownPreview received:", {
    markdown: props.markdown,
    length: props.markdown?.length || 0
  });
  
  return (
    <div class="prose prose-sm max-w-none">
      <SolidMarkdown children={props.markdown || "No content to preview"} />
    </div>
  );
};
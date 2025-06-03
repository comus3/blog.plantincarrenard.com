import { Component } from "solid-js";
import { SolidMarkdown } from "solid-markdown";

type MarkdownPreviewProps = {
  markdown: string;
};

export const MarkdownPreview: Component<MarkdownPreviewProps> = (props) => {
  return (
    <div class="markdown-preview prose prose-sm max-w-none">
      <SolidMarkdown children={props.markdown} />
    </div>
  );
};
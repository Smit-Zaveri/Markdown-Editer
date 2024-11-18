import React, { forwardRef } from 'react';
import { marked } from 'marked';

interface MarkdownPreviewProps {
  content: string;
  searchResults?: { index: number; length: number }[];
  onScroll?: () => void; // Add onScroll prop
}

// Configure marked to treat single line breaks as hard breaks
marked.setOptions({
  breaks: true, // Enable GFM line break behavior
  gfm: true, // Use GitHub Flavored Markdown
});

const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ content, searchResults, onScroll }, ref) => {
    const highlightMatches = (text: string): string => {
      if (!searchResults?.length) return text;

      let highlighted = '';
      let lastIndex = 0;

      const sortedMatches = [...searchResults].sort((a, b) => a.index - b.index);

      sortedMatches.forEach(({ index, length }) => {
        highlighted += text.slice(lastIndex, index);
        highlighted += `<mark class="bg-yellow-200 dark:bg-yellow-700">${text.slice(
          index,
          index + length
        )}</mark>`;
        lastIndex = index + length;
      });

      highlighted += text.slice(lastIndex);
      return highlighted;
    };

    const renderMarkdown = () => {
      const highlightedContent = searchResults?.length
        ? highlightMatches(content)
        : content;

      return marked(highlightedContent);
    };

    return (
      <div
        ref={ref}
        onScroll={onScroll} // Attach the scroll handler
        className="h-[calc(100vh-12rem)] overflow-auto p-4 bg-white dark:bg-gray-800 border border-gray-200 
                  dark:border-gray-700 rounded-lg prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown() }}
      />
    );
  }
);

MarkdownPreview.displayName = 'MarkdownPreview';

export default MarkdownPreview;

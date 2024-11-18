import React, { forwardRef } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onScroll?: () => void; // Add onScroll prop
}

const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ value, onChange, onScroll }, ref) => {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={onScroll} // Attach the scroll handler
        className="w-full h-[calc(100vh-12rem)] p-4 bg-white dark:bg-gray-800 border border-gray-200 
                  dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                  outline-none font-mono text-gray-900 dark:text-gray-100 resize-none"
        placeholder="Type your markdown here..."
      />
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;

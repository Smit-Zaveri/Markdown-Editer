import React, { useState } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Heading1,
  Heading2,
  Smile,
} from 'lucide-react';
import IconButton from './IconButton';
import EmojiPicker from './EmojiPicker';

interface ToolbarProps {
  onAction: (action: string, value?: string) => void;
}

export default function Toolbar({ onAction }: ToolbarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const tools = [
    { icon: Bold, label: 'Bold', action: 'bold' },
    { icon: Italic, label: 'Italic', action: 'italic' },
    { icon: Heading1, label: 'Heading 1', action: 'h1' },
    { icon: Heading2, label: 'Heading 2', action: 'h2' },
    { icon: List, label: 'Bullet List', action: 'bullet' },
    { icon: ListOrdered, label: 'Numbered List', action: 'number' },
    { icon: Quote, label: 'Blockquote', action: 'quote' },
    { icon: Code, label: 'Code Block', action: 'code' },
    { icon: Link, label: 'Add Link', action: 'link' },
    { icon: Image, label: 'Add Image', action: 'image' },
  ];

  const handleEmojiSelect = (emoji: string) => {
    onAction('emoji', emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="rounded-lg relative flex items-center space-x-1 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {tools.map(({ icon, label, action }) => (
        <IconButton
          key={action}
          icon={icon}
          label={label}
          onClick={() => onAction(action)}
          // className="hover:bg-gray-100 dark:hover:bg-gray-700"
        />
      ))}
      <IconButton
        icon={Smile}
        label="Add Emoji"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        // className="hover:bg-gray-100 dark:hover:bg-gray-700"
      />
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}
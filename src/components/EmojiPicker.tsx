import React from 'react';
import EmojiPickerReact, { EmojiClickData } from 'emoji-picker-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="absolute z-50 mt-2">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative">
        <EmojiPickerReact
          onEmojiClick={(emojiData: EmojiClickData) => {
            onEmojiSelect(emojiData.emoji);
            onClose();
          }}
          autoFocusSearch={false}
        />
      </div>
    </div>
  );
}
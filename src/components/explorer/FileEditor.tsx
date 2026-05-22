import React, { useState, useEffect } from 'react';
import { Save, X, FileText } from 'lucide-react';
import { FileSystemNode } from '../../types';

interface FileEditorProps {
  file: FileSystemNode;
  onSave: (id: string, content: string) => void;
  onClose: () => void;
}

export const FileEditor: React.FC<FileEditorProps> = ({ file, onSave, onClose }) => {
  const [content, setContent] = useState(file.content || '');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setContent(file.content || '');
    setIsSaved(true);
  }, [file.id, file.content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSave(file.id, content);
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-muted-foreground" />
          <span className="font-medium text-foreground">{file.name}</span>
          {!isSaved && <span className="w-2 h-2 rounded-full bg-primary" title="Unsaved changes"></span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-0">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-full p-4 resize-none bg-transparent text-foreground focus:outline-none font-mono text-sm"
          spellCheck={false}
          placeholder="Type your file content here..."
        />
      </div>
    </div>
  );
};

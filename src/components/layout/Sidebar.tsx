import React from 'react';
import { FolderTree } from '../explorer/FolderTree';
import type { FileSystemNode } from '../../types';
import { HardDrive, X } from 'lucide-react';
import { cn } from '../../utils';

interface SidebarProps {
  nodes: FileSystemNode[];
  currentFolderId: string;
  onSelectFolder: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ nodes, currentFolderId, onSelectFolder, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" 
          onClick={onClose}
        />
      )}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 h-full bg-card border-r border-border flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 text-primary rounded-md">
              <HardDrive size={18} />
            </div>
            <h2 className="font-semibold text-foreground tracking-tight">Mini Explorer</h2>
          </div>
          <button onClick={onClose} className="md:hidden p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-2">
          Folders
        </div>
        
        <FolderTree 
          nodes={nodes} 
          parentId={null} 
          currentFolderId={currentFolderId} 
          onSelect={(id) => {
            onSelectFolder(id);
            if (window.innerWidth < 768) onClose();
          }} 
        />
      </div>
    </div>
    </>
  );
};

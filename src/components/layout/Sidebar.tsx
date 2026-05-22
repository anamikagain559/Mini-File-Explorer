import React from 'react';
import { FolderTree } from '../explorer/FolderTree';
import type { FileSystemNode } from '../../types';
import { HardDrive } from 'lucide-react';

interface SidebarProps {
  nodes: FileSystemNode[];
  currentFolderId: string;
  onSelectFolder: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ nodes, currentFolderId, onSelectFolder }) => {
  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 text-primary rounded-md">
          <HardDrive size={18} />
        </div>
        <h2 className="font-semibold text-foreground tracking-tight">Mini Explorer</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-2">
          Folders
        </div>
        <FolderTree 
          nodes={nodes} 
          parentId={null} 
          currentFolderId={currentFolderId} 
          onSelect={onSelectFolder} 
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';
import type { FileSystemNode } from '../../types';
import { cn } from '../../utils';

interface FolderTreeProps {
  nodes: FileSystemNode[];
  parentId: string | null;
  currentFolderId: string;
  onSelect: (id: string) => void;
  level?: number;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ 
  nodes, 
  parentId, 
  currentFolderId, 
  onSelect,
  level = 0
}) => {
  // 1. Filter out only the children that belong to this specific parentId
  const children = nodes.filter(node => node.parentId === parentId);
  // 2. We only want to display folders in the sidebar tree
  const folders = children.filter(node => node.type === 'folder');

  if (folders.length === 0) return null;

  return (
    <div className="flex flex-col">
      {folders.map(folder => (
        <FolderNode 
          key={folder.id} 
          folder={folder} 
          nodes={nodes} 
          currentFolderId={currentFolderId}
          onSelect={onSelect}
          level={level}
        />
      ))}
    </div>
  );
};

const FolderNode: React.FC<{
  folder: FileSystemNode;
  nodes: FileSystemNode[];
  currentFolderId: string;
  onSelect: (id: string) => void;
  level: number;
}> = ({ folder, nodes, currentFolderId, onSelect, level }) => {

  const isSelected = currentFolderId === folder.id;

  const containsSelected = (folderId: string, targetId: string): boolean => {
    if (folderId === targetId) return true;
    const children = nodes.filter(n => n.parentId === folderId);
    return children.some(c => containsSelected(c.id, targetId));
  };
  
  const [isOpen, setIsOpen] = useState(() => {
    // Auto expand 'root' by default or if this folder contains the selected item
    if (folder.id === 'root') return true;
    return containsSelected(folder.id, currentFolderId);
  });

  // Check if this folder has any sub-folders to show the expand arrow
  const hasChildren = nodes.some(n => n.parentId === folder.id && n.type === 'folder');

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-colors select-none text-sm group",
          isSelected ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          onSelect(folder.id);
          if (!isOpen && hasChildren) setIsOpen(true);
        }}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-0.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/10 mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ opacity: hasChildren ? undefined : 0, pointerEvents: hasChildren ? 'auto' : 'none' }}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <Folder size={16} className={cn("mr-2", isSelected ? "text-primary" : "text-blue-400")} fill="currentColor" fillOpacity={0.2} />
        <span className="truncate">{folder.name}</span>
      </div>
      
      {/* RECURSION: If this folder is open and has sub-folders, 
          it calls <FolderTree> again inside itself! */}
      {isOpen && hasChildren && (
        <FolderTree 
          nodes={nodes} 
          parentId={folder.id} 
          currentFolderId={currentFolderId}
          onSelect={onSelect}
          level={level + 1}
        />
      )}
    </div>
  );
};

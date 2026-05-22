import React from 'react';
import { FileSystemNode, FileType, ModalState } from '../../types';
import { ChevronRight, Folder, FileText, MoreVertical, Edit2, Trash2, FolderPlus, FilePlus } from 'lucide-react';
import { cn } from '../../utils';

interface MainPanelProps {
  breadcrumbs: FileSystemNode[];
  childrenNodes: FileSystemNode[];
  onNavigate: (id: string) => void;
  onOpenFile: (file: FileSystemNode) => void;
  openModal: (type: ModalState['type'], targetId: string | null, fileType?: FileType) => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({
  breadcrumbs,
  childrenNodes,
  onNavigate,
  onOpenFile,
  openModal,
}) => {
  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Top Bar / Breadcrumbs */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center text-sm">
          {breadcrumbs.map((node, index) => (
            <React.Fragment key={node.id}>
              <button
                onClick={() => onNavigate(node.id)}
                className={cn(
                  "hover:underline transition-colors",
                  index === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {node.name}
              </button>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight size={16} className="mx-1 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openModal('create', currentFolder.id, 'folder')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <FolderPlus size={16} />
            New Folder
          </button>
          <button
            onClick={() => openModal('create', currentFolder.id, 'text')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FilePlus size={16} />
            New File
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {childrenNodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Folder size={48} className="mb-4 opacity-20" />
            <p>This folder is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-max">
            {childrenNodes.map((node) => (
              <FileCard
                key={node.id}
                node={node}
                onClick={() => (node.type === 'folder' ? onNavigate(node.id) : onOpenFile(node))}
                onRename={() => openModal('rename', node.id)}
                onDelete={() => openModal('delete', node.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FileCard: React.FC<{
  node: FileSystemNode;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
}> = ({ node, onClick, onRename, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className="relative group flex flex-col items-center p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 cursor-pointer transition-all active:scale-95"
      onClick={onClick}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="relative mb-3">
        {node.type === 'folder' ? (
          <Folder size={48} className="text-blue-500 drop-shadow-sm" fill="currentColor" fillOpacity={0.2} />
        ) : (
          <FileText size={48} className="text-gray-500 dark:text-gray-400 drop-shadow-sm" />
        )}
      </div>
      <span className="text-sm font-medium text-center w-full truncate px-2" title={node.name}>
        {node.name}
      </span>

      {/* Context Menu Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={cn(
          "absolute top-2 right-2 p-1.5 rounded-md hover:bg-background/80 text-muted-foreground backdrop-blur-sm transition-opacity",
          showMenu ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <MoreVertical size={16} />
      </button>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute top-10 right-2 z-10 w-36 bg-popover rounded-md shadow-md border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename();
              setShowMenu(false);
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
          >
            <Edit2 size={14} className="mr-2" />
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setShowMenu(false);
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

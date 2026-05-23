import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { MainPanel } from '../components/layout/MainPanel';
import { FileEditor } from '../components/explorer/FileEditor';
import { InputModal, ConfirmModal } from '../components/shared/Modal';
import { useFileSystem } from '../hooks/useFileSystem';
import type { FileSystemNode, ModalState } from '../types';

export const ExplorerPage: React.FC = () => {
  const {
    nodes,
    createNode,
    renameNode,
    deleteNode,
    updateFileContent,
    getChildren,
    getNode,
    getBreadcrumbs,
    isLoaded
  } = useFileSystem();

  // 1. Manage current folder and opened file state
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  
  // 2. Manage mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 3. Manage state for our modals (Create/Rename/Delete)
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    targetId: null,
    fileType: null,
  });

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center bg-background">Loading...</div>;
  }

  // Event handler for clicking a folder to navigate inside it
  const handleNavigate = (id: string) => {
    setCurrentFolderId(id);
    setEditingFileId(null); // Close any open editor when navigating
  };

  // Event handler for clicking a text file to open it
  const handleOpenFile = (file: FileSystemNode) => {
    setEditingFileId(file.id);
  };

  const closeEditor = () => {
    setEditingFileId(null);
  };

  const openModal = (type: ModalState['type'], targetId: string | null, fileType: ModalState['fileType'] = null) => {
    setModalState({ isOpen: true, type, targetId, fileType });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, targetId: null, fileType: null });
  };

  const handleCreate = (name: string) => {
    if (modalState.targetId && modalState.fileType) {
      createNode(name, modalState.fileType, modalState.targetId);
    }
  };

  const handleRename = (name: string) => {
    if (modalState.targetId) {
      renameNode(modalState.targetId, name);
    }
  };

  const handleDelete = () => {
    if (modalState.targetId) {
      deleteNode(modalState.targetId);
      // If deleted folder is in current path, navigate back to root
      const breadcrumbs = getBreadcrumbs(currentFolderId);
      if (breadcrumbs.some(n => n.id === modalState.targetId)) {
        setCurrentFolderId('root');
      }
      // If deleted file is currently editing, close it
      if (editingFileId === modalState.targetId) {
        setEditingFileId(null);
      }
    }
  };

  const childrenNodes = getChildren(currentFolderId);
  const breadcrumbs = getBreadcrumbs(currentFolderId);
  const editingFile = editingFileId ? getNode(editingFileId) : null;
  const targetNode = modalState.targetId ? getNode(modalState.targetId) : null;

  return (
    <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
      <Sidebar 
        nodes={nodes} 
        currentFolderId={currentFolderId} 
        onSelectFolder={handleNavigate} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <MainPanel
          breadcrumbs={breadcrumbs}
          childrenNodes={childrenNodes}
          onNavigate={handleNavigate}
          onOpenFile={handleOpenFile}
          openModal={openModal}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        {/* File Editor Overlay */}
        {editingFile && (
          <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-sm p-0 md:p-8 flex justify-center items-center">
            <div className="w-full h-full md:max-w-4xl md:h-[80vh] shadow-2xl animate-in slide-in-from-bottom-8 duration-300 md:rounded-lg overflow-hidden">
              <FileEditor
                file={editingFile}
                onSave={updateFileContent}
                onClose={closeEditor}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <InputModal
        isOpen={modalState.isOpen && modalState.type === 'create'}
        onClose={closeModal}
        onSubmit={handleCreate}
        title={`Create New ${modalState.fileType === 'folder' ? 'Folder' : 'File'}`}
        placeholder="Enter name..."
        submitLabel="Create"
      />

      <InputModal
        isOpen={modalState.isOpen && modalState.type === 'rename'}
        onClose={closeModal}
        onSubmit={handleRename}
        title="Rename"
        initialValue={targetNode?.name || ''}
        placeholder="Enter new name..."
        submitLabel="Save"
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message={
          targetNode?.type === 'folder' 
            ? `Are you sure you want to delete "${targetNode?.name}" and all its contents? This action cannot be undone.`
            : `Are you sure you want to delete "${targetNode?.name}"?`
        }
      />
    </div>
  );
};
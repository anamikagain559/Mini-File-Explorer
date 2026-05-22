export type FileType = 'folder' | 'text';

export interface FileSystemNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  content?: string; // Only for 'text' files
}

export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'rename' | 'delete' | null;
  targetId: string | null;
  fileType: FileType | null; // useful for create
}

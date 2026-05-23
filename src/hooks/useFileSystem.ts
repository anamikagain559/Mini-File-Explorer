import { useState, useEffect, useCallback } from 'react';
import type { FileSystemNode, FileType } from '../types';

const STORAGE_KEY = 'mini_file_explorer_data';

const initialData: FileSystemNode[] = [
  {
    id: 'root',
    name: 'Root',
    type: 'folder',
    parentId: null,
  },
];

export const useFileSystem = () => {

  const [nodes, setNodes] = useState<FileSystemNode[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setNodes(JSON.parse(saved));
      } catch (e) {
        setNodes(initialData);
      }
    } else {
      setNodes(initialData);
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever `nodes` changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
    }
  }, [nodes, isLoaded]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Creates a new folder or text file and adds it to the array
  const createNode = useCallback((name: string, type: FileType, parentId: string) => {
    const newNode: FileSystemNode = {
      id: generateId(),
      name,
      type,
      parentId,
      ...(type === 'text' ? { content: '' } : {}),
    };
    // Use the spread operator to create a new array with the new node at the end
    setNodes((prev) => [...prev, newNode]);
    return newNode.id;
  }, []);

  const renameNode = useCallback((id: string, newName: string) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, name: newName } : node)));
  }, []);

  // Recursively deletes a folder and all its contents
  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => {
      const idsToDelete = new Set<string>([id]);
      
      // Find all nested children to delete
      let currentSize = 0;
      while (idsToDelete.size > currentSize) {
        currentSize = idsToDelete.size;
        prev.forEach((node) => {
          if (node.parentId && idsToDelete.has(node.parentId)) {
            idsToDelete.add(node.id);
          }
        });
      }

      // Filter out any nodes whose IDs are in our deletion set
      return prev.filter((node) => !idsToDelete.has(node.id));
    });
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setNodes((prev) => prev.map((node) => (node.id === id && node.type === 'text' ? { ...node, content } : node)));
  }, []);

  const getChildren = useCallback((parentId: string) => {
    return nodes.filter((node) => node.parentId === parentId);
  }, [nodes]);

  const getNode = useCallback((id: string) => {
    return nodes.find((node) => node.id === id);
  }, [nodes]);

  // Build breadcrumbs for a given folder id
  const getBreadcrumbs = useCallback((id: string) => {
    const breadcrumbs: FileSystemNode[] = [];
    let currentId: string | null = id;

    while (currentId) {
      const node = nodes.find((n) => n.id === currentId);
      if (node) {
        breadcrumbs.unshift(node);
        currentId = node.parentId;
      } else {
        break;
      }
    }
    return breadcrumbs;
  }, [nodes]);

  return {
    nodes,
    createNode,
    renameNode,
    deleteNode,
    updateFileContent,
    getChildren,
    getNode,
    getBreadcrumbs,
    isLoaded
  };
};

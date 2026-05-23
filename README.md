# Mini File Explorer 📁

A fully responsive, hierarchical file manager built with **React**, **TypeScript**, and **Tailwind CSS**. This application mimics a basic desktop file explorer, allowing users to create, rename, and delete files and folders using a clean, modern UI.


## 🌐 Live Demo
**[Click here to view the live application](https://mini-file-explorer-three.vercel.app/)**

---

## ✨ Features

* **Hierarchical Structure:** Manage deeply nested folders and files just like a real file system.
* **Core Operations:**
  * 📁 **Create:** Add new folders or text files inside any directory.
  * ✏️ **Rename:** Easily update the names of your files and folders.
  * 🗑️ **Delete:** Remove folders and files. Deleting a folder recursively deletes all of its contents.
* **Text Editor:** Click on any text file to open an integrated editor. Type, edit, and save your content directly in the browser!
* **Responsive Design:** 
  * Desktop: Split-pane view with a persistent sidebar.
  * Mobile: Collapsible drawer sidebar with touch-friendly menus and a full-screen text editor.
* **State Persistence:** All your files and folders are saved locally using the Browser's `localStorage` so you never lose your data upon refreshing.

---

## 🛠️ Tech Stack

* **Framework:** React 19 (via Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **State Management:** Custom React Hooks (`useFileSystem`) + LocalStorage

---

## 🚀 Running Locally

If you want to run this project on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anamikagain559/Mini-File-Explorer.git
   cd mini-file-explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the application running.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── explorer/     # FolderTree, FileEditor components
│   ├── layout/       # Sidebar, MainPanel wrappers
│   └── shared/       # Reusable UI like Modals
├── hooks/            
│   └── useFileSystem.ts # Core logic & LocalStorage persistence
├── pages/
│   └── ExplorerPage.tsx # Main smart container component
└── types/            # TypeScript interfaces
```



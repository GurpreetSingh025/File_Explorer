import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSidebar = createAsyncThunk(
  'sidebar/fetchSidebar',
  async () => {
    const res = await fetch("data/data.json");
    const json = await res.json();
    return json;
  }
);

function findFolderById(items, id) {
  for (const item of items) {
    if (item.type === "folder") {
      if (item.id === id) return item;
      const found = findFolderById(item.items, id);
      if (found) return found;
    }
  }
  return null;
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    data: [],
    selectedFile: null
  },
  reducers: {
    addFile(state, action) {
      const { folderId, name } = action.payload;
      const folder = findFolderById(state.data, folderId);
      if (folder) {
        const newId = Date.now();
        folder.items.push({
          id: newId,
          name,
          type: 'file',
          content: `This is ${name}`
        });
      }
    },

    addFolder(state, action) {
      const { name, parentId } = action.payload;
      const newFolder = {
        id: Date.now(),
        name,
        type: 'folder',
        items: []
      };

      if (parentId) {
        const parent = findFolderById(state.data, parentId);
        if (parent) {
          parent.items.push(newFolder);
        } else {
          console.warn("Parent folder not found for id:", parentId);
        }
      } else {
        state.data.push(newFolder);
      }
    },

    deleteFile(state, action) {
      const { folderId, fileId } = action.payload;
      const folder = findFolderById(state.data, folderId);
      if (folder) {
        folder.items = folder.items.filter(item => item.id !== fileId);
      }
    },

    deleteFolder(state, action) {
      const { folderId } = action.payload;

      const recursiveDelete = (items) => {
        return items.filter(item => {
          if (item.type === 'folder') {
            item.items = recursiveDelete(item.items);
            return item.id !== folderId;
          }
          return item.type === 'file' || item.id !== folderId;
        });
      };

      state.data = recursiveDelete(state.data);
    },

    renameFile(state, action) {
      const { folderId, fileId, newName } = action.payload;
      const folder = findFolderById(state.data, folderId);
      if (folder) {
        const file = folder.items.find(i => i.id === fileId && i.type === 'file');
        if (file) file.name = newName;
      }
    },

    renameFolder(state, action) {
      const { folderId, newName } = action.payload;
      const folder = findFolderById(state.data, folderId);
      if (folder) folder.name = newName;
    },

    setSelectedFile(state, action) {
      state.selectedFile = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSidebar.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  }
});

export const {
  addFile,
  addFolder,
  deleteFile,
  deleteFolder,
  renameFile,
  renameFolder,
  setSelectedFile // ✅ correctly exported
} = sidebarSlice.actions;

export default sidebarSlice.reducer;

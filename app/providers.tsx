"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { AuthContextProvider } from "@/contexts/authContext";
import { toast, ToastContainer } from "react-toastify";
import HomeContext from "@/contexts/homeContext";
import { HomeInitialState, initialState } from "@/contexts/homeContext/state";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import { FolderInterface, FolderType } from "@/types/folder";
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where, DocumentData, DocumentReference, serverTimestamp } from "firebase/firestore";
import { Prompt } from "@/types/prompt";
import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';
import PromptbarContext from '@/components/Common/PromptBar/PromptBar.context';
import { PromptbarInitialState, initialState as initialStateOfPromptbar } from '@/components/Common/PromptBar/PromptBar.state';

export function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });
  const { user } = useAuth();
  const {
    state: {
      folders,
      prompts,
    },
    dispatch: homeDispatch,
  } = contextValue;

  const promptBarContextValue = useCreateReducer<PromptbarInitialState>({
    initialState: initialStateOfPromptbar,
  });


  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;

  const handleCreateFolder = async (name: string, type: FolderType) => {
    if (user) {
      console.log("Hello")
      let docId = uuidv4();
      const newFolder: FolderInterface = {
        id: docId,
        name,
        type,
      };
      const updatedFolders = [...folders, newFolder];
      homeDispatch({ field: 'folders', value: updatedFolders });
      await addDoc(
        collection(db, 'history', user?.email, 'folders'), {
        id: docId,
        name,
        type
      }
      )
    }
    else {
      toast.warning("Please Signin to add prompt folder.");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (user) {
      const updatedFolders = folders.filter((f) => f.id !== folderId);
      homeDispatch({ field: 'folders', value: updatedFolders });
      const updatedPrompts: Prompt[] = prompts.map((p) => {
        if (p.folderId === folderId) {
          return {
            ...p,
            folderId: null,
          };
        }
        return p;
      });
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      const q = query(collection(db, "history", user?.email!, "folders"), where("id", "==", folderId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc: any) => {
        await deleteDoc(doc.ref);
      });
    }
    else {
      toast.warning("Please Signin to delete prompt folder.");
    }
  };

  const handleUpdateFolder = async (folderId: string, name: string) => {
    if (user) {
      const updatedFolders = folders.map((f) => {
        if (f.id === folderId) {
          return {
            ...f,
            name,
          };
        }
        return f;
      });
      homeDispatch({ field: 'folders', value: updatedFolders });
      const q = query(collection(db, "history", user?.email!, "folders"), where("id", "==", folderId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc: any) => {
        await updateDoc(doc.ref, { name });
      });
    }
    else {
      toast.warning("Please Signin to update prompt folder.");
    }
  };

  const handleCreatePrompt = async () => {
    if (user) {
      let docId = uuidv4();
      const newPrompt: Prompt = {
        id: docId,
        name: `Prompt ${prompts.length + 1}`,
        description: '',
        content: '',
        folderId: null,
      };
      const updatedPrompts = [...prompts, newPrompt];
      homeDispatch({ field: 'prompts', value: updatedPrompts });

      await addDoc(
        collection(db, 'history', user?.email, 'prompts'), {
        id: docId,
        name: `Prompt ${prompts.length + 1}`,
        description: '',
        content: '',
        folderId: null,
        createdAt: serverTimestamp()
      }
      )
    }
    else {
      toast.warning("Please sign in to create prompt.");
    }
  };

  const handleDeletePrompt = async (prompt: Prompt) => {
    if (user) {
      const updatedPrompts = prompts.filter((p) => p.id !== prompt.id);

      homeDispatch({ field: 'prompts', value: updatedPrompts });

      const chatsRef = collection(db, 'history', user?.email, 'prompts');
      const q = query(chatsRef, where("id", "==", prompt.id));
      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          return;
        }
        querySnapshot.forEach(async (doc: { ref: DocumentReference<unknown, DocumentData>; }) => {
          await deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
    else {
      toast.warning("Please sign in to delete prompt.");
    }
  };

  const handleUpdatePrompt = (prompt: Prompt) => {
    if (user) {
      const updatedPrompts = prompts.map((p) => {
        if (p.id === prompt.id) {
          return prompt;
        }
        return p;
      });
      homeDispatch({ field: 'prompts', value: updatedPrompts });
    }
    else {
      toast.warning("Please sign in to update prompt.");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: prompts.filter((prompt) => {
          const searchable =
            prompt.name.toLowerCase() +
            ' ' +
            prompt.description.toLowerCase() +
            ' ' +
            prompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredPrompts', value: prompts });
    }
  }, [searchTerm, prompts]);

  return (
    <HomeContext.Provider value={{
      ...contextValue,
      handleCreateFolder,
      handleDeleteFolder,
      handleUpdateFolder,
    }}>
      <PromptbarContext.Provider
        value={{
          ...promptBarContextValue,
          handleCreatePrompt,
          handleDeletePrompt,
          handleUpdatePrompt,
        }}
      >
        <AuthContextProvider>
          {children}
          < ToastContainer
            position="top-center"
            autoClose={2000}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            hideProgressBar={true}
            draggable={true}
          />
        </AuthContextProvider >
      </PromptbarContext.Provider>
    </HomeContext.Provider >
  );
}
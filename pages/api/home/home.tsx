import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import useErrorService from '@/services/errorService';
import useApiService from '@/services/useApiService';

import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '@/utils/app/clean';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/utils/app/conversation';
import { saveFolders } from '@/utils/app/folders';
import { savePrompts } from '@/utils/app/prompts';
import { getSettings } from '@/utils/app/settings';

import { Conversation } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { FolderInterface, FolderType } from '@/types/folder';
import { OpenAIModelID, OpenAIModels, fallbackModelID } from '@/types/openai';
import { LibraryPrompt, Prompt } from '@/types/prompt';

import { Chat } from '@/components/chat/Chat';
import { Chatbar } from '@/components/Chatbar/Chatbar';
import { Navbar } from '@/components/Mobile/Navbar';
import Promptbar from '@/components/Promptbar';

import HomeContext from './home.context';
import { HomeInitialState, initialState } from './home.state';

import { v4 as uuidv4 } from 'uuid';

import { useAuth } from '@/context/authContext';
import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Spinner from '@/components/Spinner';

interface Props {
  serverSideApiKeyIsSet: boolean;
  serverSidePluginKeysSet: boolean;
  defaultModelId: OpenAIModelID;
}

const Home = ({
  serverSideApiKeyIsSet,
  serverSidePluginKeysSet,
  defaultModelId,
}: Props) => {
  const { t } = useTranslation('chat');
  const { getModels } = useApiService();
  const { getModelsError } = useErrorService();
  const [initialRender, setInitialRender] = useState<boolean>(true);

  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });

  const {
    state: {
      apiKey,
      lightMode,
      folders,
      conversations,
      selectedConversation,
      prompts,
      temperature,
      isNameDialogOpen
    },
    dispatch,
  } = contextValue;
  const { user } = useAuth();

  const stopConversationRef = useRef<boolean>(false);

  const { data, error, refetch } = useQuery(
    ['GetModels', apiKey, serverSideApiKeyIsSet],
    ({ signal }) => {
      if (!apiKey && !serverSideApiKeyIsSet) return null;

      return getModels(
        {
          key: apiKey,
        },
        signal,
      );
    },
    { enabled: true, refetchOnMount: false },
  );

  useEffect(() => {
    if (data) dispatch({ field: 'models', value: data });
  }, [data, dispatch]);

  useEffect(() => {
    dispatch({ field: 'modelError', value: getModelsError(error) });
  }, [dispatch, error, getModelsError]);

  // FETCH MODELS ----------------------------------------------

  const handleSelectConversation = (conversation: Conversation) => {
    dispatch({
      field: 'selectedConversation',
      value: conversation,
    });

    saveConversation(conversation);

    if (user) {
      const fetchConversationData = async () => {
        const chatsRef = collection(db, "users", user?.email, "chats");

        try {
          const rowQuery = query(chatsRef, where("row", "==", conversation.id));
          const querySnapshot = await getDocs(rowQuery);

          if (querySnapshot.empty) {
            console.log("No matching documents found");
            return;
          }
          const conversations = querySnapshot.docs.map(doc => ({
            ...doc.data()
          }));

          dispatch({ field: 'selectedConversation', value: conversations[0] });
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
        }
      };
      fetchConversationData();
    }
  };

  // FOLDER OPERATIONS  --------------------------------------------

  const handleCreateFolder = async (name: string, type: FolderType) => {
    let docId = uuidv4();

    const newFolder: FolderInterface = {
      id: docId,
      name,
      type,
    };

    const updatedFolders = [...folders, newFolder];

    dispatch({ field: 'folders', value: updatedFolders });
    saveFolders(updatedFolders);

    if (user) {
      await addDoc(
        collection(db, 'history', user?.email, 'folders'), {
        id: docId,
        name,
        type
      }
      )
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    dispatch({ field: 'folders', value: updatedFolders });
    saveFolders(updatedFolders);

    const updatedConversations: Conversation[] = conversations.map((c) => {
      if (c.folderId === folderId) {
        return {
          ...c,
          folderId: null,
        };
      }

      return c;
    });

    dispatch({ field: 'conversations', value: updatedConversations });
    saveConversations(updatedConversations);

    const updatedPrompts: Prompt[] = prompts.map((p) => {
      if (p.folderId === folderId) {
        return {
          ...p,
          folderId: null,
        };
      }

      return p;
    });

    dispatch({ field: 'prompts', value: updatedPrompts });
    savePrompts(updatedPrompts);

    if (user) {
      const q = query(collection(db, "history", user?.email!, "folders"), where("id", "==", folderId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc: any) => {
        await deleteDoc(doc.ref);
      });
    }
  };

  const handleUpdateFolder = async (folderId: string, name: string) => {
    const updatedFolders = folders.map((f) => {
      if (f.id === folderId) {
        return {
          ...f,
          name,
        };
      }

      return f;
    });

    dispatch({ field: 'folders', value: updatedFolders });

    saveFolders(updatedFolders);

    if (user) {
      const q = query(collection(db, "history", user?.email!, "folders"), where("id", "==", folderId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc: any) => {
        await updateDoc(doc.ref, { name });
      });
    }
  };

  // CONVERSATION OPERATIONS  --------------------------------------------

  const handleNewConversation = async () => {
    const lastConversation = conversations[conversations.length - 1];

    let docId = uuidv4();
    const newConversation: Conversation = {
      id: docId,
      name: 'New Conversation',
      messages: [],
      model: lastConversation?.model || {
        id: OpenAIModels[defaultModelId].id,
        name: OpenAIModels[defaultModelId].name,
        maxLength: OpenAIModels[defaultModelId].maxLength,
        tokenLimit: OpenAIModels[defaultModelId].tokenLimit,
      },
      prompt: DEFAULT_SYSTEM_PROMPT,
      temperature: lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
      folderId: null,
    };

    const updatedConversations = [...conversations, newConversation];

    dispatch({ field: 'selectedConversation', value: newConversation });
    dispatch({ field: 'conversations', value: updatedConversations });

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    dispatch({ field: 'loading', value: false });

    if (user) {
      await addDoc(
        collection(db, 'history', user?.email!, 'chats'), {
        id: docId,
        name: t('New Conversation'),
        messages: [],
        model: lastConversation?.model || {
          id: OpenAIModels[defaultModelId].id,
          name: OpenAIModels[defaultModelId].name,
          maxLength: OpenAIModels[defaultModelId].maxLength,
          tokenLimit: OpenAIModels[defaultModelId].tokenLimit,
        },
        prompt: DEFAULT_SYSTEM_PROMPT,
        temperature: lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
        folderId: null,
        createdAt: serverTimestamp()
      }
      )
    }
  };

  const handleUpdateConversation = async (
    conversation: Conversation,
    data: KeyValuePair,
  ) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value,
    };

    const { single, all } = updateConversation(
      updatedConversation,
      conversations,
    );

    dispatch({ field: 'selectedConversation', value: single });
    dispatch({ field: 'conversations', value: all });

    if (user) {
      const q = query(collection(db, "history", user?.email!, "chats"), where("id", "==", conversation.id));
      try {
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
          await updateDoc(doc.ref, { folderId: data.value });
        }
      } catch (error) {
        console.error("Failed to update documents:", error);
      }
    }
  };

  // EFFECTS  --------------------------------------------

  useEffect(() => {
    if (window.innerWidth < 640) {
      dispatch({ field: 'showChatbar', value: false });
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        try {
          const querySnapshot = await getDocs(q);
          if (querySnapshot.empty) {
            dispatch({ field: "isNameDialogOpen", value: true })
          }
        }
        catch (error) {
          let message = (error as Error).message;
          console.log(message);
        }
      }
      fetchData();
    }
  }, [user])

  useEffect(() => {
    defaultModelId &&
      dispatch({ field: 'defaultModelId', value: defaultModelId });
    serverSideApiKeyIsSet &&
      dispatch({
        field: 'serverSideApiKeyIsSet',
        value: serverSideApiKeyIsSet,
      });
    serverSidePluginKeysSet &&
      dispatch({
        field: 'serverSidePluginKeysSet',
        value: serverSidePluginKeysSet,
      });
  }, [defaultModelId, serverSideApiKeyIsSet, serverSidePluginKeysSet]);

  // ON LOAD --------------------------------------------

  useEffect(() => {
    if (user) {
      // Fetch Conversation Data
      const fetchConversationData = async () => {
        if (user) {
          const chatsRef = collection(db, "history", user?.email, "chats");

          try {
            const querySnapshot = await getDocs(chatsRef);
            const conversations = querySnapshot.docs.map(doc => ({
              ...doc.data()
            }));

            dispatch({ field: 'conversations', value: conversations });
            localStorage.setItem('conversationHistory', JSON.stringify(conversations));
          } catch (error) {
            console.error("Failed to fetch conversations:", error);
          }
        }
      }
      fetchConversationData();

      // Fetch Folders Data 
      const fetchFolderData = async () => {
        if (user) {
          const foldersRef = collection(db, "history", user?.email, "folders");

          try {
            const querySnapshot = await getDocs(foldersRef);
            const folders = querySnapshot.docs.map(doc => ({
              ...doc.data()
            }));

            localStorage.setItem('folders', JSON.stringify(folders));
          } catch (error) {
            console.error("Failed to fetch conversations:", error);
          }
        }
      }
      fetchFolderData();

      // Fetch Prompts Data
      const fetchPromptsData = async () => {
        if (user) {
          const promptssRef = collection(db, "history", user?.email, "prompts");
          try {
            const querySnapshot = await getDocs(promptssRef);
            const prompts = querySnapshot.docs.map(doc => ({
              ...doc.data()
            }));
            dispatch({ field: 'prompts', value: prompts });
            localStorage.setItem('prompts', JSON.stringify(prompts));
          } catch (error) {
            console.error("Failed to fetch prompts:", error);
          }
        }
      }
      fetchPromptsData();
    }

    const settings = getSettings();
    if (settings.theme) {
      dispatch({
        field: 'lightMode',
        value: settings.theme,
      });
    }

    const apiKey = localStorage.getItem('apiKey');

    if (serverSideApiKeyIsSet) {
      dispatch({ field: 'apiKey', value: '' });

      localStorage.removeItem('apiKey');
    } else if (apiKey) {
      dispatch({ field: 'apiKey', value: apiKey });
    }

    const pluginKeys = localStorage.getItem('pluginKeys');
    if (serverSidePluginKeysSet) {
      dispatch({ field: 'pluginKeys', value: [] });
      localStorage.removeItem('pluginKeys');
    } else if (pluginKeys) {
      dispatch({ field: 'pluginKeys', value: pluginKeys });
    }

    if (window.innerWidth < 640) {
      dispatch({ field: 'showChatbar', value: false });
      dispatch({ field: 'showPromptbar', value: false });
    }

    const showChatbar = localStorage.getItem('showChatbar');
    if (showChatbar) {
      dispatch({ field: 'showChatbar', value: showChatbar === 'true' });
    }

    const showPromptbar = localStorage.getItem('showPromptbar');
    if (showPromptbar) {
      dispatch({ field: 'showPromptbar', value: showPromptbar === 'true' });
    }

    const prompts = localStorage.getItem('prompts');

    const folders = localStorage.getItem('folders');
    const defaultFolderId = 'default-prompts-folder'
    const localFolders: FolderInterface[] = folders ? JSON.parse(folders) : []
    if (localFolders.findIndex(item => item.id === defaultFolderId) === -1) {
      const defaultPromptFolder = {
        id: defaultFolderId,
        name: 'Prompt Library',
        type: 'prompt'
      }

      dispatch({ field: 'folders', value: [defaultPromptFolder, ...localFolders] })
      fetch('/api/prompts').then(resp => resp.json()).then(async (data) => {
        const commonPrompts = await data.map((item: { id: number, name: string, content: string }) => (
          {
            id: item.id,
            name: item.name,
            description: '',
            content: item.content,
            model: OpenAIModels[defaultModelId],
            folderId: defaultFolderId
          }
        ))

        const libraryPromptsTemp = data.map((item: { id: number, name: string, content: string }) => (
          {
            id: item.id,
            label: item.name,
            value: item.content
          }
        ))

        dispatch({ field: "libraryPrompts", value: libraryPromptsTemp })
        if (prompts) {
          dispatch({ field: 'prompts', value: [...commonPrompts, ...JSON.parse(prompts)] })
        } else {
          dispatch({
            field: 'prompts', value: commonPrompts
          })
          console.log(data)
        }
      })
    } else {
      prompts && dispatch({ field: 'prompts', value: JSON.parse(prompts) })
    }


    const conversationHistory = localStorage.getItem('conversationHistory');
    if (conversationHistory) {
      const parsedConversationHistory: Conversation[] =
        JSON.parse(conversationHistory);
      const cleanedConversationHistory = cleanConversationHistory(
        parsedConversationHistory,
      );

      dispatch({ field: 'conversations', value: cleanedConversationHistory });
    }

    const selectedConversation = localStorage.getItem('selectedConversation');
    if (selectedConversation) {
      const parsedSelectedConversation: Conversation =
        JSON.parse(selectedConversation);
      const cleanedSelectedConversation = cleanSelectedConversation(
        parsedSelectedConversation,
      );

      dispatch({
        field: 'selectedConversation',
        value: cleanedSelectedConversation,
      });
    } else {
      const lastConversation = conversations[conversations.length - 1];
      dispatch({
        field: 'selectedConversation',
        value: {
          id: uuidv4(),
          name: 'New Conversation',
          messages: [],
          folderId: null,
        },
      });
    }
  }, [
    defaultModelId,
    dispatch,
    serverSideApiKeyIsSet,
    serverSidePluginKeysSet,
    user
  ]);

  return (
    <HomeContext.Provider
      value={{
        ...contextValue,
        handleNewConversation,
        handleCreateFolder,
        handleDeleteFolder,
        handleUpdateFolder,
        handleSelectConversation,
        handleUpdateConversation,
      }}
    >
      <Head>
        <title>Search.co</title>
        <meta name="description" content="ChatGPT but better." />
        <meta
          name="viewport"
          content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/assets/images/logo.png" />
      </Head>
      {selectedConversation && (
        <main
          className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white ${lightMode}`}
        >
          <ToastContainer
            position="top-center"
            hideProgressBar={true}
            autoClose={2000}
            theme={lightMode}
          />
          <div className="fixed top-0 w-full sm:hidden">
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          <div className="flex h-full w-full pt-[48px] sm:pt-0">
            <Chatbar />

            <div className="flex flex-1">
              <Chat stopConversationRef={stopConversationRef} />
            </div>

            <Promptbar />
          </div>
        </main>
      )}
    </HomeContext.Provider>
  );
};
export default Home;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const defaultModelId =
    (process.env.DEFAULT_MODEL &&
      Object.values(OpenAIModelID).includes(
        process.env.DEFAULT_MODEL as OpenAIModelID,
      ) &&
      process.env.DEFAULT_MODEL) ||
    fallbackModelID;

  let serverSidePluginKeysSet = false;

  const googleApiKey = process.env.GOOGLE_API_KEY;
  const googleCSEId = process.env.GOOGLE_CSE_ID;

  if (googleApiKey && googleCSEId) {
    serverSidePluginKeysSet = true;
  }

  return {
    props: {
      serverSideApiKeyIsSet: !!process.env.OPENAI_API_KEY,
      defaultModelId,
      serverSidePluginKeysSet,
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'chat',
        'sidebar',
        'markdown',
        'promptbar',
        'settings',
      ])),
    },
  };
};


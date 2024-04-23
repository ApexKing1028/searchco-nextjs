import { Conversation, Message } from '@/types/chat';
import { ErrorMessage } from '@/types/error';
import { FolderInterface } from '@/types/folder';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import { PluginKey } from '@/types/plugin';
import { LibraryPrompt, Prompt, SharedModalPrompt } from '@/types/prompt';

export interface HomeInitialState {
  apiKey: string;
  pluginKeys: PluginKey[];
  loading: boolean;
  lightMode: 'light' | 'dark';
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  models: OpenAIModel[];
  folders: FolderInterface[];
  conversations: Conversation[];
  selectedConversation: Conversation | undefined;
  currentMessage: Message | undefined;
  prompts: Prompt[];
  temperature: number;
  showChatbar: boolean;
  showPromptbar: boolean;
  currentFolder: FolderInterface | undefined;
  messageError: boolean;
  searchTerm: string;
  defaultModelId: OpenAIModelID | undefined;
  serverSideApiKeyIsSet: boolean;
  serverSidePluginKeysSet: boolean;
  libraryPrompts: LibraryPrompt[];
  promptMessage: string;
  isNameDialogOpen: boolean;
  sharedPrompt: SharedModalPrompt | undefined;
  isSharedPromptDialogOpen: boolean;
  isOpenaiKeyDialogOpen: boolean;
  isPplxKeyDialogOpen: boolean;
  isGeminiKeyDialogOpen: boolean;
  isKeysDialogOpen: boolean;
}

export const initialState: HomeInitialState = {
  apiKey: '',
  loading: false,
  pluginKeys: [],
  lightMode: 'dark',
  messageIsStreaming: false,
  modelError: null,
  models: [],
  folders: [],
  conversations: [],
  selectedConversation: undefined,
  currentMessage: undefined,
  prompts: [],
  temperature: 1,
  showPromptbar: true,
  showChatbar: true,
  currentFolder: undefined,
  messageError: false,
  searchTerm: '',
  defaultModelId: undefined,
  serverSideApiKeyIsSet: false,
  serverSidePluginKeysSet: false,
  libraryPrompts: [],
  promptMessage: "",
  isNameDialogOpen: false,
  sharedPrompt: undefined,
  isSharedPromptDialogOpen: false,
  isOpenaiKeyDialogOpen: false,
  isPplxKeyDialogOpen: false,
  isGeminiKeyDialogOpen: false,
  isKeysDialogOpen: false
};

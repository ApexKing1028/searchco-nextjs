import { FolderInterface } from "@/types/folder";
import { LibraryPrompt, Prompt, SharedModalPrompt } from "@/types/prompt";

export interface HomeInitialState {
    isFullScreen: boolean;
    prompts: Prompt[];
    showPromptbar: boolean;
    promptMessage: string,
    isSharedPromptDialogOpen: boolean;
    sharedPrompt: SharedModalPrompt | undefined;
    folders: FolderInterface[];
    libraryPrompts: LibraryPrompt[];
    isUseridDialogOpen: boolean;
    prompt: string;
    isPromptLibraryDialogOpen: boolean;
    isSharedPromptViewDialogOpen: boolean;
    isPromptDialogOpen: boolean;
    promptData: Prompt;
    historyRows: any;
};

export const initialState: HomeInitialState = {
    isFullScreen: false,
    prompts: [],
    showPromptbar: true,
    promptMessage: "",
    isSharedPromptDialogOpen: false,
    sharedPrompt: undefined,
    folders: [],
    libraryPrompts: [],
    isUseridDialogOpen: false,
    prompt: "",
    isPromptLibraryDialogOpen: false,
    isSharedPromptViewDialogOpen: false,
    isPromptDialogOpen: false,
    promptData: null,
    historyRows: []
};
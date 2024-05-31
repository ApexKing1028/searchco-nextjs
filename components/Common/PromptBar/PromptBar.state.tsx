import { Prompt } from '@/types/prompt';

export interface PromptbarInitialState {
    searchTerm: string;
    filteredPrompts: Prompt[];
    promptModalData: Prompt;
}

export const initialState: PromptbarInitialState = {
    searchTerm: '',
    filteredPrompts: [],
    promptModalData: null
};

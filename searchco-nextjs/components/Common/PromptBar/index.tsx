import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/config/firebase';

import { Prompt } from '@/types/prompt';

import HomeContext from '@/contexts/homeContext';
import PromptbarContext from './PromptBar.context';

import { PromptFolders } from '@/components/Common/PromptBar/components/PromptFolders';
import { PromptbarSettings } from '@/components/Common/PromptBar/components/PromptbarSettings';
import { Prompts } from '@/components/Common/PromptBar/components/Prompts';
import Sidebar from './Sidebar';

const ChatBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const {
        state: { searchTerm, filteredPrompts },
        handleUpdatePrompt,
        handleCreatePrompt,
        dispatch: promptDispatch
    } = useContext(PromptbarContext);

    useEffect(() => {
        const clickHandler = ({ target }: any) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({ keyCode }: any) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    const {
        state: { prompts, showPromptbar },
        dispatch: homeDispatch,
        handleCreateFolder,
    } = useContext(HomeContext);

    const handleDrop = (e: any) => {
        if (e.dataTransfer) {
            const prompt = JSON.parse(e.dataTransfer.getData('prompt'));
            const updatedPrompt = {
                ...prompt,
                folderId: e.target.dataset.folderId,
            };
            handleUpdatePrompt(updatedPrompt);
            e.target.style.background = 'none';
        }
    };

    return (
        <>

            <div className={`fixed inset-0 bg-slate-900 bg-opacity-60 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
            <div className='border-[#374151] lg:hidden sticky top-0 z-30 dark:text-white'>
                <div className="flex items-center justify-between pt-4 pb-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}
                        className='inline-flex items-center justify-center p-1 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900'
                    >
                        {sidebarOpen ?
                            <svg className="block h-6 w-6 bg-transparent text-darkText1 opa-anim" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            :
                            <svg className="block h-6 w-6 text-darkText1 opa-anim" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        }
                    </button>
                </div>
            </div>

            <div id="sidebar" ref={sidebar}
                className={`bg-[#202123] dark:bg-[#2b3444] absolute z-40 right-0 top-0 lg:static lg:right-auto lg:top-auto h-full overflow-y-auto 
                w-[260px] ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 
                    transform transition-all ease-in-out duration-500 sidebar-scrollbar
                `}>
                <div className='flex flex-col h-full'>
                    <div className='flex-1'>
                        <Sidebar<Prompt>
                            side={'right'}
                            isOpen={showPromptbar}
                            addItemButtonTitle='New prompt'
                            itemComponent={
                                <Prompts
                                    prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
                                />
                            }
                            folderComponent={<PromptFolders />}
                            items={filteredPrompts}
                            searchTerm={searchTerm}
                            handleSearchTerm={(searchTerm: string) =>
                                promptDispatch({ field: 'searchTerm', value: searchTerm })
                            }
                            handleCreateItem={handleCreatePrompt}
                            handleCreateFolder={() => handleCreateFolder('New folder', 'prompt')}
                            handleDrop={handleDrop}
                            footerComponent={<PromptbarSettings />}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatBar

import { FC, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { Prompt, SharedModalPrompt } from '@/types/prompt';
import { addDoc, collection, DocumentData, DocumentReference, getDocs, query, updateDoc, where, doc } from 'firebase/firestore';
import HomeContext from '@/pages/api/home/home.context';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const SharedPromptViewDialog: FC<Props> = ({ open, onClose }) => {
    const [prompt, setPrompt] = useState<SharedModalPrompt | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);

    const {
        state: {
            sharedPrompt,
        },
        dispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        if (sharedPrompt) {
            setPrompt(sharedPrompt);
        }
    }, [sharedPrompt])

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                window.addEventListener('mouseup', handleMouseUp);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            window.removeEventListener('mouseup', handleMouseUp);
            onClose();
        };

        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [onClose]);

    const handleUse = () => {
        dispatch({ field: "promptMessage", value: prompt?.content });
        dispatch({ field: "isSharedPromptDialogOpen", value: false })
    }

    return (<>
        {open && <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div className="fixed inset-0 z-10 overflow-hidden">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div
                        className="hidden sm:inline-block sm:h-screen sm:align-middle"
                        aria-hidden="true"
                    />

                    <div
                        ref={modalRef}
                        className="dark:border-netural-400 inline-block max-h-[8s00px] transform overflow-y-auto rounded-lg border border-gray-700 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[700px] w-full sm:max-w-lg sm:p-6 sm:align-middle"
                        role="dialog"
                    >
                        <div className="text-sm font-bold text-black dark:text-neutral-200">
                            Name
                        </div>
                        <input
                            className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                            disabled
                            value={prompt?.name}
                        />

                        <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
                            Description
                        </div>
                        <textarea
                            className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                            style={{ resize: 'none' }}
                            disabled
                            value={prompt?.description}
                            rows={3}
                        />

                        <div className="mt-6 text-sm font-bold text-black dark:text-neutral-200">
                            Prompt
                        </div>
                        <textarea
                            className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                            style={{ resize: 'none' }}
                            disabled
                            value={prompt?.content}
                            rows={10}
                        />

                        <button
                            type="button"
                            className="mt-3 w-full rounded-[10px] flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                            onClick={handleUse}
                        >
                            <span className='font-bold text-[20px]'> Use </span>
                        </button>
                    </div>
                </div>
            </div>
        </div >}
    </>
    );
};


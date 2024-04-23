import { useContext, useEffect, useRef, useState, FC } from 'react';
import { Oval } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import { IconSettings } from '@tabler/icons-react';
import { db } from '@/utils/firebase';
import { collection, DocumentData, DocumentReference, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { useAuth } from '@/context/authContext';
import HomeContext from '@/pages/api/home/home.context';

interface ProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

export const KeysDialog: FC<ProfileDialogProps> = ({ open, onClose }) => {
    const [pplxKey, setPplxKey] = useState<string>("");
    const [openaiKey, setOpenaiKey] = useState<string>("");
    const [geminiKey, setGeminiKey] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();

    const {
        dispatch
    } = useContext(HomeContext);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const q = query(collection(db, "users"), where("email", "==", user.email));
                try {
                    const querySnapshot = await getDocs(q);

                    for (const doc of querySnapshot.docs) {
                        let dt = doc.data();
                        setPplxKey(dt.pplxKey);
                        setOpenaiKey(dt.openaiKey);
                        setGeminiKey(dt.geminiKey);
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

    const handleSaveKeys = async () => {
        setIsSaving(true);

        const q = query(collection(db, "users"), where("email", "==", user.email));
        try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc: { ref: DocumentReference<unknown, DocumentData>; }) => {
                await updateDoc(doc.ref, { pplxKey, openaiKey, geminiKey });
            });
            toast.success("Keys are saved successfully.")
        }
        catch (error) {
            let message = (error as Error).message;
            console.log(message);
        }

        setIsSaving(false);
    }

    if (!open) {
        return <></>;
    }

    return (
        <>
            <div
                className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className="fixed inset-0 z-10 overflow-hidden">
                    <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="hidden sm:inline-block sm:h-screen sm:align-middle"
                            aria-hidden="true"
                        />

                        <div
                            ref={modalRef}
                            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-700  bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] w-full sm:max-w-lg sm:p-6 sm:align-middle"
                            role="dialog"
                        >
                            <div className="text-3xl font-bold text-black dark:text-white">Keys</div>

                            <div className='w-full flex mt-[10px] text-black dark:text-neutral-200 font-bold'>Openai Key</div>
                            <div className='flex gap-2'>
                                <input
                                    className="mt-1 w-[85%] rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                                    placeholder="Openai Key"
                                    value={openaiKey}
                                    disabled
                                />
                                <button
                                    type="button"
                                    className="mt-1 w-[15%] rounded-[10px] flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                                    onClick={() => { dispatch({ field: "isOpenaiKeyDialogOpen", value: true }); dispatch({ field: "isKeysDialogOpen", value: false }); }}
                                >
                                    <span className='font-bold text-[20px]'><IconSettings size={18} /></span>
                                </button>
                            </div>

                            <div className='w-full flex mt-[10px] text-black dark:text-neutral-200 font-bold'>Perplexity Key</div>
                            <div className='flex gap-2'>
                                <input
                                    className="mt-1 w-[85%] rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                                    placeholder="Perplexity Key"
                                    value={pplxKey}
                                    disabled
                                />
                                <button
                                    type="button"
                                    className="mt-1 w-[15%] rounded-[10px] flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                                    onClick={() => { dispatch({ field: "isPplxKeyDialogOpen", value: true }); dispatch({ field: "isKeysDialogOpen", value: false }); }}
                                >
                                    <span className='font-bold text-[20px]'><IconSettings size={18} /></span>
                                </button>
                            </div>

                            <div className='w-full flex mt-[10px] text-black dark:text-neutral-200 font-bold'>Google Gemini Key</div>
                            <div className='flex gap-2'>
                                <input
                                    className="mt-1 w-[85%] rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                                    placeholder="Google Gemini Key"
                                    value={geminiKey}
                                    disabled
                                />
                                <button
                                    type="button"
                                    className="mt-1 w-[15%] rounded-[10px] flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                                    onClick={() => { dispatch({ field: "isGeminiKeyDialogOpen", value: true }); dispatch({ field: "isKeysDialogOpen", value: false }); }}
                                >
                                    <span className='font-bold text-[20px]'><IconSettings size={18} /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
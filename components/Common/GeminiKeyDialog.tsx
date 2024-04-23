import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { db } from '@/utils/firebase';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/authContext';
import HomeContext from '@/pages/api/home/home.context';
import { Oval } from 'react-loader-spinner'

interface OpenaiKeyDialogProps {
    open: boolean;
    onClose: () => void;
}

export const GeminiKeyDialog: FC<OpenaiKeyDialogProps> = ({ open, onClose }) => {
    const [key, setKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();

    const {
        dispatch,
    } = useContext(HomeContext);

    const handleSaveProfileInformation = async () => {
        if (key?.length <= 0) {
            toast.warn("Please input google gemini key.");
            return;
        }
        try {
            setIsSaving(true);
            const q = query(collection(db, "users"), where("email", "==", user.email));
            try {
                const querySnapshot = await getDocs(q);

                for (const doc of querySnapshot.docs) {
                    await updateDoc(doc.ref, { geminiKey: key });
                }
                toast.success("Your google gemini key was saved successfully.")
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        } catch (error) {
            console.error(error);
        }
        setIsSaving(false);
    }

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

    return (
        <>
            {open && (
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
                                <div className="text-3xl font-bold text-black dark:text-neutral-200">Google Gemini Key Adding</div>

                                <input
                                    className="mt-6 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                                    placeholder="Please input google gemini key here."
                                    value={key}
                                    onChange={e => setKey(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="mt-3 w-full rounded-[10px] flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                                    onClick={handleSaveProfileInformation}
                                >
                                    {isSaving && <Oval
                                        visible={true}
                                        height="20"
                                        width="30"
                                        color="#4fa94d"
                                        ariaLabel="oval-loading"
                                        wrapperStyle={{}}
                                        wrapperClass=""
                                    />}
                                    <span className='font-bold text-[20px]'> {isSaving ? "Saving" : "Save"} </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
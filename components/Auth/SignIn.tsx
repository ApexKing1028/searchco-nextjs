import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { IconLogin } from '@tabler/icons-react';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { SidebarButton } from '@/components/Sidebar/SidebarButton';

import { auth, db } from '@/utils/firebase';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '@/context/authContext';
import HomeContext from '@/pages/api/home/home.context';

const provider = new GoogleAuthProvider();

export const SignIn = () => {
    const [showDialog, setShowDialog] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const {
        dispatch,
    } = useContext(HomeContext);

    const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setShowDialog(false);
        }
    };

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                window.addEventListener('mouseup', handleMouseUp);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            window.removeEventListener('mouseup', handleMouseUp);
            setShowDialog(false);
        };

        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const q = query(collection(db, "users"), where("email", "==", user.email));
            try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    dispatch({ field: "isNameDialogOpen", value: true });
                }
            }
            catch (error) {
                let message = (error as Error).message;
                console.log(message);
            }
        } catch (error) {
            console.error(error);
        }
        setShowDialog(false);
    }

    return (
        <>
            <SidebarButton
                text="Sign In"
                icon={<IconLogin size={18} />}
                onClick={() => setShowDialog(true)}
            />

            {showDialog && (
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
                                <div className="mb-10 text-3xl font-bold mb-[70px] text-black dark:text-white">Sign In</div>

                                <button
                                    type="button"
                                    className="mt-6 w-full rounded-full flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                                    onClick={signInWithGoogle}
                                >
                                    <Image src="/assets/images/google.png" alt="Description of Image" width={30} height={30} />
                                    <span className='font-bold text-[20px]'> Continue with Google </span>
                                </button>

                                <div className='w-full flex justify-center mt-[40px] text-black dark:text-white font-bold'>Please click this button to Sigin in.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

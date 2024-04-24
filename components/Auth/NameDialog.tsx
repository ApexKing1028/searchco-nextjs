import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { db } from '@/utils/firebase';
import { addDoc, collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/authContext';
import HomeContext from '@/pages/api/home/home.context';
import { Oval } from 'react-loader-spinner'

interface NameDialogProps {
    open: boolean;
    onClose: () => void;
}

export const NameDialog: FC<NameDialogProps> = ({ open, onClose }) => {
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();

    const {
        dispatch,
    } = useContext(HomeContext);

    const handleSaveProfileInformation = async () => {
        if (name?.length < 4) {
            toast.warn("Please input the name longer than 3 letters.");
            return;
        }
        try {
            setIsSaving(true);
            const q = query(collection(db, "users"), where("name", "==", name));
            try {
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    addDoc(collection(db, 'users'),
                        {
                            email: user.email,
                            name,
                            openaiKey: "",
                            pplxKey: "",
                            geminiKey: "",
                            openaiCredit: 10,
                            pplxCredit: 10,
                            geminiCredit: 10,
                            role: "user",
                        });

                    dispatch({ field: "isNameDialogOpen", value: false });
                    setUser({
                        uid: user.uid,
                        email: user.email,
                        name,
                        role: "user"
                    })
                    toast.success("profile was created successfully.")
                }
                else {
                    toast.warn("The name already exits. Please input the other name.");
                    setName("");
                }
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
                                <div className="text-3xl font-bold text-black dark:text-neutral-200">Profile Completion</div>

                                <div className='w-full flex mt-[40px] font-bold'>Please input your uniquer profile name here.</div>
                                <input
                                    className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
                                    placeholder="Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="mt-3 w-full rounded-full flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
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
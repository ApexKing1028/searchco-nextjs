import { KeyboardEvent, useContext, useEffect, useRef, useState, FC } from 'react';
import { Oval } from 'react-loader-spinner'
import { toast } from 'react-toastify';
import { IconDownload } from '@tabler/icons-react';

import { db } from '@/utils/firebase';
import { collection, DocumentData, DocumentReference, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { useAuth } from '@/context/authContext';

interface UserDashboardDialogProps {
    open: boolean;
    onClose: () => void;
}

type User = {
    email: string;
    name: string;
}

export const UserDashboardDialog: FC<UserDashboardDialogProps> = ({ open, onClose }) => {
    const [name, setName] = useState("");
    const [isUpading, setIsUpdating] = useState(false);
    const [usersInfo, setUsersInfo] = useState<User[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                const querySnapshot = await getDocs(collection(db, "users"));
                const data = querySnapshot.docs.map(doc => {
                    const dt = doc.data();
                    return {
                        email: dt.email,
                        name: dt.name
                    }
                });
                setUsersInfo(data);
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

    if (!open) {
        return <></>;
    }

    const convertToCSV = (arr: string[]) => {
        const array = [arr];
        const csvContent = array.map(e => e.join(",")).join("\n");
        return csvContent;
    };

    const handleDownload = () => {
        const emails = usersInfo.map(user => user.email);

        const csvData = convertToCSV(emails);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'emails.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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


                            <div className='w-full flex justify-between items-center'>
                                <div className="text-3xl font-bold text-black dark:text-white">Users Dashboard</div>
                                {user?.role === "admin" && <button
                                    type="button"
                                    className="rounded-full flex justify-center items-center gap-2 border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#343541] dark:text-white"
                                    onClick={handleDownload}
                                >
                                    <IconDownload size={18} />
                                </button>}
                            </div>
                            <div className='mt-[20px]'>
                                <table className='bg-gray-100 text-black border-[#000000] dark:text-white dark:border-[#FFFFFF] dark:bg-gray-700 rounded-[8px] w-full'>
                                    <thead>
                                        <tr>
                                            <th className='text-left py-2 px-4'>No</th>
                                            {user?.role === "admin" && <th className='text-left py-2 px-4'>Email</th>}
                                            <th className='text-left py-2 px-4'>Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersInfo?.map((item, index) => (
                                            <tr key={index} className="cursor-pointer dark:border-[#FFFFFF] hover:bg-gray-200 dark:hover:bg-gray-600" >
                                                <td className="py-2 px-4">{index + 1}</td>
                                                {user?.role === "admin" && <td className="py-2 px-4">{item.email}</td>}
                                                <td className="py-2 px-4">{item.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
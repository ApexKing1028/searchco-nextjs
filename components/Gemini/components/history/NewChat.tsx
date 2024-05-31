import React, { MouseEventHandler, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/authContext';
import { db } from '@/config/firebase';
import HomeContext from '@/contexts/homeContext';

type Props = {
    onNewChat: (e: React.MouseEventHandler<HTMLButtonElement | HTMLButtonElement>) => any
};

const NewChat: React.FC<Props> = ({ onNewChat }) => {
    const router = useRouter()
    const { user } = useAuth();

    const {
        dispatch
    } = useContext(HomeContext);


    const createNewChat = async (e: any) => {
        const doc = await addDoc(
            collection(db, 'history', user?.email!, 'gemini'), {
            userId: user?.email!,
            createdAt: serverTimestamp()
        }
        )

        onNewChat(e)
        dispatch({ field: "prompt", value: "" })

        router.push(`/gemini/chat/${doc.id}`)
    }

    return (
        <>
            <div onClick={createNewChat} className='text-black dark:text-white border dark:border-gray-700 chatRow hover:bg-gray-500/10 '>
                <PlusIcon className='h-4 w-4' />
                <p>New Search</p>
            </div>
        </>
    );
}

export default NewChat;
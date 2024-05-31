'use client'

import { db } from '@/config/firebase';
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuth } from '@/contexts/authContext';

type Props = {
    id: string,
    onClickChat: MouseEventHandler<HTMLAnchorElement>
};

const ChatRow: React.FC<Props> = ({ id, onClickChat }) => {
    const [active, setActive] = useState(false)
    const { user } = useAuth();
    const pathname = usePathname()
    const router = useRouter()

    const [data] = useCollection(
        user && query(
            collection(db, 'history', user?.email!, 'perplexity', id, 'messages'),
            orderBy('createdAt', 'asc')
        )
    )

    useEffect(() => {
        if (!pathname) return

        setActive(pathname.includes(id))
    }, [pathname])

    const removeChat = async () => {
        await deleteDoc(doc(db, 'history', user?.email!, 'perplexity', id))
        // @ts-ignored
        onClickChat()
        router.replace('/perplexity')
    }

    return (
        <>
            <Link href={`/chatgpt/chat/${id}`} onClick={onClickChat} className={`chatRow justify-center hover:bg-gray-500/10 ${active && 'bg-gray-500/10 dark:bg-gray-700/50'}`}>
                <ChatBubbleLeftIcon className='h-5 w-5' />
                <p className='flex-1 truncate'>
                    {data?.docs.length && data?.docs[data.docs.length - 1]?.data().content || 'New Search'}
                </p>
                <TrashIcon onClick={removeChat} className='h-5 w-5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-100' />
            </Link>
        </>
    );
}

export default ChatRow;
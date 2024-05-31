"use client"
import {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { throttle } from '@/utils/data/throttle';

import { useChat } from 'ai/react';
import HomeContext from '@/contexts/homeContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/authContext';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/config/firebase';

const options = {
    api: "/api/gemini/chat"
};

const MainBar = () => {
    const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat(options);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
    const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useAuth();
    const router = useRouter();

    const {
        state: {
            prompt
        },
        dispatch
    } = useContext(HomeContext);

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
                chatContainerRef.current;
            const bottomTolerance = 30;

            if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
                setAutoScrollEnabled(false);
                setShowScrollDownButton(true);
            } else {
                setAutoScrollEnabled(true);
                setShowScrollDownButton(false);
            }
        }
    };

    const handleScrollDown = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    const scrollDown = () => {
        if (autoScrollEnabled) {
            messagesEndRef.current?.scrollIntoView(true);
        }
    };
    const throttledScrollDown = throttle(scrollDown, 250);
    useEffect(() => {
        throttledScrollDown();
    }, [throttledScrollDown]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setAutoScrollEnabled(entry.isIntersecting);
                if (entry.isIntersecting) {
                    textareaRef.current?.focus();
                }
            },
            {
                root: null,
                threshold: 0.5,
            },
        );
        const messagesEndElement = messagesEndRef.current;
        if (messagesEndElement) {
            observer.observe(messagesEndElement);
        }
        return () => {
            if (messagesEndElement) {
                observer.unobserve(messagesEndElement);
            }
        };
    }, [messagesEndRef]);

    const createNewChat = async (e: any) => {
        const doc = await addDoc(
            collection(db, 'history', user?.email!, 'gemini'), {
            userId: user?.email!,
            createdAt: serverTimestamp()
        }
        )
        dispatch({ field: "prompt", value: "" })
        router.push(`/gemini/chat/${doc.id}`)
    }

    return (
        <div className='flex flex-1'>
            <div className='flex flex-col justify-center items-center w-full'>
                <div className='mb-[30px]'>
                    <svg className="w-16 h-16 text-gray-800 dark:text-white w-16 h-16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8.737 8.737a21.49 21.49 0 0 1 3.308-2.724m0 0c3.063-2.026 5.99-2.641 7.331-1.3 1.827 1.828.026 6.591-4.023 10.64-4.049 4.049-8.812 5.85-10.64 4.023-1.33-1.33-.736-4.218 1.249-7.253m6.083-6.11c-3.063-2.026-5.99-2.641-7.331-1.3-1.827 1.828-.026 6.591 4.023 10.64m3.308-9.34a21.497 21.497 0 0 1 3.308 2.724m2.775 3.386c1.985 3.035 2.579 5.923 1.248 7.253-1.336 1.337-4.245.732-7.295-1.275M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                    </svg>
                </div>
                <div onClick={createNewChat} className='border-gray-700 border chatRow rounded-full w-[300px]'>
                    <PlusIcon className='h-4 w-4' />
                    <p>New Search</p>
                </div>
            </div>
        </div>
    );
};

export default MainBar;
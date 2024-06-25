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
    api: "/api/perplexity/chat"
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
            collection(db, 'history', user?.email!, 'v'), {
            userId: user?.email!,
            createdAt: serverTimestamp()
        }
        )
        dispatch({ field: "prompt", value: "" })
        router.push(`/perplexity/chat/${doc.id}`)
    }

    return (
        <div className='flex flex-1'>
            <div className='flex flex-col justify-center items-center w-full'>
                <div className='mb-[30px]'>
                    <svg className="w-16 h-16 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
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
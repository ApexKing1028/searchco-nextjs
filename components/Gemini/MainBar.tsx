"use client"
import {
    MutableRefObject,
    memo,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { throttle } from '@/utils/data/throttle';

import { ChatInput } from './ChatInput';
import { Message, useChat } from 'ai/react';
import { ChatMessage } from './ChatMessage';
import HomeContext from '@/contexts/homeContext';
import { addDoc, collection, doc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/authContext';

const options = {
    api: "/api/gemini/chat"
};

type MainBarProps = {
    chatId: string
}

const MainBar = ({ chatId }: MainBarProps) => {
    const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat(options);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
    const [showScrollDownButton, setShowScrollDownButton] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useAuth();


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

    const {
        state: {
            prompt
        },
    } = useContext(HomeContext);

    useEffect(() => {
        if (!isLoading && user) {
            const addChatMessage = async () => {
                const lastTwoMessages = messages.slice(-2);
                const messagesCollectionRef = collection(db, 'history', user?.email!, 'gemini', chatId, 'messages');

                for (const message of lastTwoMessages) {
                    await addDoc(messagesCollectionRef, message);
                }
            }
            addChatMessage();
        }
    }, [isLoading])

    useEffect(() => {
        if (user) {
            const fetchMessageData = async () => {
                const messagesCollectionRef = collection(db, 'history', user?.email!, 'gemini', chatId, 'messages');
                const q = query(messagesCollectionRef, orderBy('createdAt', 'asc')); // or 'desc' for descending

                try {
                    const querySnapshot = await getDocs(q);
                    const allMessages = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: data.id,
                            content: data.content,
                            role: data.role
                        } as Message;
                    });
                    setMessages(allMessages);
                } catch (error) {
                    console.error("Error getting documents: ", error);
                }
            };
            fetchMessageData();
        }
    }, [user])

    return (
        <div className='flex flex-1'>
            <div
                className="max-h-full overflow-x-hidden chat-scrollbar flex-1"
                ref={chatContainerRef}
                onScroll={handleScroll}
            >
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        messageIndex={index}
                        onEdit={(editedMessage) => {

                        }}
                    />
                ))}
                <div
                    className="h-[162px]"
                    ref={messagesEndRef}
                />
            </div>
            <ChatInput
                length={messages?.length || 0}
                isLoading={isLoading}
                textareaRef={textareaRef}
                input={input}
                handleInputChange={handleInputChange}
                messages={messages}
                onScrollDownClick={handleScrollDown}
                handleSubmit={handleSubmit}
                showScrollDownButton={showScrollDownButton}
                chatId={chatId}
                promptMessage={prompt}
            />
        </div>
    );
};

export default MainBar;
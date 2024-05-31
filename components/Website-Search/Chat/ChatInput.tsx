import {
    IconArrowDown,
    IconPlayerStop,
    IconSend,
} from '@tabler/icons-react';
import {
    KeyboardEvent,
    MutableRefObject,
    use,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Input } from '@/components/google-search/ui/input';
import { Button } from '@/components/google-search/ui/button';
import HomeContext from '@/contexts/homeContext';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Props {
    input: string;
    handleInputChange: any;
    handleSubmit: any;
    onScrollDownClick: () => void;
    textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
    showScrollDownButton: boolean;
    length: number;
    isLoading: boolean;
    messages: any;
    promptMessage: string;
}

export const ChatInput = ({
    input,
    handleInputChange,
    handleSubmit,
    onScrollDownClick,
    textareaRef,
    showScrollDownButton,
    length,
    isLoading,
    promptMessage = "",
}: Props) => {
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isModelSelectOpen, setIsModelSelectOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('GPT-3.5');
    const dropdownRef = useRef(null);
    const { theme } = useTheme();
    const {
        state: {
            isFullScreen,
        },
        dispatch: homeDispatch
    } = useContext(HomeContext);

    const toggleModelDropdown = () => {
        setIsModelSelectOpen(!isModelSelectOpen);
    };

    const handleItemClick = (item) => {
        setSelectedModel(item);
        setIsModelSelectOpen(false);
    };

    const isMobile = () => {
        const userAgent =
            typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
        const mobileRegex =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        return mobileRegex.test(userAgent);
    };

    const handleKeyDown = (e: KeyboardEvent<any>) => {
        if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
            handleSubmit(e, {
                data: {
                    model: selectedModel
                }
            });
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsModelSelectOpen(false);
        }
    };

    useEffect(() => {
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
            textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
                }`;
        }
    }, [input]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (promptMessage) {
            handleInputChange(promptMessage)
        }
    }, [promptMessage])

    return (
        length ? (
            <div className="custom-scrollbar absolute bottom-[70px] sm:bottom-[50px] left-0 w-full border-transparent md:pt-2">
                <div
                    className="h-[162px] fixed w-full bg-[] dark:bg-[#1d2430] bottom-[0px]"
                />
                <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
                    <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#282c32] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4">
                        <div className="absolute left-[10px] top-[-30px] rounded">
                            {isLoading && <svg
                                className="animate-spin h-5 w-5 mr-3 text-gray-800 dark:text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                                ></path>
                            </svg>}
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="custom-scrollbar m-0 w-full resize-none border-0 bg-transparent p-0 pr-8 pl-4 text-black dark:bg-transparent dark:text-white py-3 focus:outline-none"
                            style={{
                                resize: 'none',
                                bottom: `${textareaRef?.current?.scrollHeight}px`,
                                maxHeight: '400px',
                                overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? 'auto' : 'hidden'}`,
                            }}
                            placeholder="Ask me anything."
                            value={input}
                            rows={1}
                            onCompositionStart={() => setIsTyping(true)}
                            onCompositionEnd={() => setIsTyping(false)}
                            onChange={e => handleInputChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            className="absolute right-2 top-2 sm:top-3 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
                            onClick={e => handleSubmit(e, {
                                data: {
                                    model: selectedModel
                                }
                            })}
                        >
                            <IconSend size={20} />
                        </button>

                        {showScrollDownButton && (
                            <div className="absolute bottom-12 right-0 lg:bottom-0 lg:-right-10">
                                <button
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
                                    onClick={onScrollDownClick}
                                >
                                    <IconArrowDown size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div
                className={`fixed bottom-8 left-0 right-0 mx-auto h-screen flex flex-col items-center justify-center ${isFullScreen ? "left-0" : "sm:left-64 top-[-10]"}`}
            >
                <div className='mb-[30px]'>
                    <svg className="w-16 h-16 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <div className="max-w-2xl w-full px-6">
                    <div className="relative flex items-center w-full">
                        <Input
                            type="text"
                            name="input"
                            placeholder="Ask me anything."
                            value={input}
                            onChange={e => handleInputChange(e.target.value)}
                            className="pl-4 pr-10 h-12 bg-muted dark:bg-[#282c32] focus:outline-non rounded-full text-[18px]"
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            type="submit"
                            size={'icon'}
                            variant={'ghost'}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            disabled={input.length === 0}
                            onClick={handleSubmit}
                        >
                            <ArrowRight size={20} />
                        </Button>
                    </div>
                </div>

            </div >
        )
    );
};


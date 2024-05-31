import React, { useContext, useEffect, useRef, useState } from 'react';
import NewChat from './components/history/NewChat';
import { useAuth } from '@/contexts/authContext';
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/config/firebase';
import ChatRow from './components/history/ChatRow';
import { Oval } from 'react-loader-spinner';

const ChatBar = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const [data, loading, error] = useCollection(
        user && query(
            collection(db, 'history', user?.email!, 'gemini'),
            orderBy('createdAt', 'asc')
        )
    )

    useEffect(() => {
        const clickHandler = ({ target }: any) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({ keyCode }: any) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <>
            <div className={`fixed inset-0 bg-slate-900 bg-opacity-60 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
            <div className='border-[#374151] lg:hidden sticky top-0 z-30 dark:text-white'>
                <div className="flex items-center justify-between pt-4 pb-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}
                        className='inline-flex items-center justify-center p-1 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900'
                    >
                        {sidebarOpen ?
                            <svg className="block h-6 w-6 bg-transparent text-darkText1 opa-anim" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            :
                            <svg className="block h-6 w-6 text-darkText1 opa-anim" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        }
                    </button>
                </div>
            </div>

            <div id="sidebar" ref={sidebar}
                className={`bg-[#f8f8f8] dark:bg-[#2b3444] border dark:border-none absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto h-full overflow-y-auto 
                    w-[17rem] xl:w-[19rem] 2xl::w-[20rem] ${sidebarOpen ? 'translate-x-0' : '-translate-x-[20rem]'} lg:translate-x-0 
                    transform transition-all ease-in-out duration-500 sidebar-scrollbar
                `}>
                <div className='p-2 flex flex-col h-full'>
                    <div className='flex-1'>
                        <div>
                            <NewChat onNewChat={() => setSidebarOpen(false)} />

                            <div className='space-y-2 mt-[10px]'>
                                {loading &&
                                    <div className='animate-pulse text-center text-white flex justify-center mt-[30px]'>
                                        <Oval
                                            visible={true}
                                            height="40"
                                            width="40"
                                            color="#4A6CF7"
                                            secondaryColor='#3C56C0'
                                            ariaLabel="oval-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                        />
                                    </div>
                                }
                                {data?.docs.map(item =>
                                    <ChatRow id={item.id} key={item.id} onClickChat={() => setSidebarOpen(false)} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatBar

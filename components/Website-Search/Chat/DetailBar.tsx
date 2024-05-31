import React, { useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { Oval } from 'react-loader-spinner';

type DetailBarProps = {
    assistantId: string;
}

type Detail = {
    name: string;
    description: string;
}

const DetailBar = ({ assistantId }: DetailBarProps) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [detail, setDetail] = useState<Detail>();
    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const q = query(collection(db, "website-search"), where("assistantId", "==", assistantId));

            try {
                const querySnapshot = await getDocs(q);
                querySnapshot.docs.map(doc => {
                    const dt = doc.data();
                    setDetail({
                        name: dt.name,
                        description: dt.description,
                    })
                    setLoading(false);
                });
            } catch (error) {
                console.error("Failed to fetch documents: ", error);
            }
        }

        fetchData();
    }, [])

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
                        <div className='text-black dark:text-white border dark:border-gray-700 chatRow hover:bg-gray-500/10'
                            onClick={() => router.push("/file-search")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            <p>Main Page</p>
                        </div>
                        {
                            loading ? 
                            <div className='w-full flex justify-center mt-[15px]'>
                            <Oval
                                visible={true}
                                height="20"
                                width="20"
                                color="#4A6CF7"
                                secondaryColor='#3C56C0'
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div> :
                        <>
                            <div className='text-black mt-[10px] dark:text-white border dark:border-gray-700 chatRow hover:bg-gray-500/10 '>
                                {detail?.name}
                            </div>

                            <div className='text-black mt-[10px] dark:text-white border dark:border-gray-700 description hover:bg-gray-500/10 '>
                                {detail?.description ? detail?.description : <div className='w-full text-center'>No Description</div>}
                            </div>
                        </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailBar

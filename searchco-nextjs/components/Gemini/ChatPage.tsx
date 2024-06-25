"use client";

import HomeContext from '@/contexts/homeContext';
import React, { useContext, useEffect } from 'react'
import MainBar from './MainBar';
import PromptBar from '@/components/Common/PromptBar';
import HistoryBar from './HistoryBar';

type PageProps = {
    id: string;
}

const Page = ({ id }: PageProps) => {
    const {
        state: {
            isFullScreen
        },
        dispatch
    } = useContext(HomeContext);

    return (
        <div className="relative flex-1 overflow-hidden bg-[#f8f8f8] dark:bg-[#1d2430] flex" style={{ height: isFullScreen ? "calc(100vh - 0px)" : "calc(100vh - 79px)" }}>
            <HistoryBar />
            <MainBar chatId={id} />
            <PromptBar />
        </div>
    )
}

export default Page

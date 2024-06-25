"use client";

import HomeContext from '@/contexts/homeContext';
import React, { useContext, useEffect } from 'react'
import MainBar from './MainBar';
import DetailBar from './DetailBar';
import PromptBar from '@/components/Common/PromptBar';

import { assistantId } from '@/app/assistant/assistant-config';

type PageProps = {
    assistantId: string
}

const Page = ({ assistantId }: PageProps) => {
    const {
        state: {
            isFullScreen
        },  
        dispatch
    } = useContext(HomeContext);

    useEffect(() => {
        dispatch({ field: "prompt", value: "" })
    }, [])

    return (
        <div className="relative flex-1 overflow-hidden bg-[#f8f8f8] dark:bg-[#1d2430] flex" style={{ height: isFullScreen ? "calc(100vh - 0px)" : "calc(100vh - 79px)" }}>
            <DetailBar assistantId={assistantId} />
            <MainBar assistantId={assistantId}  />
            <PromptBar />
        </div>
    )
}

export default Page

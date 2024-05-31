"use client";

import HomeContext from '@/contexts/homeContext';
import React, { useContext, useEffect } from 'react'
import FirstMainBar from './FirstMainBar';
import PromptBar from '@/components/Common/PromptBar';
import HistoryBar from './HistoryBar';

const index = () => {
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
            <HistoryBar />
            <FirstMainBar />
            <PromptBar />
        </div>
    )
}

export default index

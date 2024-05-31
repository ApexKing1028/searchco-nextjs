import React from 'react'
import { Metadata } from "next";

import ChatPage from '@/components/Chatgpt/ChatPage';


export interface PageProps {
    params: {
        id: string
    }
}

export const metadata: Metadata = {
    title: "Search.co | Page Skeleton Page",
    description: "This is Page Skeleton Page for Search.co",
};


const Page = ({ params }: PageProps) => {
    return (
        <ChatPage id={params.id} />
    )
}

export default Page


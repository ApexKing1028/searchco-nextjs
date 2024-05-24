import { Chat } from '@/components/google-search/chat'
import { nanoid } from 'ai'
import { AI } from '@/app/actions'
import { Sidebar } from '@/components/google-search/sidebar'
import { useContext } from 'react'
import HomeContext from '@/contexts/homeContext'

export const runtime = 'edge'

export default function GoogleSearchPage() {
    const id = nanoid()
    return (
        <>
            <AI initialAIState={{ chatId: id, messages: [] }}>
                <Chat id={id} />
            </AI>
            {/* <Sidebar /> */}
        </>
    )
}

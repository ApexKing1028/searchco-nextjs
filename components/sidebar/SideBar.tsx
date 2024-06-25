'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'
import {
  Code,
  FileBadge,
  MessageSquare,
  Settings,
  BotIcon,
  DatabaseIcon,
  PercentCircleIcon,
  KeyIcon,
  LucideWebcam,
  InfoIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const monsterrat = Montserrat({
  weight: '600',
  subsets: ['latin'],
})

const routes = [
  {
    label: 'Dashboard',
    icon: MessageSquare,
    href: '/dashboard',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'ChatGPT',
    icon: MessageSquare,
    href: '/chatgpt',
    color: 'text-[#4A6CF7]',
    auth: false
  },
  {
    label: 'Gemini',
    icon: MessageSquare,
    href: '/gemini',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'Perplexity',
    icon: MessageSquare,
    href: '/perplexity',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'Web Search',
    icon: MessageSquare,
    href: '/web-search',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'AI Assistants',
    icon: MessageSquare,
    href: '/assistants',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'Crawlers',
    icon: MessageSquare,
    href: '/crawlers',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'Files',
    icon: MessageSquare,
    href: '/files',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'About',
    icon: MessageSquare,
    href: '/about',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'Pricing',
    icon: MessageSquare,
    href: '/pricing',
    color: 'text-[#4A6CF7]',
    auth: false
  },
  {
    label: 'Settings',
    icon: MessageSquare,
    href: '/dashboard/settings',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'Sign In',
    icon: MessageSquare,
    href: '/login',
    color: 'text-[#4A6CF7]',
    auth: true
  },
  {
    label: 'Sign Out',
    icon: MessageSquare,
    href: '/signout',
    color: 'text-[#4A6CF7]',
    auth: true
  }
]

const SideBar = () => {
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true);
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#fbfbfb] dark:bg-[#111827] text-black dark:text-white">
      <div className="px-3 py-1 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-4">
          <div className="relative mr-4">
            <Image
              src="/images/logo/logo-white.png"
              alt="logo"
              width={140}
              height={30}
              className="w-full dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/images/logo/logo-dark.png"
              alt="logo"
              width={140}
              height={30}
              className="hidden w-full dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map(route => (
            <Link
              href=""
              key={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start rounded-md font-bold cursor-pointer hover:text-black dark:hover:text-white hover:bg-[#f4f4f5] dark:hover:bg-white/10',
                pathname === route.href && 'bg-white/10'
              )}
            >
              <div className="flex items-center flex-1 text-[16px] justify-between">
                <span className='flex'>
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                  {route.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* <FreeCounter isPro={isPro} apiLimitCount={apiLimitCount} /> */}
    </div>
  )
}

export default SideBar
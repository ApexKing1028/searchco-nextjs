'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SideBar from './SideBar'
import useClient from '@/hooks/useClient'

const MobileSideBar = () => {
  const { isMounted } = useClient()

  if (!isMounted) return null

  return (
    <Sheet>
      <SheetTrigger>
        <div className="hover:bg-accent hover:text-accent-foreground md:hidden p-2 rounded-md">
          <div>
            <Menu />
          </div>
        </div>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-[300px]">
        <SideBar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSideBar

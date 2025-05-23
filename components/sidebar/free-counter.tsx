'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MAX_FREE_COUNTS } from '@/config/credit'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import { userProModal } from '@/hooks/user-pro-modal'

interface FreeCounterProps {
  apiLimitCount: number
  isPro: boolean
  isAuth: boolean
}

const FreeCounter = ({
  apiLimitCount = 0,
  isPro = false,
  isAuth = false
}: FreeCounterProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const { onOpen } = userProModal()

  useEffect(() => setIsMounted(true), [])

  if (!isAuth) return null

  if (!isMounted) return null

  if (isPro) return null

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
            />
          </div>
          <Button className="w-full" variant="default" onClick={() => onOpen()}>
            Upgrade
            <Zap className="w-4 hh-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default FreeCounter

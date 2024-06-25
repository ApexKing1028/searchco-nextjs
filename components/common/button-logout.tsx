"use client"

import { useCallback, useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { IconLoadingSpinner } from "@/components/common/icon-loading-spinner"


export function ButtonLogout({ className }: React.ComponentProps<"button">) {
  const [loading, setLoading] = useState(false)

  const handleSignOut = useCallback(async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: `${window.location.origin}/login` })
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Button
      className="outline-none"
      variant="outline"
      onClick={() => handleSignOut()}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <IconLoadingSpinner size="xs" aria-hidden="true" />
      ) : (
        <span>Sign Out</span>
      )}
    </Button>
  )
}

"use client"

import Link from "next/link"
import { User } from "next-auth"
import { signOut } from "next-auth/react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/common/user-avatar"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
    user: Pick<User & { uniqueName: string }, "name" | "image" | "email" | "uniqueName">
}

export function UserAccountNav({ user }: UserAccountNavProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={{ name: user.name || null, image: user.image || null }}
                    className="h-8 w-8"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user?.uniqueName && <p className="text-sm">@{user?.uniqueName}</p>}
                        {user.email && (
                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/assistants">Assistants</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/crawlers">Crawlers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/files">Files</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/users">Users</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event: { preventDefault: () => void }) => {
                        event.preventDefault()
                        signOut({
                            callbackUrl: `${window.location.origin}/login`,
                        })
                    }}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
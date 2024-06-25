import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session"
import { notFound } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface LayoutProps {
    children?: React.ReactNode
}

export default async function Layout({
    children,
}: LayoutProps) {
    const user = await getCurrentUser();

    if (!user) {
        return notFound();
    }

    const uniqueName = user.uniqueName;

    return (
        <div className="p-4" >
            {children}
        </div>
    )
}
import LandingLayout from "@/components/layout/landing-layout"

interface LayoutProps {
    children?: React.ReactNode
}

export default async function Layout({
    children,
}: LayoutProps) {
    return (
        <div className="p-4">
            {children}
        </div>
    )
}
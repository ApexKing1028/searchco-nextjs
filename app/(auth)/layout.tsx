import LandingLayout from "@/components/layout/landing-layout"

interface DashboardLayoutProps {
    children?: React.ReactNode
}

export default async function Layout({
    children,
}: DashboardLayoutProps) {
    return (
        <LandingLayout>
        <>
            {children}
        </>
        </LandingLayout>
    )
}
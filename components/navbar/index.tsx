import MobileSideBar from '@/components/sidebar/MobileSideBar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import HeaderNav from "./header-nav"


const NavBar = async () => {
    const apiLimitCount = await getApiLimitCount()
    const isPro = await checkSubscription()

    return (
        <div className="flex items-center p-4">
            <MobileSideBar />

            <div className="flex w-full justify-end">
                {/* <ModeToggle />   */}
                <HeaderNav />   
            </div>
        </div>
    )
}

export default NavBar

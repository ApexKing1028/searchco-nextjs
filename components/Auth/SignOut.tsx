import { IconLogout } from '@tabler/icons-react';
import { SidebarButton } from '@/components/Sidebar/SidebarButton';
import { signOut } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { useAuth } from '@/context/authContext';
export const SignOut = () => {
    const { user, logout } = useAuth();
    const name = user?.name ? " (" + user?.name + ")" : "";
    return (
        <>
            <SidebarButton
                text={"Sign Out" + name}
                icon={<IconLogout size={18} />}
                onClick={() => signOut(auth)}
            />
        </>
    );
};

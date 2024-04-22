import { IconUserCircle, IconBook, IconBooks, IconUsers } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import HomeContext from '@/pages/api/home/home.context';

import { PromptLibraryDialog } from '@/components/Promptbar/components/PromptLibaryDialog';
import { UserDashboardDialog } from "@/components/Common/UserDashboardDialog";

import { SidebarButton } from '../../Sidebar/SidebarButton';
import { useAuth } from '@/context/authContext';
import { SharedPromptDialog } from './SharedPromptDialog';
import { SharedPromptViewDialog } from './SharedPromptViewDialog';


export const PromptbarSettings = () => {
  const [isPromptLibraryDialogOpen, setIsPromptLibraryDialogOpen] = useState<boolean>(false);
  const [isUserDashboardDialogOpen, setIsUserDashboardDialogOpen] = useState<boolean>(false);
  const [isSharedPromptsDialogOpen, setIsSharedPromptsDialogOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const {
    state: {
      isSharedPromptDialogOpen
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {/* Users Dashboard */}
      {user && <SidebarButton
        text="Users Dashboard"
        icon={<IconUsers size={18} />}
        onClick={() => setIsUserDashboardDialogOpen(true)}
      />}

      <UserDashboardDialog
        open={isUserDashboardDialogOpen}
        onClose={() => {
          setIsUserDashboardDialogOpen(false);
        }}
      />

      {/* Shared Prompts */}
      {user && <SidebarButton
        text="Shared Prompts"
        icon={<IconBooks size={18} />}
        onClick={() => setIsSharedPromptsDialogOpen(true)}
      />}

      <SharedPromptDialog
        open={isSharedPromptsDialogOpen}
        onClose={() => {
          setIsSharedPromptsDialogOpen(false);
        }}
      />

      {/* Prompt Library */}
      <SidebarButton
        text="Prompt Library"
        icon={<IconBook size={18} />}
        onClick={() => setIsPromptLibraryDialogOpen(true)}
      />

      <PromptLibraryDialog
        open={isPromptLibraryDialogOpen}
        onClose={() => {
          setIsPromptLibraryDialogOpen(false);
        }}
      />

      <SharedPromptViewDialog
        open={isSharedPromptDialogOpen}
        onClose={() => {
          homeDispatch({ field: "isSharedPromptDialogOpen", value: false });
        }}
      />
    </div>
  );
};

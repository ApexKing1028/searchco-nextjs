import { IconBook, IconBooks } from '@tabler/icons-react';
import { useContext } from 'react';
import HomeContext from '@/contexts/homeContext';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { useAuth } from '@/contexts/authContext';

export const PromptbarSettings = () => {
  const { user } = useAuth();

  const {
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  return (
    <div className="flex flex-col items-center space-y-1 border-t dark:border-gray-700 pt-1 text-sm">
      {user && <SidebarButton
        text="Shared Prompts"
        icon={<IconBooks size={18} />}
        onClick={() => homeDispatch({ field: "isSharedPromptDialogOpen", value: true })}
      />}

      <SidebarButton
        text="Prompt Library"
        icon={<IconBook size={18} />}
        onClick={() => homeDispatch({ field: "isPromptLibraryDialogOpen", value: true })}
      />
    </div>
  );
};

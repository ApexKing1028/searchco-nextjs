import { IconZoomMoney, IconSettings, IconKey, IconUserCircle } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { Import } from '../../Settings/Import';
import { Key } from '../../Settings/Key';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';
import { SignIn } from '@/components/Auth/SignIn';

import { useAuth } from '@/context/authContext';
import { SignOut } from '@/components/Auth/SignOut';
import { NameDialog } from "@/components/Auth/NameDialog"
import { ProfileDialog } from "@/components/Auth/ProfileDialog"
import { PricingDialog } from "@/components/Auth/PricingDialog"
import { KeysDialog } from "@/components/Chatbar/components/KeysDialog"
import { OpenaiKeyDialog } from '@/components/Common/OpenaiKeyDialog';
import { PplxKeyDialog } from '@/components/Common/PplxKeyDialog';
import { GeminiKeyDialog } from '@/components/Common/GeminiKeyDialog';

export const ChatbarSettings = () => {
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);
  const [isProfileDialogOpen, setIsProfileDialog] = useState<boolean>(false);
  const [isPricingDialogOpen, setIsPricingDialog] = useState<boolean>(false);
  const { user } = useAuth();

  const {
    state: {
      lightMode,
      serverSideApiKeyIsSet,
      serverSidePluginKeysSet,
      conversations,
      isNameDialogOpen,
      isKeysDialogOpen,
      isOpenaiKeyDialogOpen,
      isPplxKeyDialogOpen,
      isGeminiKeyDialogOpen
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

      {/* Pricing Setting */}
      {user && <SidebarButton
        text="Pricing"
        icon={<IconZoomMoney size={18} />}
        onClick={() => setIsPricingDialog(true)}
      />}

      <PricingDialog
        open={isPricingDialogOpen}
        onClose={() => {
          setIsPricingDialog(false);
        }}
      />



      {/* Keys Setting */}
      {user && <SidebarButton
        text="Keys"
        icon={<IconKey size={18} />}
        onClick={() => homeDispatch({ field: "isKeysDialogOpen", value: true })}
      />
      }
      <KeysDialog
        open={isKeysDialogOpen}
        onClose={() => {
          homeDispatch({ field: "isKeysDialogOpen", value: false });
        }}
      />

      {/* Theme Setting */}
      {user && <SidebarButton
        text="Settings"
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialog(true)}
      />
      }
      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />

      {/* Profile Setting */}
      {user && <SidebarButton
        text="Profile"
        icon={<IconUserCircle size={18} />}
        onClick={() => setIsProfileDialog(true)}
      />
      }
      <ProfileDialog
        open={isProfileDialogOpen}
        onClose={() => {
          setIsProfileDialog(false);
        }}
      />

      {/* SignIn & SignOut */}
      {user ? <SignOut /> : <SignIn />}

      <NameDialog
        open={isNameDialogOpen}
        onClose={() => {
          homeDispatch({ field: "isNameDialogOpen", value: false });
        }}
      />

      <OpenaiKeyDialog
        open={isOpenaiKeyDialogOpen}
        onClose={() => {
          homeDispatch({ field: "isOpenaiKeyDialogOpen", value: false });
          homeDispatch({ field: "isKeysDialogOpen", value: false });
        }}
      />

      <PplxKeyDialog
        open={isPplxKeyDialogOpen}
        onClose={() => {
          homeDispatch({ field: "isPplxKeyDialogOpen", value: false });
          homeDispatch({ field: "isKeysDialogOpen", value: false });
        }}
      />

      <GeminiKeyDialog
        open={isGeminiKeyDialogOpen}
        onClose={() => {
          homeDispatch({ field: "isGeminiKeyDialogOpen", value: false });
          homeDispatch({ field: "isKeysDialogOpen", value: false });
        }}
      />

    </div>
  );
};

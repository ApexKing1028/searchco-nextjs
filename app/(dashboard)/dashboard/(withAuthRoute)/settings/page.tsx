
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserNameForm } from "@/components/user-name-form"
import { UserUniqueNameForm } from "@/components/user-unique-name-form"
import { OpenAIForm } from "@/components/openai-config-form"
import { GeminiConfigForm } from "@/components/gemini-config-form"
import { PerplexityConfigForm } from "@/components/perplexity-config-form"
import { TavilyConfigForm } from "@/components/tavily-config-form"

import { siteConfig } from "@/config/site"
import { NotificationSettingsForm } from "@/components/notification-settings-form"
import { db } from "@/lib/db"
import { ClaudeConfigForm } from "@/components/claude-config-form"

export const metadata = {
    title: `${siteConfig.name} - Settings`,
    description: "Manage Account and Website Settings.",
}

export default async function SettingsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const userNotifications = await db.user.findFirst({
        where: {
            id: user.id,
        },
        select: {
            inquiryEmailEnabled: true,
            marketingEmailEnabled: true,
        },
    })

    const openAIConfig = await db.openAIConfig.findUnique({
        select: {
            globalAPIKey: true,
            id: true,
        },
        where: {
            userId: user?.id
        }
    })

    const geminiConfig = await db.geminiConfig.findUnique({
        select: {
            globalAPIKey: true,
            id: true,
        },
        where: {
            userId: user?.id
        }
    })

    const perplexityConfig = await db.perplexityConfig.findUnique({
        select: {
            globalAPIKey: true,
            id: true,
        },
        where: {
            userId: user?.id
        }
    })

    const claudeConfig = await db.claudeConfig.findUnique({
        select: {
            globalAPIKey: true,
            id: true,
        },
        where: {
            userId: user?.id
        }
    })

    const tavilyConfig = await db.tavilyConfig.findUnique({
        select: {
            globalAPIKey: true,
            id: true,
        },
        where: {
            userId: user?.id
        }
    })

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Settings"
                text="Manage Account and Website Settings."
            />
            <div className="grid gap-10">
                <div className="grid gap-10">
                    <UserNameForm user={{ id: user.id, name: user.name || "" }} />
                    <UserUniqueNameForm user={{ id: user.id, uniqueName: user.uniqueName || "" }} />
                    <OpenAIForm user={{ id: user.id }} globalAPIKey={openAIConfig?.globalAPIKey || ""} />
                    <GeminiConfigForm user={{ id: user.id }} globalAPIKey={geminiConfig?.globalAPIKey || ""} />
                    <ClaudeConfigForm user={{ id: user.id }} globalAPIKey={claudeConfig?.globalAPIKey || ""} />
                    <PerplexityConfigForm user={{ id: user.id }} globalAPIKey={perplexityConfig?.globalAPIKey || ""} />
                    <TavilyConfigForm user={{ id: user.id }} globalAPIKey={tavilyConfig?.globalAPIKey || ""} />
                    <NotificationSettingsForm user={{ id: user.id }} marketingEmailEnabled={userNotifications?.marketingEmailEnabled!} inquiryNotificationEnabled={userNotifications?.inquiryEmailEnabled!} />
                </div>
            </div>
        </DashboardShell>
    )
}
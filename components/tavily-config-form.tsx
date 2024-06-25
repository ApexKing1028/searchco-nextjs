"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { openAIConfigSchema } from "@/lib/validations/openaiConfig"
import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Form, FormField, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { geminiConfigSchema } from "@/lib/validations/geminiConfig"
import { tavilyConfigSchema } from "@/lib/validations/tavilyConfig"

interface TavilyConfigFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id">,
    globalAPIKey: string
}

type FormData = z.infer<typeof openAIConfigSchema>


export function TavilyConfigForm({ user, globalAPIKey, className, ...props }: TavilyConfigFormProps) {
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(tavilyConfigSchema),
        defaultValues: {
            globalAPIKey: globalAPIKey || "",
        },
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)

        const response = await fetch(`/api/users/${user.id}/tavily`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                globalAPIKey: data.globalAPIKey,
            }),
        })

        setIsSaving(false)

        if (!response?.ok) {
            if (response.status === 400) {
                return toast({
                    title: "Invalid API key.",
                    description: "Your API key was invalid, try to generate a new one.",
                    variant: "destructive",
                })
            }

            return toast({
                title: "Something went wrong.",
                description: "Your Tavily configuration was not updated. Please try again.",
                variant: "destructive",
            })
        }

        toast({
            description: "Your Tavily configuration has been updated.",
        })

        router.refresh()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                <Card className={cn(className)}>
                    <CardHeader>
                        <CardTitle>Tavily Key Configuration</CardTitle>
                        <CardDescription>
                            Your global api key for Tavily will be used for all your global configurations.
                            You can create your API Key <Link target="_blank" className="underline" href='https://docs.mindmac.app/how-to.../internet-browsing/get-tavily-key'>here</Link>.
                            <br className="pb-2" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="globalAPIKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="globalAPIKey">
                                        Tavily Global API Key
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        onChange={field.onChange}
                                        id="globalAPIKey"
                                        defaultValue={globalAPIKey}
                                    />
                                    <FormDescription>
                                        This API key will be used for your global configuration.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <button
                            type="submit"
                            className={cn(buttonVariants(), className)}
                            disabled={isSaving}
                        >
                            {isSaving && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Save</span>
                        </button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}
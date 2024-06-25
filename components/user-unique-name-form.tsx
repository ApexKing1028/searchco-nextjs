"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userNameSchema } from "@/lib/validations/user"
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
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserUniqueNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id" | "uniqueName">
}

type FormData = z.infer<typeof userNameSchema>

export function UserUniqueNameForm({ user, className, ...props }: UserUniqueNameFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(userNameSchema),
        defaultValues: {
            uniqueName: user?.uniqueName || "",
        },
    })
    const [isSaving, setIsSaving] = React.useState<boolean>(false)

    async function onSubmit(data: FormData) {
        setIsSaving(true)
    
        const response = await fetch(`/api/users/${user.id}/uniquename`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uniqueName: data.uniqueName,
          }),
        })
    
        setIsSaving(false)
    
        if (!response?.ok) {
          if (response.status) {
            return toast({
              title: "Something went wrong.",
              description: "Your unique name is already exists.",
              variant: "destructive",
            })
          }
    
          return toast({
            title: "Something went wrong.",
            description: "Your unique name was not updated. Please try again.",
            variant: "destructive",
          })
        }
    
        toast({
          description: "Your unique name has been updated.",
        })
    
        router.refresh()
      }

    return (
        <form
            className={cn(className)}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Your Unique Name</CardTitle>
                    <CardDescription>
                        Please enter your unique name you are comfortable
                        with. But this unique name can not be duplicated with the others.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="uniqueName"
                            className="w-[400px]"
                            size={32}
                            {...register("uniqueName")}
                        />
                        {errors?.uniqueName && (
                            <p className="px-1 text-xs text-red-600">{errors.uniqueName.message}</p>
                        )}
                    </div>
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
    )
}
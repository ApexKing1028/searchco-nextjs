import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button"
import { cn } from '@/lib/utils';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { uniqueNameSchema } from '@/lib/validations/uniqueNameConfig';
import { useRouter } from 'next/navigation';

import { Icons } from '../icons';
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { toast } from '../ui/use-toast';

interface UniqueNameDialogProps extends React.HTMLAttributes<HTMLFormElement> {
  isOpen: boolean;
  userId: string;
}

type FormData = z.infer<typeof uniqueNameSchema>

export function UniqueNameDialog({ isOpen, userId, className, ...props }: UniqueNameDialogProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(uniqueNameSchema),
    defaultValues: {
      uniqueName: "",
    },
  })

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/users/${userId}/uniquename`, {
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
    <Dialog open={isOpen} modal={true}>
      <DialogContent className="sm:max-w-md py-[50px]"
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Set Your Unique Name</DialogTitle>
          <DialogDescription>
            Please enter a unique name to identify your profile.
          </DialogDescription>
        </DialogHeader>
        <div className='flex-col'>
          <form
            className={cn(className)}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
          >
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                className="w-[400px]"
                size={32}
                {...register("uniqueName")}
              />
              {errors?.uniqueName && (
                <p className="px-1 text-xs text-red-600">{errors.uniqueName.message}</p>
              )}
            </div>
            <div className='mt-2'>
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
            </div>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FolderPlus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const folderSchema = z.object({
    name: z.string().min(1, "Name is required")
})


export default function CreateFolderButton({ parent_id }: { parent_id: string | null }) {
    const [open, setOpen] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter()

    const createFolderForm = useForm({
        resolver: zodResolver(folderSchema),
        defaultValues: {
            name: ""
        }
    })



    const createFolderSubmit = async (values: z.infer<typeof folderSchema>) => {
        const { data, error } = await supabase
            .from('bookmarks')
            .insert([
                { name: values.name, parent_id: parent_id, is_folder: true },
            ])
            .select()
        setOpen(false)
        router.refresh()
    }


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='outline' size="icon">
                    <FolderPlus className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className='flex space-x-3 items-center mb-5' >
                    <span className="p-2 bg-gray-100 rounded-md ">
                        <FolderPlus className='' />
                    </span>
                    <span>
                        Create Folder
                    </span>
                </div>
                <Form {...createFolderForm}>
                    <form onSubmit={createFolderForm.handleSubmit(createFolderSubmit)} className="flex gap-3 align-center">
                        <FormField
                            control={createFolderForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Recipes'  {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="place-self-end" type="submit">
                            Create
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}
"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BookmarkPlus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const createSchema = z.object({
    link: z.string().trim().url(),
    name: z.string()
})



export default function Create({ parent_id }: { parent_id: string | null }) {
    const [open, setOpen] = useState(false);

    const supabase = createClientComponentClient();
    const router = useRouter()
    const createBookmarkForm = useForm({
        resolver: zodResolver(createSchema),
        defaultValues: {
            link: "",
            name: ""
        }
    })

    const createBookmarkSubmit = async (values: z.infer<typeof createSchema>) => {
        const { data, error } = await supabase
            .from('bookmarks')
            .insert([
                { link: values.link, name: values.name, parent_id: parent_id },
            ])
            .select()

        router.refresh()
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>

                <Button variant='outline' size="icon">
                    <BookmarkPlus className="h-5 w-5" />
                </Button>

            </PopoverTrigger>
            <PopoverContent>
                <div className='flex space-x-3 items-center mb-5' >
                    <span className="p-2 bg-gray-100 rounded-md ">
                        <BookmarkPlus className='' />
                    </span>
                    <span>
                        Create Bookmark
                    </span>
                </div>


                <Form {...createBookmarkForm}>
                    <form onSubmit={createBookmarkForm.handleSubmit(createBookmarkSubmit)} className="grid gap-5">
                        <FormField
                            control={createBookmarkForm.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder='https://twitter.com/blixthalka'  {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createBookmarkForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Twitter bio'  {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
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
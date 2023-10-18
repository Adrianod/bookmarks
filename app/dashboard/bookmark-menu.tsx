'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as Dropdown from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { CopyIcon, MoreHorizontalIcon, Trash2Icon, WandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bookmark } from "./bookmark-list";

export default function BookmarkMenu({ bookmark }: { bookmark: Bookmark }) {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [dialogContent, setDialogContent] = useState<string | undefined>(undefined)

    const deleteBookmark = async () => {
        const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('id', bookmark.id)
        router.refresh()
    }

    return (
        <Dialog>
            <Dropdown.DropdownMenu>
                <Dropdown.DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-none">
                        <MoreHorizontalIcon className="w-5 h-5 stroke-muted-foreground" />
                    </Button>
                </Dropdown.DropdownMenuTrigger>

                <Dropdown.DropdownMenuContent className="w-[180px]">
                    <Dropdown.DropdownMenuLabel>Actions</Dropdown.DropdownMenuLabel>
                    <Dropdown.DropdownMenuSeparator />
                    {!bookmark.is_folder && (
                        <Dropdown.DropdownMenuItem onSelect={() => navigator.clipboard.writeText(bookmark.link)}>
                            <CopyIcon className="w-4 h-4" />
                            <span>Copy Link</span>
                        </Dropdown.DropdownMenuItem>
                    )}
                    <DialogTrigger asChild>
                        <Dropdown.DropdownMenuItem onSelect={() => setDialogContent("edit")}>
                            <WandIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </Dropdown.DropdownMenuItem>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                        <Dropdown.DropdownMenuItem onSelect={() => setDialogContent("delete")}>
                            <Trash2Icon className="w-4 h-4" />
                            <span>Delete</span>
                        </Dropdown.DropdownMenuItem>
                    </DialogTrigger>
                </Dropdown.DropdownMenuContent>
            </Dropdown.DropdownMenu>
            {dialogContent === "delete" && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {bookmark.is_folder ? "Folder" : "Bookmark"}</DialogTitle>
                        <DialogDescription>{bookmark.is_folder ? "Everything inside this folder will also be deleted." : ""}</DialogDescription>
                        <DialogDescription>This can't be undone.</DialogDescription>
                    </DialogHeader>
                    <div className="bg-accent p-3 rounded-md">
                        <p>{bookmark.name}</p>
                        <p>{bookmark.link}</p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button variant={"destructive"} onClick={() => deleteBookmark()}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            )}
            {dialogContent === "edit" && (

                bookmark.is_folder
                    ? <FolderEditForm bookmark={bookmark} />
                    : <BookmarkEditForm bookmark={bookmark} />
            )}
        </Dialog>
    )
}

const bookmarkSchema = z.object({
    link: z.string().trim().url(),
    name: z.string()
})



function BookmarkEditForm({ bookmark }: { bookmark: Bookmark }) {
    const supabase = createClientComponentClient();
    const router = useRouter()

    const createBookmarkForm = useForm({
        resolver: zodResolver(bookmarkSchema),
        defaultValues: {
            link: bookmark.link,
            name: bookmark.name
        }
    })

    const editBookmarkSubmit = async (values: z.infer<typeof bookmarkSchema>) => {
        const { data, error } = await supabase
            .from('bookmarks')
            .update([
                { link: values.link, name: values.name },
            ])
            .eq("id", bookmark.id)
            .select()

        router.refresh()
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit {bookmark.is_folder ? "Folder" : "Bookmark"}</DialogTitle>
                <DialogDescription>Make some changes.</DialogDescription>
            </DialogHeader>
            <Form {...createBookmarkForm}>
                <form onSubmit={createBookmarkForm.handleSubmit(editBookmarkSubmit)} className="grid gap-5">
                    <FormField
                        control={createBookmarkForm.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Link</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
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
                                    <Input  {...field} />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
const folderSchema = z.object({
    name: z.string().min(1, "Name is required")
})

function FolderEditForm({ bookmark }: { bookmark: Bookmark }) {
    const supabase = createClientComponentClient();
    const router = useRouter()

    const createBookmarkForm = useForm({
        resolver: zodResolver(folderSchema),
        defaultValues: {
            name: bookmark.name
        }
    })

    const editFolderSubmit = async (values: z.infer<typeof folderSchema>) => {
        const { data, error } = await supabase
            .from('bookmarks')
            .update([
                { name: values.name },
            ])
            .eq("id", bookmark.id)
            .select()

        router.refresh()
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit {bookmark.is_folder ? "Folder" : "Bookmark"}</DialogTitle>
                <DialogDescription>Make some changes.</DialogDescription>
            </DialogHeader>
            <Form {...createBookmarkForm}>
                <form onSubmit={createBookmarkForm.handleSubmit(editFolderSubmit)} className="grid gap-5">

                    <FormField
                        control={createBookmarkForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
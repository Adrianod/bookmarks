import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SupabaseClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { BookmarkIcon, FacebookIcon, FigmaIcon, FlameKindlingIcon, FolderIcon, GithubIcon, HeadphonesIcon, InstagramIcon, Loader, MoveUpIcon, TrafficCone, TwitchIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import BookmarkMenu from "./bookmark-menu";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

export interface Bookmark {
    id: string;
    user_id: string;
    name: string;
    link: string;
    parent_id: string;
    is_folder: boolean;
}

function fetchBookmarks(supabase: SupabaseClient, parent_id: string) {
    if (parent_id) {
        return supabase
            .from('bookmarks')
            .select()
            .eq("parent_id", parent_id)
    } else {
        return supabase
            .from('bookmarks')
            .select()
            .is("parent_id", parent_id ? parent_id : null)
    }
}

function sortBookmarks(bookmarks: Bookmark[]) {
    const folders = bookmarks.filter(b => b.is_folder)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    const bkmarks = bookmarks.filter(b => !b.is_folder)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

    return folders.concat(bkmarks)
}

export const BookmarkList = async ({ parent_id }: any) => {
    const supabase = createServerComponentClient({ cookies })

    let { data: bookmarks } = await fetchBookmarks(supabase, parent_id);
    bookmarks = sortBookmarks(bookmarks);


    if (bookmarks?.length === 0) {
        return <Empty />
    } else if (bookmarks === null) {
        return (<div className="flex my-20 justify-center">
            <Loader className="animate-spin" />
        </div>)
    }

    return (
        <div className="">
            {bookmarks.map(bookmark => (
                <div key={bookmark.id} className="border-b last:border-b-0">
                    {bookmark.is_folder
                        ? <FolderItem bookmark={bookmark} />
                        : <BookmarkItem bookmark={bookmark} />}
                </div>
            ))}
        </div>
    )
}

function FolderItem({ bookmark }: { bookmark: Bookmark }) {
    return (
        <div className="flex ">
            <Link
                href={`/dashboard/${bookmark.id}`}
                className="rounded-md flex-col w-full px-3 py-2 hover:bg-accent"
            >
                <div className="flex items-center space-x-3 text-sm">
                    <FolderIcon className="w-5 h-5 stroke-muted-foreground" />
                    <span className=" font-medium">{bookmark.name}</span>
                </div>
            </Link>

            <BookmarkMenu bookmark={bookmark} />
        </div>)
}


function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
    return (
        <div className={`flex `}>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={bookmark.link}
                            target="_blank"
                            className="flex-col w-full px-3 py-2 hover:bg-gray-100"
                        >
                            <div className="flex items-center space-x-3 text-sm">
                                <GetIcon link={bookmark.link} />
                                {bookmark.name === ''
                                    ? (<>
                                        <span className="text-muted-foreground hidden md:block">{bookmark.link}</span>
                                        <span className="text-muted-foreground block md:hidden">{short(bookmark.link)}</span>
                                    </>)
                                    : (<>
                                        <span className="font-medium">{bookmark.name}</span>
                                        <span className="text-muted-foreground hidden md:block">{short(bookmark.link)}</span>
                                    </>)
                                }
                            </div>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent className="flex space-x-3">
                        <p>{bookmark.link || bookmark.name}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <BookmarkMenu bookmark={bookmark} />
        </div>)
}




function GetIcon({ link, }: { link: string }) {
    if (link.includes("twitter.com")) {
        return (<TwitterIcon className="w-5 h-5 stroke-muted-foreground" />)
    } else if (link.includes("instagram.com")) {
        return <InstagramIcon className="w-5 h-5 stroke-muted-foreground" />
    }
    else if (link.includes("youtube.com")) {
        return <YoutubeIcon className="w-5 h-5 stroke-muted-foreground" />
    }
    else if (link.includes("twitch.com")) {
        return <TwitchIcon className="w-5 h-5 stroke-muted-foreground" />
    }
    else if (link.includes("github.com")) {
        return <GithubIcon className="w-5 h-5 stroke-muted-foreground" />
    }
    else if (link.includes("facebook.com")) {
        return <FacebookIcon className="w-5 h-5 stroke-muted-foreground" />
    }
    else if (link.includes("figma.com")) {
        return <FigmaIcon className="w-5 h-5 stroke-muted-foreground" />
    }
    else if (link.includes("netlify.app")) {
        return <TrafficCone className="w-5 h-5 stroke-muted-foreground" />
    }
    else if (link.includes("spotify.com")) {
        return <HeadphonesIcon className="w-5 h-5 stroke-muted-foreground" />
    }
    else {
        return <BookmarkIcon className="w-5 h-5 stroke-muted-foreground" />
    }
}


function short(text: string) {
    const splitted = text
        .replace("https://", "")
        .replace("www.", "")
        .split("/")

    if (splitted.length > 0) {
        return splitted[0]
    } else {
        return text
    }
}




const Empty = () => {
    return (
        <div>
            <div className="flex items-end text-muted-foreground stroke-gray-300-foreground justify-end space-x-3 mr-2">
                <span>Empty! Create a bookmark here</span>
                <MoveUpIcon className="h-5 w-5 " />
            </div>
            <FlameKindlingIcon className="mx-auto w-20 h-20 my-20 stroke-gray-300" />
        </div>
    )
}
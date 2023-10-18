import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CaravanIcon, ChevronRight } from 'lucide-react';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { BookmarkList } from './bookmark-list';
import Create from './create-bookmark-button';
import CreateFolderButton from './create-folder-button';

async function fetchPath(supabase, id) {
    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select()
        .eq("id", id)

    if (bookmarks?.length !== 1) {
        return []
    }

    const bookmark = bookmarks[0]
    if (bookmark.parent_id !== null) {
        return (await fetchPath(supabase, bookmark.parent_id)).concat([bookmark])
    } else {
        return [bookmark]
    }

}


export default async function Wrapper({ parent_id }: { parent_id: string | null }) {
    const supabase = createServerComponentClient({ cookies })
    const folder = await fetchPath(supabase, parent_id)

    return (
        <>
            <Card className='max-w-3xl mx-auto mt-5'>
                <CardHeader className="flex-row justify-between items-center">
                    <div className='flex  items-center space-x-1.5'>

                        <Link
                            href="/dashboard"
                            className="bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 flex items-center justify-center rounded-md"
                        >
                            <CaravanIcon className='w-5 h-5' />
                        </Link>

                        {folder?.map(f => (
                            <>
                                <ChevronRight className="stroke-muted-foreground" />
                                <Link
                                    href={`/dashboard/${f.id}`}
                                    className="bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3 py-2 flex items-center justify-center rounded-md"
                                >
                                    {f?.name}
                                </Link>
                            </>
                        ))}

                    </div>
                    <div className='flex space-x-3'>
                        <CreateFolderButton parent_id={parent_id} />
                        <Create parent_id={parent_id} />
                    </div>
                </CardHeader>
                <CardContent >
                    <BookmarkList parent_id={parent_id} />
                </CardContent>
            </Card>
        </>
    )
}




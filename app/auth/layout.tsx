import BookmarkHeader from "@/components/bookmark-header";
import {
    Card
} from "@/components/ui/card";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if(session) {
        redirect("/dashboard")
    }

    return (
        <main className={`max-w-sm py-10 mx-auto`}>
            <BookmarkHeader className="mb-10 " />
            <Card>
                {children}
            </Card>
        </main>
    )

}

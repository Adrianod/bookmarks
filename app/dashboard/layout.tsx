
import BookmarkHeader from '@/components/bookmark-header';
import LogoutButton from '@/components/logout';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Bookmarks.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="bg-zinc-50 min-h-screen px-5">
      <header className="flex justify-between items-center   py-5 max-w-3xl mx-auto">
        <BookmarkHeader />
        <LogoutButton />
      </header>
      {children}
    </div>
  )
}

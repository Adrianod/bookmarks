"use client";

import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation'

export default function Logout() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    const sign = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }
    return (
        <Button variant="outline" onClick={sign} >
            Sign out
        </Button>
    )
}
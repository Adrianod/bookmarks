"use client";
import { Button } from '@/components/ui/button';
import { CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {

    const router = useRouter()

    return (
        <>
            <CardHeader>
                <CardTitle>Verify your email</CardTitle>
                <CardDescription>Look in your inbox.</CardDescription>
            </CardHeader>
            <CardFooter className='justify-end'>
                <Button onClick={() => router.refresh()} className="space">
                    <RefreshCcw className='w-5 h-5 mr-2 ' />
                    Refresh
                </Button>
            </CardFooter>
        </>
    )
}





'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BookmarkCheck } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from "zod";

import { useRouter } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z.string()
})


export default function Login() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
            repeat_password: ""
        },
    })

    const loginInWithPassword = async (values: z.infer<typeof loginFormSchema>) => {
        const res = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })
        if (res?.error !== null) {
            setErrorMsg(res?.error?.message)
        } else {
            router.refresh()
        }
    }

    return (

        <>

            <CardHeader className=''>
                <CardTitle>Login</CardTitle>
                <CardDescription>Welcome back</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(loginInWithPassword)} className="grid space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder='example@example.com'  {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder='**************' type="password"  {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {errorMsg && (
                            <Alert variant={"destructive"}>
                                <AlertDescription>{errorMsg}</AlertDescription>
                            </Alert>
                        )}

                        <Button className="" type="submit">Login</Button>
                    </form>
                </Form>



                <Separator className="mt-5" />

                <div className="mt-5 text-center">
                    <Link
                        href='/auth/sign-up'
                        className='text-muted-foreground cursor-pointer hover:text-black '>
                        or sign up
                    </Link>
                </div>
            </CardContent>
        </>
    )
}





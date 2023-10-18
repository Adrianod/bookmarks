'use client';

import { Button } from '@/components/ui/button';

import {
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
import { useForm } from 'react-hook-form';
import * as z from "zod";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const signUpFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z.string(),
    repeat_password: z.string()
}).refine((data) => data.password === data.repeat_password, {
    message: "Passwords don't match",
    path: ["repeat_password"],
});

export default function SignUp() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    const form = useForm({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: "",
            password: "",
            repeat_password: ""
        },
    })

    const signUpWithPassword = async (values: z.infer<typeof signUpFormSchema>) => {
        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        router.push("/auth/verify")
    }

    return (
        <>
            <CardHeader className=''>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Join thousands of users</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(signUpWithPassword)} className="grid space-y-5">
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
                        <FormField
                            control={form.control}
                            name="repeat_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Repeat Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder='**************' type="password"  {...field} />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <Button className="" type="submit">Sign Up</Button>
                    </form>
                </Form>


                <Separator className="mt-5" />

                <div className="mt-5 text-center">
                    <Link
                        href='/auth/login'
                        className='text-muted-foreground cursor-pointer hover:text-black '>
                        or login
                    </Link>
                </div>
            </CardContent>
        </>
    )
}





import React from "react";

import { JetBrains_Mono } from 'next/font/google'
import { Props, ScriptProps } from "next/script";

const jetbrains = JetBrains_Mono({ subsets: ['latin'] })

export default function BookmarkHeader({ className }: ScriptProps) {
    return (
        <div className={` ${className}`}>
            <h1 className={`text-4xl font-extrabold tracking-tight md:text-5xl  ${jetbrains.className} `}>BOOKMARKS</h1>
            <span className="text-sm text-muted-foreground ">by <a href="https://twitter.com/blixthalka" className="text-blue-500 hover:text-blue-600">@blixthalka</a></span>
        </div>
    )
}

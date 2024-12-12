"use client";

import Link from "next/link"

export default function Home() {
    return (
        <div>
            <h1>Home</h1>

            <Link href="/auth">Login or Register</Link>
        </div>
    )
}
"use client";

import { Sidebar } from "@/components/sidebar";


export default function Dashboard() {
    return (
        <div className="flex min-h-screen">
            <Sidebar className="w-64 hidden md:block" />
            <h1>Dashboard Admin</h1>
        </div>
    )
}
"use client"

import { Sidebar } from "@/app/_components/sidebar"
import { Metrics } from "@/app/_components/metrics"
import { Charts } from "@/app/_components/charts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'



export default function Dashboard() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
            </div>
            <Metrics />
            <Charts />
      </div>
    )
}
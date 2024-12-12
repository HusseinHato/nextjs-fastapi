import { BarChart2, LogOut, Settings } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from 'next/image'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-h-screen bg-[#F5F9FF]", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex flex-col items-start space-y-2">
            <Image src="/coretoday.png" alt="logo" width={150} height={150} />
            <p className="text-lg">X</p>
            <Image src="/kokkiri.png" alt="logo" width={150} height={150} />
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <BarChart2 className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
              Setting
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Link>
      </div>
    </div>
  )
}


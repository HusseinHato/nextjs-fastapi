import { BarChart2, LogOut, Settings } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-h-screen bg-[#F5F9FF]", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex flex-col items-start space-y-2">
            <h2 className="text-xl font-bold tracking-tight">CORE.TODAY</h2>
            <p className="text-lg">X</p>
            {/* Blue elephant icon */}
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
              >
                <path d="M19 8.71V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2.71a2 2 0 0 0 0 2.58V16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4.71a2 2 0 0 0 0-2.58Z" />
                <path d="M12 8v8" />
                <path d="M8 9v6" />
                <path d="M16 9v6" />
              </svg>
            </div>
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


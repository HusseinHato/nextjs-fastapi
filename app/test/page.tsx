import { Sidebar } from "@/components/sidebar"
import { Metrics } from "@/components/metrics"
import { Charts } from "@/components/charts"
import { ProductTable } from "@/components/product-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 hidden md:block" />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back, Admin!</h2>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="@admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Metrics />
        <Charts />
        <ProductTable />
      </div>
    </div>
  )
}


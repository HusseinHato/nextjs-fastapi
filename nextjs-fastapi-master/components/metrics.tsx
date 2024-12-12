import { Users, Package, ListIcon as Category } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export function Metrics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total contributors</p>
            <p className="text-2xl font-bold">11</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-blue-100 p-2 text-blue-500">
            <Users className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total products</p>
            <p className="text-2xl font-bold">115</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-red-100 p-2 text-red-500">
            <Package className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total categories</p>
            <p className="text-2xl font-bold">4</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-purple-100 p-2 text-purple-500">
            <Category className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


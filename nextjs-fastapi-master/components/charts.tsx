"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Tooltip,
} from "recharts"

const contributorsData = [
  { name: "Hasbi", value: 62 },
  { name: "Aya", value: 50 },
  { name: "Ame", value: 58 },
  { name: "Zahra", value: 88 },
  { name: "Ahsan", value: 75 },
  { name: "Rafi", value: 63 },
  { name: "Aqil", value: 110 },
  { name: "Mieko", value: 75 },
  { name: "Gilang", value: 82 },
  { name: "Putra", value: 40 },
  { name: "Hussein", value: 15 },
]

const categoriesData = [
  { name: "Animal", value: 60, color: "#2563eb" },
  { name: "Robot", value: 40, color: "#60a5fa" },
  { name: "Vehicle", value: 50, color: "#93c5fd" },
  { name: "Misc", value: 10, color: "#dbeafe" },
]

export function Charts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Contributors Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={contributorsData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="value"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2 md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4">
            {categoriesData.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


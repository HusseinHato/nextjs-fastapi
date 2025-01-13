"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { use, useEffect, useState } from "react"
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

interface CategoriesData {
  name: string
  value: number
  color: string
}

export function Charts() {

  const [contributorsData, setContributorsData] = useState([])
  const [categoriesData, setCategoriesData] = useState<CategoriesData[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/api/py/users-chart")
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => setContributorsData(data))
      .catch((error) => console.error("Error fetching contributors data:", error));
      
    fetch("http://localhost:8000/api/py/toys-by-category")
    .then((response) => response.json())
    .then((data) => setCategoriesData(data)) 
    .catch((error) => console.error("Error fetching categories data:", error)); // Handle any errors
  }, []);

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
                stroke="#000"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#000000"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
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


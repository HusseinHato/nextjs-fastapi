import { useState, useEffect } from "react";
import { Users, Package, ListIcon as Category } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Metrics() {
  // State to hold metrics data
  const [metrics, setMetrics] = useState({
    total_toys_count: 0,
    total_users_count: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/py/metrics");
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total contributors</p>
            <p className="text-2xl font-bold">
              {loading ? "Loading..." : metrics.total_users_count}
            </p>
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
            <p className="text-2xl font-bold">
              {loading ? "Loading..." : metrics.total_toys_count}
            </p>
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
            <p className="text-2xl font-bold">
              4
            </p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-purple-100 p-2 text-purple-500">
            <Category className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

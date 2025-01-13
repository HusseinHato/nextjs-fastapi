import Link from 'next/link'
import { UserCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PerformanceModelTable from '@/app/_components/performance-model-table'

export default function Performance() {
    return (
        <div className="flex-1 p-6">
        <div className="container mx-auto p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Performance Model</h1>
          </div>

          <div className="flex justify-between items-center mb-4">
            {/* <div className="relative flex-1 max-w-md">
              <Input 
                type="search" 
                placeholder="Search by category or contributor" 
                className="pl-10 pr-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
            </div>
            */}
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="performance/input">Input Data</Link>
            </Button>
          </div>

          {/* Table */}
          <PerformanceModelTable />
        </div>
      </div>
    );
}
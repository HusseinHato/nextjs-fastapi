'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type User = {
    id: string
    user: {
        username: string
        fullname: string
    }
    toy_count: number
}

export default function PerformanceModelTable() {
  // const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 5
  const [users, setUsers] = useState<User[]>([])
  // const totalPages = Math.ceil(performanceModels.length / itemsPerPage)

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/py/users-with-toy-count')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setUsers(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching performance models:', error)
      }
    }

  fetchUsers()
  }, [])

  /* const currentData = performanceModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) */

  return (
    <div className="flex-1 p-6">
        <div className="container mx-auto p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Contributor</h1>
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
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow className="bg-gray-100">
                    <TableHead className="text-black">Username</TableHead>
                    <TableHead className="text-black">Full Name</TableHead>
                    <TableHead className="text-black">Contribution</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-black">{item.user.username}</TableCell>
                    <TableCell className="text-black">{item.user.fullname}</TableCell>
                    <TableCell className="text-black">{item.toy_count}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
          
        </div>
      </div>
    
  )
}
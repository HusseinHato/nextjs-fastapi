'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

type PerformanceModel = {
  id: string
  image: string
  actual_result: string
  weight: number
  contributor: string
  title: string
}

export default function PerformanceModelTable() {
  // const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 5
  const [performanceModels, setPerformanceModels] = useState<PerformanceModel[]>([])
  // const totalPages = Math.ceil(performanceModels.length / itemsPerPage)

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPerformanceModels = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/py/items')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setPerformanceModels(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching performance models:', error)
      } finally {
        setLoading(false)
      }
    }

  fetchPerformanceModels()
  }, [])

  /* const currentData = performanceModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) */

  const handleDelete = async (id: string) => {
    // Here you would typically send a delete request to your backend
    const response = await fetch(`/api/py/items/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the deleted item from the state
      setPerformanceModels((prevItems) => prevItems.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
    }
    
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading ? <p className="text-center p-4">Loading...</p> :
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-black">Image</TableHead>
            <TableHead className="text-black">Title</TableHead>
            <TableHead className="text-black">Category</TableHead>
            <TableHead className="text-black">Weight</TableHead>
            <TableHead className="text-black">Contributor</TableHead>
            <TableHead className="text-black">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performanceModels.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <Image src={"data:image/png;base64, " + item.image} alt={item.actual_result} width={50} height={50} className="rounded-full" />
              </TableCell>
              <TableCell className="text-black">{item.title}</TableCell>
              <TableCell className="text-black">{item.actual_result}</TableCell>
              <TableCell className="text-black">{item.weight}</TableCell>
              <TableCell className="text-black">{item.contributor}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild className="text-blue-600 hover:text-blue-800">
                  <Link href={`/dashboard/performance/edit/${item.id}`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the performance model.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    }
    </div>
  )
}
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type PerformanceModel = {
  id: number
  image: string
  category: string
  weight: number
  contributor: string
}

const dummyData: PerformanceModel[] = [
  { id: 1, image: '/placeholder.svg', category: 'Animal', weight: 50, contributor: 'John Doe' },
  { id: 2, image: '/placeholder.svg', category: 'Vehicle', weight: 1500, contributor: 'Jane Smith' },
  { id: 3, image: '/placeholder.svg', category: 'Robot', weight: 100, contributor: 'Bob Johnson' },
  { id: 4, image: '/placeholder.svg', category: 'Misc', weight: 5, contributor: 'Alice Brown' },
  // Add more dummy data as needed
]

export default function PerformanceModelTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(dummyData.length / itemsPerPage)

  const currentData = dummyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = (id: number) => {
    // Here you would typically send a delete request to your backend
    console.log(`Deleting item with id: ${id}`)
    // Then update the local state to remove the item
    // This is a simplified example, you'd need to implement proper state management
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-black">Image</TableHead>
            <TableHead className="text-black">Category</TableHead>
            <TableHead className="text-black">Weight</TableHead>
            <TableHead className="text-black">Contributor</TableHead>
            <TableHead className="text-black">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <Image src={item.image} alt={item.category} width={50} height={50} className="rounded-full" />
              </TableCell>
              <TableCell className="text-black">{item.category}</TableCell>
              <TableCell className="text-black">{item.weight}</TableCell>
              <TableCell className="text-black">{item.contributor}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild className="text-blue-600 hover:text-blue-800">
                  <Link href={`/edit-performance-model/${item.id}`}>
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

      <div className="flex justify-center mt-4 space-x-2 items-center bg-gray-100 p-2 rounded-b-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-black">Page {currentPage} of {totalPages}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-blue-600 hover:text-blue-800"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


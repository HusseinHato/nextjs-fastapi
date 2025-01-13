'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'
import { set } from 'react-hook-form'
import { postFetcherFormdata } from '@/lib/fetcher'
import { toast } from 'sonner'

export default function EditPerformanceModelPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [actualResult, setActualResult] = useState('')
  const [expectedResult, setExpectedResult] = useState('')
  const [weight, setWeight] = useState('')
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('/placeholder.svg')
  const [itemId, setItemId] = useState('')

  useEffect(() => {
    // Here you would typically fetch the existing data based on the ID
    // This is a mock implementation

    const fetchPerformanceModels = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/py/items/' + params.id)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setActualResult(data.actual_result)
        setExpectedResult(data.expected_result)
        setWeight(data.weight)
        setImage(data.image)
        setTitle(data.title)
        setItemId(data.id)
        console.log(data)
      } catch (error) {
        console.error('Error fetching performance models:', error)
      }
    }

  fetchPerformanceModels()
    
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your backend
    try {
      // Create a FormData object
      const formData = new FormData();
  
      // Append optional fields to FormData
      formData.append('expected_result', expectedResult);
      formData.append('title', title);
      formData.append('weight', weight);

      // Append image data to FormData
  
      // Make the PUT request
      const response = await fetch(`/api/py/items/${itemId}`, {
        method: 'PUT',
        body: formData,
      });
  
      // Check if the response is successful
      if (!response.ok) {
        toast.error('Failed to update item');
        return
      }
  
      // Parse and return the response JSON
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Error updating item');
    }
    // Redirect back to the main page
    router.push('/dashboard/performance')
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <Button variant="ghost" onClick={() => router.push('/dashboard/performance')} className="mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Performance Models
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-black">Edit Performance Model</h1>
      <h4 className='text-md mb-6 text-black'>{params.id}</h4>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <Image src={"data:image/png;base64, " + image} alt="Performance Model" width={200} height={200} className="rounded-lg" />
        </div>

        <div>
          <p>Actual Result: {actualResult}</p>
        </div>
        
        <div>
          <Label htmlFor="expectedResult" className="text-black">Expected Result</Label>
          <select
            id="expectedResult"
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
            className="w-full p-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
          >
            <option value="animal">Animal</option>
            <option value="vehicle">Vehicle</option>
            <option value="robot">Robot</option>
            <option value="misc">Misc</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="weight" className="text-black">Product Weight (grams)</Label>
          <Input 
            id="weight" 
            type="number" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            placeholder="Enter weight in grams"
            min="0"
            step="0.1"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <Label htmlFor="title" className="text-black">Title</Label>
          <Input 
            id="title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter Title"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Update</Button>
      </form>
    </div>
  )
}

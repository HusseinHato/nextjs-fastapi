'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'

export default function EditPerformanceModelPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState('')
  const [weight, setWeight] = useState('')
  const [image, setImage] = useState('/placeholder.svg')

  useEffect(() => {
    // Here you would typically fetch the existing data based on the ID
    // This is a mock implementation
    setCategory('animal')
    setWeight('50')
    setImage('/placeholder.svg')
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your backend
    console.log({ id: params.id, category, weight })
    // Redirect back to the main page
    router.push('/')
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Performance Models
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-black">Edit Performance Model</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <Image src={image} alt="Performance Model" width={200} height={200} className="rounded-lg" />
        </div>
        
        <div>
          <Label htmlFor="category" className="text-black">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
        
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Update</Button>
      </form>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'

export default function InputPerformanceModelPage() {
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [weight, setWeight] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const categorizeImage = () => {
    // This is a mock function. In a real application, you would call an AI service here.
    const categories = ['animal', 'vehicle', 'robot', 'misc']
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    setCategory(randomCategory)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({ image, category, weight })
    // Redirect back to the main page
    router.push('/')
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <Button variant="ghost" onClick={() => router.push('/performance')} className="mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Performance Models
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-black">Input Performance Model</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <Label htmlFor="image-upload" className="text-black">Upload Image</Label>
          <Input id="image-upload" type="file" onChange={handleImageUpload} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          {image && <Image src={image} alt="Uploaded image" width={200} height={200} className="mt-2 rounded-lg" />}
        </div>
        
        <Button type="button" onClick={categorizeImage} className="bg-blue-600 hover:bg-blue-700 text-white">Categorize</Button>
        
        <div>
          <Label htmlFor="category" className="text-black">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
          >
            <option value="">Select a category</option>
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
        
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Upload</Button>
      </form>
    </div>
  )
}


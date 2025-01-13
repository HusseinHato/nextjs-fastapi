"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'
import { postFetcherFormdata } from '@/lib/fetcher'
import { toast } from 'sonner'
import { set } from 'zod'

export default function InputPerformanceModelPage() {
  const router = useRouter()
  const [image, setImage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [actualResult, setActualResult] = useState('')
  const [expectedResult, setExpectedResult] = useState('')
  const [weight, setWeight] = useState('')
  const [title, setTitle] = useState('')
  const [showActualResult, setShowActualResult] = useState(false)
  const [contributor, setContributor] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/py/users/me", { method: "GET", credentials: "include" });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data) {
          setContributor(data.username);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();

  }, []);
  

  interface InputBody {
    image: File;
    actual_result: string;
    expected_result: string;
    weight: string;
    title: string;
    contributor: string;
  }
  
  interface Response {
    message: string;
    error: string;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      setImageFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategorizeImage = async (event: React.FormEvent) => {

    event.preventDefault();

    if (!imageFile) {
      toast.error("Please upload an image first.")
      return
    }

    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append('file', imageFile);
  
      // Make the request to the FastAPI endpoint
      const response = await fetch('http://localhost:8000/api/py/predict', {
        method: 'POST',
        body: formData
      });
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        toast.error("Failed to fetch predictions")
      }
  
      // Parse the response data
      const data = await response.json();
  
      // Extract predictions from the response
      const { predictions } = data;

      if(predictions.length === 0) {
        toast.error("Try another image.")
        setActualResult('')
        setShowActualResult(false)
        return
      }
  
      setShowActualResult(true)
      setActualResult(predictions[0]); // Returns an array of predictions
    } catch (error) {
      console.error('Error categorizing the image:', error);
      setShowActualResult(false)
      setActualResult('');
    }

  }
   

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile || !actualResult || !expectedResult || !weight || !title || !contributor) {
      toast.error("All fields are required.");
      return;
    }

    console.log({ imageFile, actualResult, expectedResult, weight, title, contributor })

    // Here you would typically send the data to your backend
    const response = await postFetcherFormdata<InputBody, Response>("http://localhost:8000/api/py/items", { image : imageFile, actual_result : actualResult, expected_result : expectedResult, weight, title, contributor })
    
    if (response.message !== "Item created successfully") {
      toast.error("Error creating item")
      return
    }

    
    
    toast("Item created successfully")

    // Redirect back to the main page
    router.push('/dashboard/performance')
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <Button variant="ghost" onClick={() => router.push('/dashboard/performance')} className="mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Performance Models
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-black">Input Performance Model</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
          <Label htmlFor="title" className="text-black">Title</Label>
          <Input 
            id="title" 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter title"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <Label htmlFor="image-upload" className="text-black">Upload Image</Label>
          <Input id="image-upload" type="file" onChange={handleImageUpload} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          {image && <Image src={image} alt="Uploaded image" width={200} height={200} className="mt-2 rounded-lg" />}
        </div>
        
        <Button type="button" onClick={handleCategorizeImage} className="bg-blue-600 hover:bg-blue-700 text-white">Categorize</Button>
        
        {showActualResult && (
          <div>
            <Label htmlFor="actual-result" className="text-black">Actual Result</Label>
            <Input 
              id="actual-result"
              value={actualResult}
              readOnly
              className="w-full p-2 border rounded border-gray-300 focus:ring-blue-500 bg-gray-100 text-black"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="expected-result" className="text-black">Expected Result</Label>
          <select
            id="expected-result"
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
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
        
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Submit</Button>
      </form>
    </div>
  )
}

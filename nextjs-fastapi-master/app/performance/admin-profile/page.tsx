'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'

export default function AdminProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profilePic, setProfilePic] = useState('/placeholder.svg')
  const [username, setUsername] = useState('admin123')
  const [fullName, setFullName] = useState('Admin User')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePic(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile data to your backend
    console.log({ profilePic, username, fullName, password })
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Performance Models
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-black">Admin Profile</h1>
      {!isEditing ? (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <Image src={profilePic} alt="Profile Picture" width={200} height={200} className="rounded-full" />
          <p className="text-black"><strong>Username:</strong> {username}</p>
          <p className="text-black"><strong>Full Name:</strong> {fullName}</p>
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <Button variant="ghost" onClick={() => setIsEditing(false)} className="mb-4 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <div>
            <Label htmlFor="profile-pic" className="text-black">Profile Picture</Label>
            <Input id="profile-pic" type="file" onChange={handleProfilePicChange} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
            {profilePic && <Image src={profilePic} alt="Profile Picture" width={200} height={200} className="rounded-full mt-2" />}
          </div>
          <div>
            <Label htmlFor="username" className="text-black">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <Label htmlFor="full-name" className="text-black">Full Name</Label>
            <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <Label htmlFor="password" className="text-black">New Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <Label htmlFor="confirm-password" className="text-black">Confirm New Password</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
        </form>
      )}
    </div>
  )
}


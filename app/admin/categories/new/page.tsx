"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBlogCategory } from "@/lib/blog-api"

export default function NewCategoryPage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    setSlug(newName.toLowerCase().replace(/\s+/g, "-").slice(0, 200))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createBlogCategory({ name, slug, description })
      router.push("/admin/categories")
    } catch (error) { 
      console.error("Failed to create category:", error)
      // Here you could show an error message to the user
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Category</h1>
        <p className="text-muted-foreground">Create a new blog category.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={handleNameChange} required />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              <p className="text-sm text-muted-foreground mt-1">The slug is the URL-friendly version of the name.</p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

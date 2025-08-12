"use client"

import { useState, useEffect } from "react"
import { BlogPostCard } from "./blog-post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { getBlogPosts, getBlogCategories, type BlogPost, type BlogCategory } from "@/lib/blog-api"

interface BlogPostListProps {
  initialPosts?: BlogPost[]
  initialCategories?: BlogCategory[]
  showFilters?: boolean
  limit?: number
}

export function BlogPostList({
  initialPosts = [],
  initialCategories = [],
  showFilters = true,
  limit,
}: BlogPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [categories, setCategories] = useState<BlogCategory[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  useEffect(() => {
    if (initialPosts.length === 0) {
      loadPosts()
    }
    if (initialCategories.length === 0) {
      loadCategories()
    }
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const fetchedPosts = await getBlogPosts({
        limit,
        category: selectedCategory || undefined,
      })
      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getBlogCategories()
      setCategories(fetchedCategories)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [selectedCategory])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const featuredPost = filteredPosts[0]
  const regularPosts = filteredPosts.slice(1)

  return (
    <div className="space-y-8">
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFiltersPanel(!showFiltersPanel)} className="sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFiltersPanel && (
            <div className="p-4 border rounded-lg bg-card space-y-4">
              <div>
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedCategory === "" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory("")}
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.slug ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.slug)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-t-lg"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No posts found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {featuredPost && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
              <BlogPostCard post={featuredPost} variant="featured" />
            </div>
          )}

          {regularPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

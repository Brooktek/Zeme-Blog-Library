"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Tags, Edit } from "lucide-react"

interface Stats {
  publishedPosts: number
  totalCategories: number
  totalTags: number
  draftPosts: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats")
        const { data } = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your blog admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <StatsCard.Skeleton />
            <StatsCard.Skeleton />
            <StatsCard.Skeleton />
            <StatsCard.Skeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Published Posts"
              value={stats?.publishedPosts ?? 0}
              description="Total published blog posts"
              icon={FileText}
            />
            <StatsCard
              title="Draft Posts"
              value={stats?.draftPosts ?? 0}
              description="Total draft blog posts"
              icon={Edit}
            />
            <StatsCard
              title="Categories"
              value={stats?.totalCategories ?? 0}
              description="Total blog categories"
              icon={FolderOpen}
            />
            <StatsCard title="Tags" value={stats?.totalTags ?? 0} description="Total blog tags" icon={Tags} />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Activity tracking will be implemented in a future update.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <a
                href="/admin/posts/new"
                className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
              >
                <FileText className="h-4 w-4" />
                Create New Post
              </a>
              <a
                href="/admin/categories"
                className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
              >
                <FolderOpen className="h-4 w-4" />
                Manage Categories
              </a>
              <a href="/admin/tags" className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                <Tags className="h-4 w-4" />
                Manage Tags
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

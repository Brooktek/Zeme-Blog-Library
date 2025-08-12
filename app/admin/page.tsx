import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Tags, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

async function getStats() {
  const [postsResult, categoriesResult, tagsResult] = await Promise.all([
    supabase.from("blog_posts").select("id, status").eq("status", "published"),
    supabase.from("blog_categories").select("id"),
    supabase.from("blog_tags").select("id"),
  ])

  return {
    publishedPosts: postsResult.data?.length || 0,
    totalCategories: categoriesResult.data?.length || 0,
    totalTags: tagsResult.data?.length || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your blog admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Published Posts"
          value={stats.publishedPosts}
          description="Total published blog posts"
          icon={FileText}
        />
        <StatsCard
          title="Categories"
          value={stats.totalCategories}
          description="Total blog categories"
          icon={FolderOpen}
        />
        <StatsCard title="Tags" value={stats.totalTags} description="Total blog tags" icon={Tags} />
        <StatsCard title="Views" value="N/A" description="Analytics coming soon" icon={Eye} />
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

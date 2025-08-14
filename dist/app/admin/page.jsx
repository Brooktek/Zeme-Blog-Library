"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminDashboard;
const react_1 = require("react");
const stats_card_1 = require("@/components/admin/stats-card");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
function AdminDashboard() {
    const [stats, setStats] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/admin/stats");
                const { data } = await response.json();
                setStats(data);
            }
            catch (error) {
                console.error("Failed to fetch stats:", error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);
    return (<div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your blog admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (<>
            <stats_card_1.StatsCard.Skeleton />
            <stats_card_1.StatsCard.Skeleton />
            <stats_card_1.StatsCard.Skeleton />
            <stats_card_1.StatsCard.Skeleton />
          </>) : (<>
            <stats_card_1.StatsCard title="Published Posts" value={stats?.publishedPosts ?? 0} description="Total published blog posts" icon={lucide_react_1.FileText}/>
            <stats_card_1.StatsCard title="Draft Posts" value={stats?.draftPosts ?? 0} description="Total draft blog posts" icon={lucide_react_1.Edit}/>
            <stats_card_1.StatsCard title="Categories" value={stats?.totalCategories ?? 0} description="Total blog categories" icon={lucide_react_1.FolderOpen}/>
            <stats_card_1.StatsCard title="Tags" value={stats?.totalTags ?? 0} description="Total blog tags" icon={lucide_react_1.Tags}/>
          </>)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Recent Activity</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <p className="text-muted-foreground">Activity tracking will be implemented in a future update.</p>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Quick Actions</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-2">
            <div className="grid gap-2">
              <a href="/admin/posts/new" className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                <lucide_react_1.FileText className="h-4 w-4"/>
                Create New Post
              </a>
              <a href="/admin/categories" className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                <lucide_react_1.FolderOpen className="h-4 w-4"/>
                Manage Categories
              </a>
              <a href="/admin/tags" className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                <lucide_react_1.Tags className="h-4 w-4"/>
                Manage Tags
              </a>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}

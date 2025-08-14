"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminPostsPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const lucide_react_1 = require("lucide-react");
const blog_api_1 = require("@/lib/blog-api");
function AdminPostsPage() {
    const [posts, setPosts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [statusFilter, setStatusFilter] = (0, react_1.useState)("all");
    (0, react_1.useEffect)(() => {
        loadPosts();
    }, [statusFilter]);
    const loadPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await (0, blog_api_1.getBlogPosts)({
                status: statusFilter === "all" ? undefined : statusFilter,
            });
            setPosts(fetchedPosts);
        }
        catch (error) {
            console.error("Error loading posts:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()));
    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return "bg-green-500/10 text-green-500";
            case "draft":
                return "bg-yellow-500/10 text-yellow-500";
            case "archived":
                return "bg-gray-500/10 text-gray-500";
            default:
                return "bg-gray-500/10 text-gray-500";
        }
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <link_1.default href="/admin/posts/new">
          <button_1.Button>
            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
            New Post
          </button_1.Button>
        </link_1.default>
      </div>

      <card_1.Card>
        <card_1.CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <input_1.Input placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <select_1.Select value={statusFilter} onValueChange={setStatusFilter}>
              <select_1.SelectTrigger className="w-full sm:w-48">
                <select_1.SelectValue />
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectItem value="all">All Status</select_1.SelectItem>
                <select_1.SelectItem value="published">Published</select_1.SelectItem>
                <select_1.SelectItem value="draft">Draft</select_1.SelectItem>
                <select_1.SelectItem value="archived">Archived</select_1.SelectItem>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          {loading ? (<div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded"></div>
                </div>))}
            </div>) : filteredPosts.length === 0 ? (<div className="text-center py-8">
              <p className="text-muted-foreground">No posts found.</p>
            </div>) : (<div className="space-y-4">
              {filteredPosts.map((post) => (<div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <badge_1.Badge className={getStatusColor(post.status)}>{post.status}</badge_1.Badge>
                      {post.blog_categories && (<badge_1.Badge variant="outline" className="text-xs">
                          {post.blog_categories.name}
                        </badge_1.Badge>)}
                    </div>
                    {post.excerpt && <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                      {post.published_at && <span>Published: {new Date(post.published_at).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {post.status === "published" && (<link_1.default href={`/blog/${post.slug}`}>
                        <button_1.Button variant="ghost" size="sm">
                          <lucide_react_1.Eye className="h-4 w-4"/>
                        </button_1.Button>
                      </link_1.default>)}
                    <link_1.default href={`/admin/posts/${post.id}/edit`}>
                      <button_1.Button variant="ghost" size="sm">
                        <lucide_react_1.Edit className="h-4 w-4"/>
                      </button_1.Button>
                    </link_1.default>
                    <button_1.Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <lucide_react_1.Trash2 className="h-4 w-4"/>
                    </button_1.Button>
                  </div>
                </div>))}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}

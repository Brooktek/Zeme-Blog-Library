"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostList = BlogPostList;
const react_1 = require("react");
const blog_post_card_1 = require("./blog-post-card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const blog_api_1 = require("@/lib/blog-api");
function BlogPostList({ initialPosts = [], initialCategories = [], showFilters = true, limit, }) {
    const [posts, setPosts] = (0, react_1.useState)(initialPosts);
    const [categories, setCategories] = (0, react_1.useState)(initialCategories);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)("");
    const [showFiltersPanel, setShowFiltersPanel] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (initialPosts.length === 0) {
            loadPosts();
        }
        if (initialCategories.length === 0) {
            loadCategories();
        }
    }, []);
    const loadPosts = async () => {
        setLoading(true);
        try {
            const fetchedPosts = await (0, blog_api_1.getBlogPosts)({
                limit,
                category: selectedCategory || undefined,
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
    const loadCategories = async () => {
        try {
            const fetchedCategories = await (0, blog_api_1.getBlogCategories)();
            setCategories(fetchedCategories);
        }
        catch (error) {
            console.error("Error loading categories:", error);
        }
    };
    (0, react_1.useEffect)(() => {
        loadPosts();
    }, [selectedCategory]);
    const filteredPosts = posts.filter((post) => {
        const matchesSearch = searchTerm === "" ||
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });
    const featuredPost = filteredPosts[0];
    const regularPosts = filteredPosts.slice(1);
    return (<div className="space-y-8">
      {showFilters && (<div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <lucide_react_1.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <input_1.Input placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <button_1.Button variant="outline" onClick={() => setShowFiltersPanel(!showFiltersPanel)} className="sm:w-auto">
              <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
              Filters
            </button_1.Button>
          </div>

          {showFiltersPanel && (<div className="p-4 border rounded-lg bg-card space-y-4">
              <div>
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <badge_1.Badge variant={selectedCategory === "" ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory("")}>
                    All
                  </badge_1.Badge>
                  {categories.map((category) => (<badge_1.Badge key={category.id} variant={selectedCategory === category.slug ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(category.slug)}>
                      {category.name}
                    </badge_1.Badge>))}
                </div>
              </div>
            </div>)}
        </div>)}

      {loading ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="animate-pulse">
              <div className="bg-muted h-48 rounded-t-lg"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>))}
        </div>) : filteredPosts.length === 0 ? (<div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No posts found.</p>
        </div>) : (<div className="space-y-8">
          {featuredPost && (<div>
              <h2 className="text-2xl font-bold mb-6">Featured Post</h2>
              <blog_post_card_1.BlogPostCard post={featuredPost} variant="featured"/>
            </div>)}

          {regularPosts.length > 0 && (<div>
              <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (<blog_post_card_1.BlogPostCard key={post.id} post={post}/>))}
              </div>
            </div>)}
        </div>)}
    </div>);
}

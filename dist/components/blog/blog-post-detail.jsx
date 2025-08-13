"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostDetail = BlogPostDetail;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const separator_1 = require("@/components/ui/separator");
const lucide_react_1 = require("lucide-react");
const blog_post_card_1 = require("./blog-post-card");
const blog_api_1 = require("@/lib/blog-api");
function BlogPostDetail({ slug }) {
    const [post, setPost] = (0, react_1.useState)(null);
    const [relatedPosts, setRelatedPosts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        loadPost();
    }, [slug]);
    const loadPost = async () => {
        setLoading(true);
        try {
            const fetchedPost = await (0, blog_api_1.getBlogPost)(slug);
            setPost(fetchedPost);
            if (fetchedPost) {
                loadRelatedPosts(fetchedPost);
            }
        }
        catch (error) {
            console.error("Error loading post:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const loadRelatedPosts = async (currentPost) => {
        try {
            const related = await (0, blog_api_1.getRelatedPosts)(currentPost.id, currentPost.blog_categories?.id);
            setRelatedPosts(related);
        }
        catch (error) {
            console.error("Error loading related posts:", error);
        }
    };
    const handleShare = async () => {
        if (navigator.share && post) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt || "",
                    url: window.location.href,
                });
            }
            catch (error) {
                console.log("Error sharing:", error);
            }
        }
        else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
        }
    };
    if (loading) {
        return (<div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="h-4 bg-muted rounded"></div>))}
          </div>
        </div>
      </div>);
    }
    if (!post) {
        return (<div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <link_1.default href="/blog">
          <button_1.Button>
            <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
            Back to Blog
          </button_1.Button>
        </link_1.default>
      </div>);
    }
    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null;
    return (<article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <link_1.default href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <lucide_react_1.ArrowLeft className="h-4 w-4 mr-2"/>
          Back to Blog
        </link_1.default>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {publishedDate && (<div className="flex items-center gap-1">
                <lucide_react_1.Calendar className="h-4 w-4"/>
                <span>{publishedDate}</span>
              </div>)}
            {post.reading_time > 0 && (<div className="flex items-center gap-1">
                <lucide_react_1.Clock className="h-4 w-4"/>
                <span>{post.reading_time} min read</span>
              </div>)}
            <button_1.Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
              <lucide_react_1.Share2 className="h-4 w-4 mr-2"/>
              Share
            </button_1.Button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>

          {post.excerpt && <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>}

          <div className="flex flex-wrap gap-2">
            {post.blog_categories && (<badge_1.Badge variant="secondary" className="bg-primary/10 text-primary">
                {post.blog_categories.name}
              </badge_1.Badge>)}

            {post.blog_post_tags?.map((tagRelation) => (<badge_1.Badge key={tagRelation.blog_tags.id} variant="outline">
                {tagRelation.blog_tags.name}
              </badge_1.Badge>))}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image_url && (<div className="mb-8 overflow-hidden rounded-lg">
          <img src={post.featured_image_url || "/placeholder.svg"} alt={post.title} className="w-full h-64 md:h-96 object-cover"/>
        </div>)}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }}/>
      </div>

      <separator_1.Separator className="my-12"/>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (<div>
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (<blog_post_card_1.BlogPostCard key={relatedPost.id} post={relatedPost}/>))}
          </div>
        </div>)}
    </article>);
}

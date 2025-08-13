"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostCard = BlogPostCard;
const link_1 = __importDefault(require("next/link"));
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
function BlogPostCard({ post, variant = "default" }) {
    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null;
    return (<card_1.Card className={`group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border ${variant === "featured" ? "md:col-span-2 lg:col-span-3" : ""}`}>
      {post.featured_image_url && (<div className={`overflow-hidden ${variant === "featured" ? "h-64" : "h-48"}`}>
          <img src={post.featured_image_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        </div>)}

      <card_1.CardHeader className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {publishedDate && (<div className="flex items-center gap-1">
              <lucide_react_1.Calendar className="h-4 w-4"/>
              <span>{publishedDate}</span>
            </div>)}
          {post.reading_time > 0 && (<>
              <span>•</span>
              <div className="flex items-center gap-1">
                <lucide_react_1.Clock className="h-4 w-4"/>
                <span>{post.reading_time} min read</span>
              </div>
            </>)}
        </div>

        <div className="space-y-2">
          <link_1.default href={`/blog/${post.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className={`font-bold leading-tight ${variant === "featured" ? "text-2xl md:text-3xl" : "text-xl"}`}>
              {post.title}
            </h3>
          </link_1.default>

          {post.excerpt && (<p className={`text-muted-foreground leading-relaxed ${variant === "featured" ? "text-lg" : "text-base"}`}>
              {post.excerpt}
            </p>)}
        </div>
      </card_1.CardHeader>

      <card_1.CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.blog_categories && (<badge_1.Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {post.blog_categories.name}
            </badge_1.Badge>)}

          {post.blog_post_tags?.slice(0, 3).map((tagRelation) => (<badge_1.Badge key={tagRelation.blog_tags.id} variant="outline" className="text-xs">
              {tagRelation.blog_tags.name}
            </badge_1.Badge>))}

          {post.blog_post_tags && post.blog_post_tags.length > 3 && (<badge_1.Badge variant="outline" className="text-xs">
              +{post.blog_post_tags.length - 3} more
            </badge_1.Badge>)}
        </div>

        <link_1.default href={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Read more →
        </link_1.default>
      </card_1.CardContent>
    </card_1.Card>);
}

"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewPostPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const post_form_1 = require("@/components/admin/post-form");
const client_1 = require("@/lib/supabase/client");
function NewPostPage() {
    const router = (0, navigation_1.useRouter)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Calculate reading time (rough estimate: 200 words per minute)
            const wordCount = data.content.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200);
            const { error: postError } = await client_1.supabase
                .from("blog_posts")
                .insert({
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt || null,
                content: data.content,
                featured_image_url: data.featured_image_url || null,
                category_id: data.category_id || null,
                status: data.status,
                published_at: data.status === "published" ? new Date().toISOString() : null,
                meta_title: data.meta_title || null,
                meta_description: data.meta_description || null,
                reading_time: readingTime,
            })
                .select()
                .single();
            if (postError)
                throw postError;
            // Add tags if any
            if (data.tag_ids.length > 0) {
                const { data: newPost } = await client_1.supabase.from("blog_posts").select("id").eq("slug", data.slug).single();
                if (newPost) {
                    const tagRelations = data.tag_ids.map((tagId) => ({
                        post_id: newPost.id,
                        tag_id: tagId,
                    }));
                    await client_1.supabase.from("blog_post_tags").insert(tagRelations);
                }
            }
            router.push("/admin/posts");
        }
        catch (error) {
            console.error("Error creating post:", error);
            alert("Error creating post. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">Write and publish a new blog post</p>
      </div>

      <post_form_1.PostForm onSubmit={handleSubmit} isLoading={isLoading}/>
    </div>);
}

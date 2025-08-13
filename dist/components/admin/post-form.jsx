"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostForm = PostForm;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const select_1 = require("@/components/ui/select");
const badge_1 = require("@/components/ui/badge");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const blog_api_1 = require("@/lib/blog-api");
function PostForm({ post, onSubmit, isLoading = false }) {
    const router = (0, navigation_1.useRouter)();
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [tags, setTags] = (0, react_1.useState)([]);
    const [selectedTags, setSelectedTags] = (0, react_1.useState)([]);
    const [newTag, setNewTag] = (0, react_1.useState)("");
    const [formData, setFormData] = (0, react_1.useState)({
        title: post?.title || "",
        slug: post?.slug || "",
        excerpt: post?.excerpt || "",
        content: post?.content || "",
        featured_image_url: post?.featured_image_url || "",
        category_id: post?.blog_categories?.id || "",
        status: post?.status || "draft",
        meta_title: post?.meta_title || "",
        meta_description: post?.meta_description || "",
        tag_ids: post?.blog_post_tags?.map((pt) => pt.blog_tags.id) || [],
    });
    (0, react_1.useEffect)(() => {
        loadCategories();
        loadTags();
        if (post?.blog_post_tags) {
            setSelectedTags(post.blog_post_tags.map((pt) => pt.blog_tags.id));
        }
    }, [post]);
    const loadCategories = async () => {
        const fetchedCategories = await (0, blog_api_1.getBlogCategories)();
        setCategories(fetchedCategories);
    };
    const loadTags = async () => {
        const fetchedTags = await (0, blog_api_1.getBlogTags)();
        setTags(fetchedTags);
    };
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };
    const handleTitleChange = (title) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title),
        }));
    };
    const addTag = (tagId) => {
        if (!selectedTags.includes(tagId)) {
            const newSelectedTags = [...selectedTags, tagId];
            setSelectedTags(newSelectedTags);
            setFormData((prev) => ({ ...prev, tag_ids: newSelectedTags }));
        }
    };
    const removeTag = (tagId) => {
        const newSelectedTags = selectedTags.filter((id) => id !== tagId);
        setSelectedTags(newSelectedTags);
        setFormData((prev) => ({ ...prev, tag_ids: newSelectedTags }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(formData);
    };
    const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id));
    const availableTags = tags.filter((tag) => !selectedTags.includes(tag.id));
    return (<form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Post Content</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="title">Title</label_1.Label>
                <input_1.Input id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter post title..." required/>
              </div>

              <div>
                <label_1.Label htmlFor="slug">Slug</label_1.Label>
                <input_1.Input id="slug" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} placeholder="post-url-slug" required/>
              </div>

              <div>
                <label_1.Label htmlFor="excerpt">Excerpt</label_1.Label>
                <textarea_1.Textarea id="excerpt" value={formData.excerpt} onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Brief description of the post..." rows={3}/>
              </div>

              <div>
                <label_1.Label htmlFor="content">Content</label_1.Label>
                <textarea_1.Textarea id="content" value={formData.content} onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))} placeholder="Write your post content here..." rows={15} required/>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>SEO Settings</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="meta_title">Meta Title</label_1.Label>
                <input_1.Input id="meta_title" value={formData.meta_title} onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))} placeholder="SEO title (optional)"/>
              </div>

              <div>
                <label_1.Label htmlFor="meta_description">Meta Description</label_1.Label>
                <textarea_1.Textarea id="meta_description" value={formData.meta_description} onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))} placeholder="SEO description (optional)" rows={3}/>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Publish Settings</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div>
                <label_1.Label htmlFor="status">Status</label_1.Label>
                <select_1.Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue />
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="draft">Draft</select_1.SelectItem>
                    <select_1.SelectItem value="published">Published</select_1.SelectItem>
                    <select_1.SelectItem value="archived">Archived</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              <div>
                <label_1.Label htmlFor="category">Category</label_1.Label>
                <select_1.Select value={formData.category_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue placeholder="Select category"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    {categories.map((category) => (<select_1.SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </select_1.SelectItem>))}
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              <div>
                <label_1.Label htmlFor="featured_image">Featured Image URL</label_1.Label>
                <input_1.Input id="featured_image" value={formData.featured_image_url} onChange={(e) => setFormData((prev) => ({ ...prev, featured_image_url: e.target.value }))} placeholder="https://example.com/image.jpg"/>
              </div>
            </card_1.CardContent>
          </card_1.Card>

          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Tags</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              {selectedTagObjects.length > 0 && (<div className="flex flex-wrap gap-2">
                  {selectedTagObjects.map((tag) => (<badge_1.Badge key={tag.id} variant="secondary" className="gap-1">
                      {tag.name}
                      <button type="button" onClick={() => removeTag(tag.id)} className="ml-1 hover:text-destructive">
                        <lucide_react_1.X className="h-3 w-3"/>
                      </button>
                    </badge_1.Badge>))}
                </div>)}

              <select_1.Select onValueChange={addTag}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Add tags..."/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {availableTags.map((tag) => (<select_1.SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </select_1.SelectItem>))}
                </select_1.SelectContent>
              </select_1.Select>
            </card_1.CardContent>
          </card_1.Card>

          <div className="flex gap-2">
            <button_1.Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : post ? "Update Post" : "Create Post"}
            </button_1.Button>
            <button_1.Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </button_1.Button>
          </div>
        </div>
      </div>
    </form>);
}

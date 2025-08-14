"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewTagPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const blog_api_1 = require("@/lib/blog-api");
function NewTagPage() {
    const [name, setName] = (0, react_1.useState)("");
    const [slug, setSlug] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        setSlug(newName.toLowerCase().replace(/\s+/g, "-").slice(0, 200));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await (0, blog_api_1.createBlogTag)({ name, slug });
            router.push("/admin/tags");
        }
        catch (error) {
            console.error("Failed to create tag:", error);
            // Here you could show an error message to the user
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Tag</h1>
        <p className="text-muted-foreground">Create a new blog tag.</p>
      </div>
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle>Tag Details</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label_1.Label htmlFor="name">Name</label_1.Label>
              <input_1.Input id="name" value={name} onChange={handleNameChange} required/>
            </div>
            <div>
              <label_1.Label htmlFor="slug">Slug</label_1.Label>
              <input_1.Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required/>
              <p className="text-sm text-muted-foreground mt-1">The slug is the URL-friendly version of the name.</p>
            </div>
            <button_1.Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Tag"}
            </button_1.Button>
          </form>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}

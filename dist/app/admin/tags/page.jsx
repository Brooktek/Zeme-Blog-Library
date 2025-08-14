"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminTagsPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const blog_api_1 = require("@/lib/blog-api");
function AdminTagsPage() {
    const [tags, setTags] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        loadTags();
    }, []);
    const loadTags = async () => {
        setLoading(true);
        try {
            const fetchedTags = await (0, blog_api_1.getBlogTags)();
            setTags(fetchedTags);
        }
        catch (error) {
            console.error("Error loading tags:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this tag?")) {
            try {
                await (0, blog_api_1.deleteBlogTag)(id);
                loadTags(); // Refresh the list
            }
            catch (error) {
                console.error("Failed to delete tag:", error);
            }
        }
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground">Manage your blog tags</p>
        </div>
        <link_1.default href="/admin/tags/new">
          <button_1.Button>
            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
            New Tag
          </button_1.Button>
        </link_1.default>
      </div>

      <card_1.Card>
        <card_1.CardHeader>
          <h2 className="text-xl font-semibold">All Tags</h2>
        </card_1.CardHeader>
        <card_1.CardContent>
          {loading ? (<div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded"></div>
                </div>))}
            </div>) : tags.length === 0 ? (<div className="text-center py-8">
              <p className="text-muted-foreground">No tags found.</p>
            </div>) : (<div className="space-y-2">
              {tags.map((tag) => (<div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium">{tag.name}</h3>
                  <div className="flex items-center gap-2">
                    <link_1.default href={`/admin/tags/${tag.id}/edit`}>
                      <button_1.Button variant="ghost" size="sm">
                        <lucide_react_1.Edit className="h-4 w-4"/>
                      </button_1.Button>
                    </link_1.default>
                    <button_1.Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(tag.id)}>
                      <lucide_react_1.Trash2 className="h-4 w-4"/>
                    </button_1.Button>
                  </div>
                </div>))}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}

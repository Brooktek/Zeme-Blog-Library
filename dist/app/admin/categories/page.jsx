"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminCategoriesPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const blog_api_1 = require("@/lib/blog-api");
function AdminCategoriesPage() {
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        loadCategories();
    }, []);
    const loadCategories = async () => {
        setLoading(true);
        try {
            const fetchedCategories = await (0, blog_api_1.getBlogCategories)();
            setCategories(fetchedCategories);
        }
        catch (error) {
            console.error("Error loading categories:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await (0, blog_api_1.deleteBlogCategory)(id);
                loadCategories(); // Refresh the list
            }
            catch (error) {
                console.error("Failed to delete category:", error);
                // Optionally, show an error message to the user
            }
        }
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your blog categories</p>
        </div>
        <link_1.default href="/admin/categories/new">
          <button_1.Button>
            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
            New Category
          </button_1.Button>
        </link_1.default>
      </div>

      <card_1.Card>
        <card_1.CardHeader>
          <h2 className="text-xl font-semibold">All Categories</h2>
        </card_1.CardHeader>
        <card_1.CardContent>
          {loading ? (<div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded"></div>
                </div>))}
            </div>) : categories.length === 0 ? (<div className="text-center py-8">
              <p className="text-muted-foreground">No categories found.</p>
            </div>) : (<div className="space-y-2">
              {categories.map((category) => (<div key={category.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <link_1.default href={`/admin/categories/${category.slug}/edit`}>
                      <button_1.Button variant="ghost" size="sm">
                        <lucide_react_1.Edit className="h-4 w-4"/>
                      </button_1.Button>
                    </link_1.default>
                    <button_1.Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(category.id)}>
                      <lucide_react_1.Trash2 className="h-4 w-4"/>
                    </button_1.Button>
                  </div>
                </div>))}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}

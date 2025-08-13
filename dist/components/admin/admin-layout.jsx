"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLayout = AdminLayout;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const sheet_1 = require("@/components/ui/sheet");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const navigation = [
    { name: "Dashboard", href: "/admin", icon: lucide_react_1.LayoutDashboard },
    { name: "Posts", href: "/admin/posts", icon: lucide_react_1.FileText },
    { name: "Categories", href: "/admin/categories", icon: lucide_react_1.FolderOpen },
    { name: "Tags", href: "/admin/tags", icon: lucide_react_1.Tags },
    { name: "Settings", href: "/admin/settings", icon: lucide_react_1.Settings },
];
function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = (0, react_1.useState)(false);
    const pathname = (0, navigation_1.usePathname)();
    const Sidebar = ({ mobile = false }) => (<div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold">Blog Admin</h1>
      </div>

      <nav className="flex flex-1 flex-col p-4">
        <ul className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (<li key={item.name}>
                <link_1.default href={item.href} onClick={() => mobile && setSidebarOpen(false)} className={(0, utils_1.cn)("group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors", isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                  <item.icon className="h-5 w-5 shrink-0"/>
                  {item.name}
                </link_1.default>
              </li>);
        })}
        </ul>

        <div className="space-y-2">
          <link_1.default href="/blog" className="group flex gap-x-3 rounded-md p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <lucide_react_1.Eye className="h-5 w-5 shrink-0"/>
            View Blog
          </link_1.default>

          <button_1.Button variant="ghost" className="w-full justify-start gap-x-3 text-muted-foreground hover:text-foreground">
            <lucide_react_1.LogOut className="h-5 w-5 shrink-0"/>
            Sign Out
          </button_1.Button>
        </div>
      </nav>
    </div>);
    return (<sheet_1.Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar */}
        <sheet_1.SheetContent side="left" className="w-64 p-0 lg:hidden">
          <Sidebar mobile/>
        </sheet_1.SheetContent>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
          <div className="flex grow flex-col border-r border-border bg-card">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <sheet_1.SheetTrigger asChild>
              <button_1.Button variant="ghost" size="sm" className="lg:hidden">
                <lucide_react_1.Menu className="h-5 w-5"/>
                <span className="sr-only">Open sidebar</span>
              </button_1.Button>
            </sheet_1.SheetTrigger>
          </div>

          {/* Page content */}
          <main className="py-8">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </sheet_1.Sheet>);
}

// Main export file for the package
export * from "../components/blog/blog-post-card"
export * from "../components/blog/blog-post-list"
export * from "../components/blog/blog-post-detail"
export * from "../lib/blog-api"
export * from "../lib/supabase/client"
export * from "../lib/api-client"

// Types
export type {
  BlogPost,
  BlogCategory,
  BlogTag,
} from "../lib/supabase/client"

// Configuration types
export interface BlogConfig {
  title: string
  description: string
  postsPerPage: number
  enableComments: boolean
  enableSearch: boolean
  enableCategories: boolean
  enableTags: boolean
  theme: {
    primaryColor: string
    darkMode: boolean
  }
  seo: {
    defaultMetaTitle: string
    defaultMetaDescription: string
    twitterHandle: string
    ogImage: string
  }
}

// CLI exports for programmatic usage
export { installBlog } from "./cli/install"
export { initBlog } from "./cli/init"
export { addComponent } from "./cli/add"

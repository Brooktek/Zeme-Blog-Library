import { getBlogCategories, type BlogCategory } from "@/lib/blog-api"
import Link from "next/link"

export default async function CategoriesPage() {
  const categories: BlogCategory[] = await getBlogCategories()

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold">Categories</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.id}>
            <a className="block rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
              <h2 className="mb-2 text-2xl font-semibold">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

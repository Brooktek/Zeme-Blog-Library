import { getBlogCategory } from "@/lib/blog-api"
import { EditCategoryForm } from "./edit-category-form"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({ params }: { params: { slug: string } }) {
  const category = await getBlogCategory(params.slug)

  if (!category) {
    notFound()
  }

  return <EditCategoryForm category={category} />
}

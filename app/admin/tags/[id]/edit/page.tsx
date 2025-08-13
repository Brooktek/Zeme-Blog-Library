import { getBlogTag } from "@/lib/blog-api"
import { EditTagForm } from "./edit-tag-form"
import { notFound } from "next/navigation"

export default async function EditTagPage({ params }: { params: { id: string } }) {
  const tag = await getBlogTag(params.id)

  if (!tag) {
    notFound()
  }

  return <EditTagForm tag={tag} />
}

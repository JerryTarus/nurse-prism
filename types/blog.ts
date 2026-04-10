export type BlogAuthor = {
  name: string
  role: string
}

export type BlogPostStatus = "draft" | "scheduled" | "published" | "archived"

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readTimeMinutes: number
  publishedAt: string | null
  image: string | null
  tags: string[]
  author: BlogAuthor
  body: string
  status: BlogPostStatus
  createdAt: string
  updatedAt: string
}

export type BlogPostInput = {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  body: string
  image: string | null
  status: BlogPostStatus
  publishedAt: string | null
  readTimeMinutes: number
}

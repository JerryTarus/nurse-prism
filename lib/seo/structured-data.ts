import type { BlogPost } from "@/types/blog"
import type { FaqItem } from "@/data/faqs"
import { SITE_CONFIG } from "@/lib/constants"

import { getSiteUrl, toAbsoluteUrl } from "./metadata"

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: getSiteUrl(),
    email: SITE_CONFIG.email,
    sameAs: [
      SITE_CONFIG.linkedIn,
      SITE_CONFIG.facebook,
      SITE_CONFIG.instagram,
      SITE_CONFIG.x,
    ],
    logo: toAbsoluteUrl("/images/logos/nurse-prism-mark.svg"),
    description: SITE_CONFIG.description,
  }
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: getSiteUrl(),
    description: SITE_CONFIG.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${toAbsoluteUrl("/blog")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function createFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function createArticleSchema(post: BlogPost) {
  const publishedAt = post.publishedAt ?? post.createdAt
  const imagePath = post.image ?? "/images/hero/nurse-prism-hero.webp"

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [toAbsoluteUrl(imagePath)],
    datePublished: publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/images/logos/nurse-prism-mark.svg"),
      },
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
  }
}

export function createBlogCollectionSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_CONFIG.name} Blog`,
    description:
      "Insights on nurse career pivots, digital health, LinkedIn strategy, and global opportunity planning.",
    url: toAbsoluteUrl("/blog"),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: toAbsoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt ?? post.createdAt,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    })),
  }
}

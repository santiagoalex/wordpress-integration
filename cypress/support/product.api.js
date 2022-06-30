export default {
  sitemapAPI: baseUrl => {
    return `${baseUrl}/sitemap.xml`
  },
  blogPostAPI: baseUrl => {
    return `${baseUrl}/sitemap/blog-posts.xml`
  },
  blogPostCategoriesAPI: baseUrl => {
    return `${baseUrl}/sitemap/blog-categories.xml`
  },
}

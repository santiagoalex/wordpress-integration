/* eslint-disable @typescript-eslint/naming-convention */
export const tagResolvers = {
  wpPosts: async (
    { id, customDomain }: { id: number; customDomain: string },
    {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      offset,
      order,
      orderby,
      slug,
      status,
      categories,
      categories_exclude,
      sticky,
    }: {
      page: number
      per_page: number
      search: string
      after: string
      author: [number]
      author_exclude: [number]
      before: string
      exclude: [number]
      include: [number]
      offset: number
      order: string
      orderby: string
      slug: [string]
      status: [string]
      categories: [number]
      categories_exclude: [number]
      sticky: boolean
    },
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx

    const options = {
      page,
      per_page,
      search,
      after,
      author,
      author_exclude,
      before,
      exclude,
      include,
      offset,
      order,
      orderby,
      slug,
      status,
      categories,
      categories_exclude,
      tags: [id],
      sticky,
      customDomain,
    }

    const { headers, data } = await wordpressProxy.getPosts(options)
    const posts = data
    const total_count = headers['x-wp-total']
    const result = { posts, total_count }

    return result
  },
}

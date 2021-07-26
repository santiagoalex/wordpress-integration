import WordpressProxyDataSource from '../clients/wordpressProxy'

const postsWithTag = async (
  wordpressProxy: WordpressProxyDataSource,
  { page, per_page: perPage, search, customDomain }: any
) => {
  const { data: tags } = await wordpressProxy.getTags({
    slug: search,
    customDomain,
  })

  const total = tags.reduce((sum, tag) => sum + tag.count, 0)

  if (!total)
    return {
      pageOffset: 0,
      partialPage: 0,
      data: [],
      total: 0,
    }

  const pages = Math.ceil(total / perPage)
  const partialPage = perPage - (total % perPage)
  const tagIds = tags.map(tag => tag.id)

  if (page > pages) {
    return {
      pages,
      partialPage,
      tagIds,
      data: [],
      total,
    }
  }

  const { data } = await wordpressProxy.getPosts({
    page,
    per_page: perPage,
    tags: tagIds,
    customDomain,
  })

  return {
    pages,
    partialPage,
    tagIds,
    data,
    total,
  }
}
const postsWithContent = async (
  wordpressProxy: WordpressProxyDataSource,
  { page, per_page: perPage, search, customDomain }: any,
  { pages, partialPage, tagIds, data: tagPosts }: any
) => {
  const { headers, data } = await wordpressProxy.getPosts({
    page: Math.max(page - pages, 1),
    per_page: tagPosts.length ? partialPage : perPage,
    search,
    offset: tagPosts.length ? undefined : partialPage,
    tags_exclude: tagIds || undefined,
    customDomain,
  })

  const posts = tagPosts.length === perPage ? [] : data

  return { data: posts, total: Number(headers['x-wp-total']) }
}

const searchPostTagsAndContent = async (ctx: Context, query: any) => {
  const {
    clients: { wordpressProxy },
  } = ctx

  const tagSearchResult = await postsWithTag(wordpressProxy, query)
  const contentSearchResult = await postsWithContent(
    wordpressProxy,
    query,
    tagSearchResult
  )

  return {
    posts: [...tagSearchResult.data, ...contentSearchResult.data],
    total_count: tagSearchResult.total + contentSearchResult.total,
  }
}
export default searchPostTagsAndContent

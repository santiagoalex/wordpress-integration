import WordpressProxyDataSource from '../clients/wordpressProxy'

const postsWithTag = async (
  wordpressProxy: WordpressProxyDataSource,
  {
    page,
    per_page: perPage,
    search,
    customDomain,
    before,
    after,
    categories,
    tags: filterTag,
  }: any
) => {
  const { data: tags } = await wordpressProxy.getTags({
    slug: search,
    customDomain,
    include: filterTag,
  })
  let total = tags.reduce((sum, tag) => sum + tag.count, 0)

  if (!total)
    return {
      pageOffset: 0,
      partialPage: 0,
      data: [],
      total: 0,
    }

  const tagIds = tags.map(tag => tag.id)

  // get correct post total if filtered by date or categories
  if (before || after || categories) {
    const { headers: filteredHeaders } = await wordpressProxy.getPosts({
      search,
      tags: tagIds,
      customDomain,
      before,
      after,
      categories,
    })

    total = Number(filteredHeaders['x-wp-total'])
  }

  const pages = Math.ceil(total / perPage)
  const partialPage = perPage - (total % perPage)

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
    search,
    tags: tagIds,
    customDomain,
    before,
    after,
    categories,
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
  {
    page,
    per_page: perPage,
    search,
    customDomain,
    before,
    after,
    categories,
    tags,
  }: any,
  { pages, partialPage, tagIds, data: tagPosts }: any
) => {
  const contentPostPage = pages ? Math.max(page - pages, 1) : page
  const contentPerPage = tagPosts.length ? partialPage : perPage
  const postsOffset =
    (contentPostPage - 1) * contentPerPage + Number(partialPage)

  const { headers, data } = await wordpressProxy.getPosts({
    page: contentPostPage === 1 ? 1 : undefined,
    per_page: contentPerPage,
    search,
    offset: tagPosts.length ? undefined : postsOffset,
    tags_exclude: tagIds || undefined,
    customDomain,
    before,
    after,
    categories,
    tags,
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

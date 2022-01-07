/* eslint-disable @typescript-eslint/camelcase */
export const pageResolvers = {
  author: async (
    { author, customDomain }: { author: number; customDomain: string },
    _: any,
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    try {
      return await wordpressProxy.getUser(author, customDomain)
    } catch (e) {
      return console.error(`${e.name}: ${e.message}`)
    }
  },
  featured_media: async (
    {
      featured_media,
      customDomain,
    }: { featured_media: number; customDomain: string },
    _: any,
    ctx: Context
  ) => {
    const {
      clients: { wordpressProxy },
    } = ctx
    if (featured_media > 0) {
      try {
        return await wordpressProxy.getMediaSingle(featured_media, customDomain)
      } catch (e) {
        return console.error(`${e.name}: ${e.message}`)
      }
    } else {
      return null
    }
  },
}

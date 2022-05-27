/* eslint-disable @typescript-eslint/camelcase */
import { LogLevel, method, Binding } from '@vtex/api'

import { getStoreBindings } from '../utils/bindings'
import { queries } from './index'

const API_MAX_QUANTITY = 100

const isValidBaseAddress = (address: string) => {
  return address.indexOf('myvtex') === -1 && address.indexOf('http') === -1
}

const getBaseUrl = async (ctx: Context) => {
  const host = ctx.get('x-forwarded-host')
  const rootPath = ctx.get('x-vtex-root-path')
  const storeBindings = await getStoreBindings(ctx.clients.tenant)

  const storeBinding =
    storeBindings.length > 1
      ? storeBindings.find(
          (binding: Binding) => binding.canonicalBaseAddress === host + rootPath
        )
      : storeBindings[0]

  const { canonicalBaseAddress } = storeBinding as Binding

  const baseUrl = isValidBaseAddress(canonicalBaseAddress)
    ? String(canonicalBaseAddress)
    : String(ctx.vtex.host)

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

const buildSitemap = (entries: string[]) => {
  return `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${
    entries.length ? entries.join('') : ''
  }</urlset>`
}

const buildEntries = ({
  entries,
  date,
  baseUrl,
  path,
}: {
  entries: Array<WpCategory | WpPost> | null
  date: string
  baseUrl: string
  path: string
}) => {
  if (!entries) return []

  return entries.map(
    entry => `<url>
			<loc>https://${baseUrl}${path}${entry.slug}</loc>
			<lastmod>${date}</lastmod>
			<changefreq>monthly</changefreq>
			<priority>0.7</priority>
			</url>`
  )
}

export const routes = {
  postsSitemap: method({
    GET: async (ctx: Context) => {
      const path = await ctx.clients.storeRoutes.getPath('store.blog-post')
      const baseUrl = await getBaseUrl(ctx)
      const sitemapContent = []

      if (path) {
        const quantity = API_MAX_QUANTITY
        const date = new Date().toISOString()

        let page = 1
        let total = 0
        let runningTotal = 0

        try {
          do {
            // eslint-disable-next-line no-await-in-loop
            const response = await queries.wpPosts(
              null,
              {
                page,
                per_page: quantity,
                order: 'desc',
                orderby: 'date',
                status: ['publish'],
              },
              ctx
            )

            const entries = buildEntries({
              entries: response?.posts,
              baseUrl,
              date,
              path,
            })

            sitemapContent.push(...entries)

            total = parseInt(response?.total_count, 10) || 0
            runningTotal += API_MAX_QUANTITY
            page += 1
          } while (total > runningTotal)
        } catch (err) {
          ctx.vtex.logger.log(err, LogLevel.Error)
        }
      }

      ctx.set('Content-Type', 'text/xml')
      ctx.body = buildSitemap(sitemapContent)
      ctx.status = 200
    },
  }),
  categoriesSitemap: method({
    GET: async (ctx: Context) => {
      const path = await ctx.clients.storeRoutes.getPath('store.blog-category')
      const baseUrl = await getBaseUrl(ctx)
      const sitemapContent = []

      if (path) {
        const quantity = API_MAX_QUANTITY
        const date = new Date().toISOString()
        let page = 1
        let total = 0
        let runningTotal = 0

        try {
          do {
            // eslint-disable-next-line no-await-in-loop
            const response = await queries.wpCategories(
              null,
              {
                page,
                per_page: quantity,
                order: 'desc',
                orderby: 'name',
                hide_empty: true,
              },
              ctx
            )

            const entries = buildEntries({
              entries: response?.categories,
              baseUrl,
              date,
              path,
            })

            sitemapContent.push(...entries)

            total = parseInt(response?.total_count, 10) || 0
            runningTotal += API_MAX_QUANTITY
            page += 1
          } while (total > runningTotal)
        } catch (err) {
          ctx.vtex.logger.log(err, LogLevel.Error)
        }
      }

      ctx.set('Content-Type', 'text/xml')
      ctx.body = buildSitemap(sitemapContent)
      ctx.status = 200
    },
  }),
}

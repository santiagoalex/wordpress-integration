import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

type BlogPage = 'store.blog-post' | 'store.blog-category'
interface PagesRuntime {
  pages: {
    [key: string]: {
      allowConditions: boolean
      context: unknown
      declarer: string
      path: string
      routeId: string
      blockId: string
      map: unknown
    }
  }
}

export default class StoreRoutes extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, options)
  }

  public async getPath(page: BlogPage) {
    const workspace = this.context.production
      ? ''
      : `${this.context.workspace}--`

    try {
      const routes = await this.http.get<PagesRuntime>(
        `http://${workspace}${this.context.account}.myvtex.com/?__pickRuntime=pages`,
        {
          headers: {
            'X-Vtex-Use-Https': true,
            Cookie: `VtexIdclientAutCookie=${this.context.authToken}`,
          },
        }
      )

      const route = routes.pages[page].path
      const [path] = route.split(':')

      return path
    } catch (error) {
      return ''
    }
  }
}

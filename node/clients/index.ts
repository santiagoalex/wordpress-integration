import type { ClientsConfig } from '@vtex/api'
import { IOClients, LRUCache } from '@vtex/api'

import Sitemap from './sitemap'
import StoreRoutes from './storeRoutes'
import WordpressProxyDataSource from './wordpressProxy'

const TIMEOUT_MS = 15000

const defaultClientOptions = {
  retries: 2,
  timeout: TIMEOUT_MS,
}

const cacheStorage = new LRUCache<string, any>({ max: 5000 })

// eslint-disable-next-line no-undef
metrics.trackCache('wordpressProxy', cacheStorage)

export class Clients extends IOClients {
  public get wordpressProxy() {
    return this.getOrSet('wordpressProxy', WordpressProxyDataSource)
  }

  public get storeRoutes() {
    return this.getOrSet('storeRoutes', StoreRoutes)
  }

  public get sitemap() {
    return this.getOrSet('sitemap', Sitemap)
  }
}

export const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: defaultClientOptions,
    wordpressProxy: {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Vtex-Use-Https': 'true',
      },
      memoryCache: cacheStorage,
    },
  },
}

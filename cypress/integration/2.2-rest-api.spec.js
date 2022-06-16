import { testSetup } from '../support/common/support'
import {
  verifySitemap,
  verifySitemapBlogCategories,
  verifySitemapBlogpost,
} from '../support/wordpress-integration.api'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import { appDetails } from '../support/wordpress.outputvalidation'

const { app, version, endpoint } = appDetails

describe('Rest API', () => {
  testSetup()
  configureTargetWorkspace(
    app,
    version,
    endpoint,
    false,
    false,
    false,
    true,
    false,
    false,
    false
  )
  verifySitemap()
  verifySitemapBlogpost()
  verifySitemapBlogCategories()
})

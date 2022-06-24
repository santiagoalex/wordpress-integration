import { preserveCookie, testSetup } from '../support/common/support'
import {
  verifySitemap,
  verifySitemapBlogCategories,
  verifySitemapBlogpost,
} from '../support/wordpress-integration.api'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import { appDetails } from '../support/wordpress.outputvalidation'

const { endpoint, titleTag } = appDetails

describe('Rest API', () => {
  testSetup()
  configureTargetWorkspace(endpoint, titleTag, {
    bindingBounded: true,
    displayShowRowsText: true,
    ignoreRobotsMetaTag: true,
    initializeSitemap: true,
    filterByCategories: true,
    filterByTags: true,
    filterByDate: true,
  })
  verifySitemap()
  verifySitemapBlogpost()
  verifySitemapBlogCategories()
  preserveCookie()
})

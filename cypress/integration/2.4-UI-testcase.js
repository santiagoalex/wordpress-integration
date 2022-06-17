import {
  testSetup,
  preserveCookie,
  updateRetry,
} from '../support/common/support'
import { appDetails } from '../support/wordpress.outputvalidation'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import {
  verifyHomePageAndTitle,
  verifyPostsAndPagination,
  verifyLatestPostsAndCategoriesLink,
  verifyBreadcrumbsAndSlugUrl,
  verifyPostNotFound,
} from '../support/wordpress.common'

const { endpoint, titleTag } = appDetails
describe('Testing', () => {
  // Load test setup
  testSetup()

  configureTargetWorkspace(endpoint, titleTag, { displayShowRowsText: true })

  it('Verify Home Page & Title', () => {
    verifyHomePageAndTitle()
  })

  it('verify slug on pagination url', updateRetry(3), () => {
    verifyBreadcrumbsAndSlugUrl()
  })

  it('Verify User is able to see posts per page text in pagination & Latest post has link to categories', () => {
    verifyPostsAndPagination()
  })

  it('Verify Latest Post has link to categories & pagination works fine in categories', () => {
    verifyLatestPostsAndCategoriesLink()
  })

  it('Verify Latest Post has link to categories & pagination works fine in categories', () => {
    verifyPostNotFound()
  })

  preserveCookie()
})

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
  verifyLayoutLatestPosts,
} from '../support/wordpress.common'

const { endpoint, titleTag } = appDetails

describe('UI-testcase', () => {
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

  it('Verify Layout- Latest post should be shown in two columns', () => {
    verifyLayoutLatestPosts()
  })

  it('Verify Latest Post has link to categories & pagination works fine in categories', () => {
    verifyLatestPostsAndCategoriesLink()
  })

  it('Verify Post Not Found', () => {
    verifyPostNotFound()
  })

  preserveCookie()
})

import {
  testSetup,
  preserveCookie,
  updateRetry,
} from '../support/common/support'
import {
  verifyHomePageAndTitle,
  verifyPostsAndPagination,
  verifyLatestPostsAndCategoriesLink,
  verifyBreadcrumbsAndSlugUrl,
  verifyPostNotFound,
  verifyLayoutLatestPosts,
} from '../support/wordpress.common'

const prefix = 'UI'

describe('UI-testcase', () => {
  // Load test setup
  testSetup()

  it(`${prefix} - Verify Home Page & Title`, updateRetry(3), () => {
    verifyHomePageAndTitle()
  })

  it(`${prefix} - Verify slug on pagination url`, updateRetry(3), () => {
    verifyBreadcrumbsAndSlugUrl()
  })

  it(
    `${prefix} - Verify User is able to see posts per page text in pagination & Latest post has link to categories`,
    updateRetry(3),
    () => {
      verifyPostsAndPagination()
    }
  )

  it(
    `${prefix} - Verify Layout- Latest post should be shown in two columns`,
    updateRetry(3),
    () => {
      verifyLayoutLatestPosts()
    }
  )

  it(
    `${prefix} - Verify Latest Post has link to categories & pagination works fine in categories`,
    updateRetry(3),
    () => {
      verifyLatestPostsAndCategoriesLink()
    }
  )

  it(`${prefix} - Verify Post Not Found`, updateRetry(3), () => {
    verifyPostNotFound()
  })

  preserveCookie()
})

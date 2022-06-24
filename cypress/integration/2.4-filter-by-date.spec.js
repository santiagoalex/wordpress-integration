import {
  testSetup,
  preserveCookie,
  updateRetry,
} from '../support/common/support'
import {
  verifyFilterByDate,
  selectDateAndVerify,
  verifyBreadcrumbsAndSlugUrl,
} from '../support/wordpress.common'

const prefix = 'Filter by date'

describe('Filter By Date', () => {
  // Load test setup
  testSetup()

  it(
    `${prefix} - Verify Filter by date option is displaying`,
    updateRetry(3),
    () => {
      verifyFilterByDate()
    }
  )

  it(
    `${prefix} - Select date & verify list is showing up between given date`,
    updateRetry(3),
    () => {
      selectDateAndVerify()
    }
  )

  it(`${prefix} - Verify slug on pagination url`, updateRetry(3), () => {
    verifyBreadcrumbsAndSlugUrl()
  })

  preserveCookie()
})

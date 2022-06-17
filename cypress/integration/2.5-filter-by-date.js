import {
  testSetup,
  preserveCookie,
  updateRetry,
} from '../support/common/support'
import { appDetails } from '../support/wordpress.outputvalidation'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import {
  verifyFilterByDate,
  selectDateAndVerify,
  disableFilterByDate,
  verifyBreadcrumbsAndSlugUrl,
} from '../support/wordpress.common'

const { endpoint, titleTag } = appDetails
describe('Testing', () => {
  // Load test setup
  testSetup()

  configureTargetWorkspace(endpoint, titleTag, { filterByDate: true })

  it('Verify Filter by date option is displaying', () => {
    verifyFilterByDate()
  })

  it('Select date & verify list is showing up between given date', () => {
    selectDateAndVerify()
  })

  configureTargetWorkspace(endpoint, titleTag)

  it('Verify Filter by date option is not displaying', () => {
    disableFilterByDate()
  })

  it('verify slug on pagination url', updateRetry(3), () => {
    verifyBreadcrumbsAndSlugUrl()
  })

  preserveCookie()
})

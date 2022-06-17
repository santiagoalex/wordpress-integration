import { testSetup, preserveCookie } from '../support/common/support'
import { appDetails } from '../support/wordpress.outputvalidation'
import { configureTargetWorkspace } from '../support/wordpress.apis'

const { endpoint, titleTag } = appDetails
describe('Testing', () => {
  // Load test setup
  testSetup()

  configureTargetWorkspace(endpoint, titleTag)

  preserveCookie()
})

import { testSetup, preserveCookie } from '../support/common/support'
import { appDetails } from '../support/wordpress.outputvalidation'
import { configureTargetWorkspace } from '../support/wordpress.apis'

const { app, version, endpoint } = appDetails
describe('Testing', () => {
  // Load test setup
  testSetup()

  configureTargetWorkspace(
    app,
    version,
    endpoint,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  )

  preserveCookie()
})

import { testSetup, preserveCookie } from '../support/common/support'
import { appDetails } from '../support/wordpress.outputvalidation'
import { configureTargetWorkspace } from '../support/wordpress.apis'

const { endpoint, titleTag } = appDetails

describe('Configure wordpress via Graphql', () => {
  // Load test setup
  testSetup()

  configureTargetWorkspace(endpoint, titleTag, { initializeSitemap: true })

  preserveCookie()
})

import {
  preserveCookie,
  testSetup,
  updateRetry,
} from '../support/common/support'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import { disableFilterByDate } from '../support/wordpress.common'
import { appDetails } from '../support/wordpress.outputvalidation'
import wordpressSelectors from '../support/wordpress.selectors'

const { endpoint, titleTag } = appDetails
const prefix = 'Disable Config'

describe('Disable configuration settings and validate', () => {
  testSetup()

  configureTargetWorkspace(endpoint, titleTag)

  it(
    `${prefix} - Disable the filter by tags option from configuration and verify the filter option is not displaying`,
    updateRetry(3),
    () => {
      cy.openStoreFront()
      cy.get(wordpressSelectors.BlogPage).click()
      cy.get(wordpressSelectors.SearchArticle)
        .should('be.visible')
        .type('tags {enter}')
      cy.get(wordpressSelectors.DropdownTag).should('not.exist')
    }
  )

  it(
    `${prefix} - Verify Filter by date option is not displaying`,
    updateRetry(3),
    () => {
      disableFilterByDate()
    }
  )

  it(`${prefix} - category filter is not displaying`, updateRetry(3), () => {
    cy.get(wordpressSelectors.BlogPage).click()
    cy.get(wordpressSelectors.CategoryContainer).should('not.exist')
  })

  preserveCookie()
})

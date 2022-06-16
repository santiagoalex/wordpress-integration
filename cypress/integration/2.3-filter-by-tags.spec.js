import {
  preserveCookie,
  testSetup,
  updateRetry,
} from '../support/common/support'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import { appDetails } from '../support/wordpress.outputvalidation'
import wordpresspost from '../support/wordpress-integration.post'
import wordpressSelectors from '../support/wordpressintegrationSelectors'

const { app, version, endpoint } = appDetails

describe('Filter By Tags', () => {
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
    true,
    false
  )
  it(
    'Go to  blog page and verify filter by tag option is displaying',
    updateRetry(3),
    () => {
      cy.openStoreFront()
      cy.get(wordpressSelectors.BlogPage).click()
      cy.get(wordpressSelectors.SearchArticle).should('be.visible')
      cy.get(wordpressSelectors.DropdownTag).scrollIntoView()
    }
  )

  it('select any tag and verify tag option is working', updateRetry(3), () => {
    cy.get(wordpressSelectors.DropdownTag).select('#1 ball in golf')
    cy.get(wordpresspost.oneBallInGolf.link).should('be.visible')
    cy.get(wordpressSelectors.DropdownTag).select("father's day")
    cy.get(wordpresspost.fathersDay.link).should('be.visible')
    cy.get(wordpressSelectors.DropdownTag).select("mother's day")
    cy.get(wordpresspost.mothersDay.link).should('be.visible')
  })

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
  it(
    'Disable the filter by tags option from configuration and verify the filter option is not displaying',
    updateRetry(3),
    () => {
      cy.openStoreFront()
      cy.get(wordpressSelectors.BlogPage).click()
      cy.get(wordpressSelectors.SearchArticle)
        .should('be.visible')
        .type('tags {enter}')
      /* eslint-disable cypress/no-unnecessary-waiting */
      cy.wait(500)
      /* eslint-disable cypress/no-unnecessary-waiting */
      cy.wait(6000)
      cy.get(wordpressSelectors.DropdownTag).should('not.exist')
    }
  )
  preserveCookie()
})

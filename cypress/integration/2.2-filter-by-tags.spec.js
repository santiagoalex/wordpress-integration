import {
  preserveCookie,
  testSetup,
  updateRetry,
} from '../support/common/support'
import wordpresspost from '../support/wordpress-integration.post'
import wordpressSelectors from '../support/wordpress.selectors'

const prefix = 'Filter by tags'

describe('Filter By Tags', () => {
  testSetup()

  it(
    `${prefix} - Go to  blog page and verify filter by tag option is displaying`,
    updateRetry(3),
    () => {
      cy.openStoreFront()
      cy.get(wordpressSelectors.BlogPage).click()
      cy.get(wordpressSelectors.SearchArticle).should('be.visible')
      cy.get(wordpressSelectors.DropdownTag).scrollIntoView()
    }
  )

  it(
    `${prefix} - Select any tag and verify tag option is working`,
    updateRetry(3),
    () => {
      cy.get(wordpressSelectors.DropdownTag).select('#1 ball in golf')
      cy.get(wordpresspost.oneBallInGolf.link).should('be.visible')
      cy.get(wordpressSelectors.DropdownTag).select("father's day")
      cy.get(wordpresspost.fathersDay.link).should('be.visible')
      cy.get(wordpressSelectors.DropdownTag).select("mother's day")
      cy.get(wordpresspost.mothersDay.link).should('be.visible')
    }
  )

  preserveCookie()
})

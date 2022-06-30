import { testSetup, updateRetry } from '../support/common/support'
import { verifyBreadcrumbsAndSlugUrl } from '../support/wordpress.common'
import wordpressSelectors from '../support/wordpress.selectors'

const categoryName = 'Lifestyle'
const prefix = 'Category filter'

describe('Categories filter and validate', () => {
  // Load test setup
  testSetup(false)

  it(`${prefix} - Open storefront and verify category filter is displaying`, () => {
    cy.openStoreFront()
    cy.get(wordpressSelectors.BlogPage).click()
    cy.get(wordpressSelectors.CategoryContainer).should('exist')
  })

  it(`${prefix} - Select category and verify only selected category related list is showing`, () => {
    cy.get(wordpressSelectors.CategorySelectField).select(categoryName)
    cy.get('body').then($body => {
      if ($body.find(wordpressSelectors.CategoryLink).length > 0) {
        const categoryListLength = $body.find(wordpressSelectors.CategoryLink)
          .length

        for (let i = 0; i < categoryListLength; i++) {
          cy.get(wordpressSelectors.CategoryLink).eq(i).contains(categoryName)
        }
      }
    })
  })

  it(`${prefix} - Verify slug on pagination url`, updateRetry(3), () => {
    verifyBreadcrumbsAndSlugUrl()
  })
})

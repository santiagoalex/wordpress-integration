import { testSetup } from '../support/common/support'
import { appDetails } from '../support/wordpress.outputvalidation'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import wordpressSelectors from '../support/wordpress.selectors'

const { titleTag, endpoint } = appDetails

const categoryName = 'Lifestyle'

describe('Categories filter and validate', () => {
  // Load test setup
  testSetup(false)

  describe('Enable categories filter and validate', () => {
    configureTargetWorkspace(endpoint, titleTag, { filterByCategories: true })

    it('Open storefront and verify category filter is displaying', () => {
      cy.openStoreFront()
      cy.get(wordpressSelectors.BlogPage).click()
      cy.get(wordpressSelectors.CategoryContainer).should('exist')
    })

    it('Select category and verify only selected category related list is showing', () => {
      cy.get(wordpressSelectors.CategorySelectField).select(categoryName)
      cy.get('body').then($body => {
        if ($body.find(wordpressSelectors.CategoryLink).length>0) {
          const categoryListLength = $body.find(wordpressSelectors.CategoryLink)
            .length
          cy.log(categoryListLength)
          for (let i=0; i < categoryListLength; i++) {
            cy.get(wordpressSelectors.CategoryLink)
              .eq(i)
              .contains(categoryName)
          }
        }
      })
    })
  })

  describe('Disable categories filter and validate', () => {
    configureTargetWorkspace(endpoint, titleTag, { filterByCategories: false })

    it('Open storefront and verify category filter is not displaying', () => {
      cy.openStoreFront()
      cy.get(wordpressSelectors.BlogPage).click()
      cy.get(wordpressSelectors.CategoryContainer).should('not.exist')
    })
  })
})

import { testSetup } from '../support/common/support'
import { appDetails } from '../support/wordpress.outputvalidation'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import wordpressSelectors from '../support/wordpress.selectors'

const { app, version, endpoint } = appDetails

const categoryName = 'Lifestyle'

describe('Categories filter and validate', () => {
  // Load test setup
  testSetup(false)

  describe('Enable categories filter and validate', () => {
    configureTargetWorkspace(app, version, endpoint, {
      filterByCategories: true,
    })

    it('Open storefront and verify category filter is displaying', () => {
      cy.visit('/blog')
      cy.get(wordpressSelectors.CategoryContainer).should('exist')
    })

    it('Select category and verify only selected category related list is showing', () => {
      cy.getVtexItems().then(vtex => {
        cy.intercept('POST', `${vtex.baseUrl}/**`).as('Filter')
        cy.get(wordpressSelectors.CategorySelectField).select(categoryName)
        cy.wait('@Filter')
        cy.get(wordpressSelectors.CategoryLink)
          .eq(1)
          .contains(categoryName)
      })
    })
  })

  describe('Disable categories filter and validate', () => {
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

    it('Open storefront and verify category filter is not displaying', () => {
      cy.visit('/blog')
      cy.get(wordpressSelectors.CategoryContainer).should('not.exist')
    })
  })
})

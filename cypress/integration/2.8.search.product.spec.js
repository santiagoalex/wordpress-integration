import {
  preserveCookie,
  testSetup,
  updateRetry,
} from '../support/common/support'
import { verifyBreadcrumbsAndSlugUrl } from '../support/wordpress.common'
import wordpressSelectors from '../support/wordpress.selectors'

const productName = 'golf'

describe('Search product scenarios', () => {
  testSetup()
  it('Open storefront and search product', updateRetry(3), () => {
    cy.searchProduct(productName)
  })

  it('Verify product and articles are displaying', updateRetry(3), () => {
    cy.get(wordpressSelectors.ListItemName).contains('Products')
    cy.get(wordpressSelectors.ListItemName).contains('Articles')
    cy.contains('Articles').click()
    cy.get(wordpressSelectors.TeaserContainer).should('be.visible')
  })

  it('Using pagination and opening articles', updateRetry(3), () => {
    cy.get(wordpressSelectors.PaginationComponent)
      .eq(1)
      .click()
    cy.contains('Slot Machine').should('be.visible')
    cy.contains('Slot Machine').click()
    cy.get(wordpressSelectors.PostContainer).should('be.visible')
  })

  it('Validate breadcrumbs', updateRetry(3), () => {
    cy.get(wordpressSelectors.BreadCrumbCurrentPage).should(
      'have.text',
      'Slot Machine – TaylorMade’s New Face Slot Technology'
    )
    cy.get(wordpressSelectors.BreadCrumbLink).should(
      'have.text',
      'Products and Brands'
    )
    cy.get(wordpressSelectors.BreadCrumbLink).click()
    cy.url().should('include', '/blog/category/new-products')
  })

  it('Verify slug in pagination', updateRetry(3), () => {
    verifyBreadcrumbsAndSlugUrl()
  })

  preserveCookie()
})

/* eslint-disable cypress/no-unnecessary-waiting */

import {
  preserveCookie,
  testSetup,
  updateRetry,
} from '../support/common/support'
import { configureTargetWorkspace } from '../support/wordpress.apis'
import wordpressSelectors from '../support/wordpressintegrationSelectors'
import { appDetails } from '../support/wordpress.outputvalidation'

const { titleTag, endpoint } = appDetails

describe('Verify Titles ,Breadcrumbs and titles', () => {
  testSetup()
  configureTargetWorkspace(endpoint, titleTag, { filterByCategories: true })

  it('verify title ,breadcrumbs and links are working', updateRetry(3), () => {
    cy.openStoreFront()
    cy.get(wordpressSelectors.BlogPage).click()
    cy.get(wordpressSelectors.SearchArticle).should('be.visible')
    cy.get(wordpressSelectors.ProductandBrandsTitle).contains(
      'Products and Brands'
    )
    cy.get(wordpressSelectors.LifestyleTitle).contains('Lifestyle')
    cy.get(wordpressSelectors.WattsIntheBagLink).click()
    cy.get(wordpressSelectors.NextGeneration).click()
    cy.get(wordpressSelectors.NextGenerationImage).should('be.visible')
    cy.get(wordpressSelectors.BlogPageBreadCrumb).click()
    cy.get(wordpressSelectors.ProductandBrandsTitle).contains(
      'Products and Brands'
    )
  })
  it('verify search articles,hyperlinks and title', updateRetry(3), () => {
    cy.get(wordpressSelectors.SearchArticle)
      .should('be.visible')
      .click()
      .type('Products and Brands {enter}')
      .wait(1000)
  })
  it(
    'verify filter by category in artciles results page',
    updateRetry(3),
    () => {
      cy.get(wordpressSelectors.CategoryDropdown).select('Lifestyle')
      cy.get(wordpressSelectors.LifestyleImage).should('be.visible')
      cy.get(wordpressSelectors.CategoryDropdown).select('Podcasts')
      cy.get(wordpressSelectors.PodcastsImage).should('be.visible')
    }
  )
  it('verify lifestyle ,hyperlinks and title', updateRetry(3), () => {
    cy.get(wordpressSelectors.BlogPageBreadCrumb).click()
    cy.get(wordpressSelectors.LifestyleTitle).contains('Lifestyle')
    cy.get(wordpressSelectors.LifestyleLink).click()
    cy.get(wordpressSelectors.CharlieHillImage).should('be.visible')
  })
  it('verify product and brands title,hyperlinks', updateRetry(3), () => {
    cy.get(wordpressSelectors.BlogPageBreadCrumb).click()
    cy.get(wordpressSelectors.ProductandBrandsTitle).contains(
      'Products and Brands'
    )
    cy.get(wordpressSelectors.NextGeneration).click()
    cy.get(wordpressSelectors.NextGenerationImage).should('be.visible')
  })
  it('verify slug on pagination url', updateRetry(3), () => {
    cy.get(wordpressSelectors.BlogPageBreadCrumb).click()
    cy.get(wordpressSelectors.SearchArticle).should('be.visible')
    cy.get(wordpressSelectors.Pagination).click()
    cy.url().should('include', '/blog?page=2')
    cy.get(wordpressSelectors.RoryMcllroy).should('be.visible')
  })
  preserveCookie()
})

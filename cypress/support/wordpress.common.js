import wordpressSelectors from './wordpress.selectors'

export function verifyFilterByDate() {
  cy.openStoreFront()
  cy.get(wordpressSelectors.BlogButton).click()
  cy.get(wordpressSelectors.VerifyDate).should('be.visible')
}

export function selectDateAndVerify() {
  cy.get(wordpressSelectors.SelectDate1).click()
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(1000)
  cy.get(wordpressSelectors.SelectMonth).click().click().click().click().click()
  cy.get(wordpressSelectors.SelectDay1).contains('19').click()
  cy.get(wordpressSelectors.SelectDate2).click()
  cy.get(wordpressSelectors.SelectDay2).contains('21').click()
  cy.get(wordpressSelectors.ApplyButton).click()
}

export function disableFilterByDate() {
  cy.openStoreFront()
  cy.get(wordpressSelectors.BlogButton).click()
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(5000)
  cy.get(wordpressSelectors.VerifyDate).should('not.exist')
}

export function verifyHomePageAndTitle() {
  cy.openStoreFront()
  cy.get(wordpressSelectors.BlogButton).click()
  cy.get('title').should('have.text', 'Blog')
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(1000)
}

export function verifyPostsAndPagination() {
  cy.get(wordpressSelectors.PaginationButton).should('be.visible').click()
  /* eslint-disable cypress/no-unnecessary-waiting */
  cy.wait(10000)
  //   cy.get(wordpressSelectors.VerifyPost).should(
  //     'be.visible'
  //   )
}

export function verifyLatestPostsAndCategoriesLink() {
  cy.get(wordpressSelectors.VerifyLatestPosts).should('be.visible')
  cy.get(wordpressSelectors.CategoryLink1).click()
  cy.get(wordpressSelectors.SelectPageLimit).select('20')
  cy.get(wordpressSelectors.Pagination).click()
  cy.get(wordpressSelectors.VerifyCategoryPosts).should('be.visible')
}

export function verifyPostNotFound() {
  cy.get(wordpressSelectors.BlogButton).click()
  cy.visit('blog/post/saravanan')
  cy.get('h2').should('be.visible')
}

export function verifyBreadcrumbsAndSlugUrl() {
  cy.get(wordpressSelectors.BlogPageBreadCrumb).click()
  cy.get(wordpressSelectors.SearchArticle).should('be.visible')
  cy.get(wordpressSelectors.Pagination).click()
  cy.url().should('include', '/blog?page=2')
  cy.get(wordpressSelectors.RoryMcllroy).should('be.visible')
}

export function verifyLayoutLatestPosts() {
  cy.get(
    '.vtex-wordpress-integration-2-x-latestPostsBlockFlexFirstColumnItem > .vtex-wordpress-integration-2-x-teaserContainer > .vtex-card > .tc-m > .vtex-wordpress-integration-2-x-teaserGradientOverlay'
  ).should('be.visible')
  cy.get(
    '.vtex-wordpress-integration-2-x-latestPostsBlockFlexSecondColumn'
  ).should('be.visible')
}
